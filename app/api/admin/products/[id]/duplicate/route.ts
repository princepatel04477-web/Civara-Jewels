import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const duplicated = ProductRepo.duplicateProduct(id, adminEmail, ip);
    if (!duplicated) {
      return NextResponse.json({ error: "Product not found to duplicate" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: duplicated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to duplicate product" }, { status: 500 });
  }
}
