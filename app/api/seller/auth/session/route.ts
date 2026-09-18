import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

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
      role: session.role || "seller",
    },
  });
}
