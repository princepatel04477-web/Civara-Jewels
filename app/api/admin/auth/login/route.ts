import { NextResponse } from "next/server";
import { UserRepo } from "@/lib/db/repo/users";
import { AuditRepo } from "@/lib/db/repo/audit";
import { verifyPassword } from "@/lib/auth/password";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { loginSchema } from "@/lib/db/schemas/user";

// In-memory rate limiting map for login attempts: IP -> { attempts: number, resetTime: number }
const loginAttemptsMap = new Map<string, { attempts: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const now = Date.now();

  try {
    // 1. Check Rate Limit
    const rateData = loginAttemptsMap.get(ip);
    if (rateData) {
      if (now > rateData.resetTime) {
        loginAttemptsMap.delete(ip);
      } else if (rateData.attempts >= MAX_ATTEMPTS) {
        const remainingMinutes = Math.ceil((rateData.resetTime - now) / 60000);
        AuditRepo.log({
          action: "LOGIN_RATE_LIMITED",
          entity: "Auth",
          adminEmail: null,
          ipAddress: ip,
          details: { error: "Rate limit exceeded" },
        });
        return NextResponse.json(
          {
            error: `Too many failed attempts. Access temporarily locked. Please retry in ${remainingMinutes} minute(s).`,
          },
          { status: 429 }
        );
      }
    }

    // 2. Parse & Validate
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = UserRepo.findByEmail(email);

    if (!user) {
      recordFailedAttempt(ip, now);
      AuditRepo.log({
        action: "LOGIN_FAILED",
        entity: "Auth",
        adminEmail: email,
        ipAddress: ip,
        details: { reason: "User not found" },
      });
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      recordFailedAttempt(ip, now);
      AuditRepo.log({
        action: "LOGIN_FAILED",
        entity: "Auth",
        adminEmail: email,
        ipAddress: ip,
        details: { reason: "Incorrect password" },
      });
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    // Success -> clear rate limits
    loginAttemptsMap.delete(ip);

    // Save Session
    const session = await getAdminSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name || "Civara Admin";
    session.isLoggedIn = true;
    await session.save();

    AuditRepo.log({
      action: "LOGIN_SUCCESS",
      entity: "Auth",
      entityId: user.id,
      adminEmail: user.email,
      ipAddress: ip,
      details: { role: user.role },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json(
      { error: "An unexpected authentication error occurred." },
      { status: 500 }
    );
  }
}

function recordFailedAttempt(ip: string, now: number) {
  const current = loginAttemptsMap.get(ip);
  if (current && now <= current.resetTime) {
    current.attempts += 1;
  } else {
    loginAttemptsMap.set(ip, {
      attempts: 1,
      resetTime: now + WINDOW_MS,
    });
  }
}
