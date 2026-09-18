import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ProductRepo } from "@/lib/db/repo/products";
import { updateProductSchema } from "@/lib/db/schemas/product";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const rawId = params.id;
  const numId = parseInt(rawId, 10);
  const product = !isNaN(numId)
    ? ProductRepo.getProductById(numId)
    : ProductRepo.getProductBySlug(rawId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const rawId = params.id;
  const numId = parseInt(rawId, 10);
  const existingProduct = !isNaN(numId)
    ? ProductRepo.getProductById(numId)
    : ProductRepo.getProductBySlug(rawId);

  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const id = existingProduct.id;
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

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/products");
    } catch {
      // ignore
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
  try {
    const rawId = params.id;
    if (!rawId) {
      return NextResponse.json({ error: "Invalid product identifier" }, { status: 400 });
    }

    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    // Warm the deleted-slugs cache from Vercel Blob before running deletion
    // so the in-memory cache is current on this lambda instance
    try {
      const { getDeletedSlugs } = await import("@/lib/db/cloud-sync");
      await getDeletedSlugs();
    } catch {
      // non-fatal
    }

    const success = ProductRepo.deleteProduct(rawId, adminEmail, ip);
    if (!success) {
      return NextResponse.json({ error: "Product not found or already deleted" }, { status: 404 });
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/admin/products");
      revalidatePath(`/products/${rawId}`);
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  } catch (error: any) {
    console.error("[DELETE Product Error]", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to delete product from database.",
        details: process.env.NODE_ENV !== "production" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
