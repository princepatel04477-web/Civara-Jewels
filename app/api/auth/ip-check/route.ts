import { NextResponse } from "next/server";
import { isAdminIP, isSellerIP, getClientIP } from "@/lib/auth/ip";

export async function GET(request: Request) {
  const isAllowed = isAdminIP(request);
  const isSeller = isSellerIP(request);
  const clientIp = getClientIP(request);
  return NextResponse.json(
    { isAllowed, isSeller, clientIp },
    {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    }
  );
}
