import { NextResponse } from "next/server";
import { isAdminIP } from "@/lib/auth/ip";

export async function GET(request: Request) {
  const isAllowed = isAdminIP(request);
  return NextResponse.json(
    { isAllowed },
    {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    }
  );
}
