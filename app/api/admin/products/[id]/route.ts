import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";
import { updateProductSchema } from "@/lib/db/schemas/product";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = ProductRepo.getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(
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

    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    if (parsed.data.slug) {
      const existing = ProductRepo.getProductBySlug(parsed.data.slug);
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
      }
    }

    const updated = ProductRepo.updateProduct(id, parsed.data, adminEmail, ip);
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const session = await getAdminSession();
  const adminEmail = session.email || "Admin";
  const ip = getClientIP(request);

  const success = ProductRepo.deleteProduct(id, adminEmail, ip);
  if (!success) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Product and associated images deleted successfully" });
}
