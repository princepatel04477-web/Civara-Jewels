import { NextResponse } from "next/server";
import { isAdminIP, getClientIP } from "@/lib/auth/ip";

export async function GET(request: Request) {
  const isAllowed = isAdminIP(request);
  const clientIp = getClientIP(request);
  return NextResponse.json(
    { isAllowed, clientIp },
    {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    }
  );
}
