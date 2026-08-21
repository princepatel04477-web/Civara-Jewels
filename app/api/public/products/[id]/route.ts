import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    const numericId = parseInt(rawId, 10);

    const product = !isNaN(numericId)
      ? ProductRepo.getProductById(numericId)
      : ProductRepo.getProductBySlug(rawId);

    if (!product || product.is_published !== 1) {
      return NextResponse.json({ error: "Product not found or not published" }, { status: 404 });
    }

    return NextResponse.json({ product }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch product" }, { status: 500 });
  }
}
