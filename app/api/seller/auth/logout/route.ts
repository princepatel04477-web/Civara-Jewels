import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { AuditRepo } from "@/lib/db/repo/audit";
import { getClientIP } from "@/lib/auth/ip";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getAdminSession();
  const email = session.email;
  const ip = getClientIP(request);

  if (email) {
    try {
      AuditRepo.log({
        action: "LOGOUT",
        entity: "SellerAuth",
        adminEmail: email,
        ipAddress: ip,
      });
    } catch {
      // non-blocking
    }
  }

  session.destroy();

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  // Clear seller network cookie on explicit logout
  response.cookies.set("civara_seller_network", "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}
