import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { AuditRepo } from "@/lib/db/repo/audit";
import { getClientIP } from "@/lib/auth/ip";

export async function POST(request: Request) {
  const session = await getAdminSession();
  const email = session.email;
  const ip = getClientIP(request);

  if (email) {
    AuditRepo.log({
      action: "LOGOUT",
      entity: "Auth",
      adminEmail: email,
      ipAddress: ip,
    });
  }

  session.destroy();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session || !session.isLoggedIn) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
  return NextResponse.json({
    isLoggedIn: true,
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
    },
  });
}
