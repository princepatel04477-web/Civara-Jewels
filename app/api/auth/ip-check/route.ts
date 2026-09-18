import { NextResponse } from "next/server";
import { isSellerRequest, hasAdminAccess, getClientIP } from "@/lib/auth/ip";
import { getAdminSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  let isLoggedInAdmin = false;
  let isSellerUser = false;
  try {
    const session = await getAdminSession();
    if (session && session.isLoggedIn) {
      if (session.role === "admin") isLoggedInAdmin = true;
      if (session.role === "seller") isSellerUser = true;
    }
  } catch {}

  const isSeller = isSellerRequest(request) || isSellerUser;
  const isAllowed = !isSeller && hasAdminAccess(request);
  const clientIp = getClientIP(request);

  return NextResponse.json(
    { isAllowed, isSeller, clientIp, isLoggedInAdmin },
    {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    }
  );
}

