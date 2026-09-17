import { NextResponse } from "next/server";
import { UserRepo } from "@/lib/db/repo/users";
import { getAdminSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { AuditRepo } from "@/lib/db/repo/audit";
import { getClientIP } from "@/lib/auth/ip";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSellerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !session.isLoggedIn || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Master Admin only" }, { status: 403 });
    }

    const sellers = UserRepo.listSellers();
    return NextResponse.json({ sellers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to list sellers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !session.isLoggedIn || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Master Admin only" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createSellerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid seller details" },
        { status: 400 }
      );
    }

    const ip = getClientIP(request);
    const passwordHash = await hashPassword(parsed.data.password);

    const user = UserRepo.upsertSeller({
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name || "Civara Seller",
    });

    try {
      AuditRepo.log({
        action: "SELLER_ACCOUNT_CREATED",
        entity: "User",
        entityId: user.id,
        adminEmail: session.email,
        ipAddress: ip,
        details: { email: user.email, name: user.name, role: "seller" },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      seller: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create seller" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !session.isLoggedIn || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Master Admin only" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "", 10);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Valid seller ID required" }, { status: 400 });
    }

    const success = UserRepo.deleteUser(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete seller" }, { status: 500 });
  }
}
