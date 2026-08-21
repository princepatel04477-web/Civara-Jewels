import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || searchParams.get("collection") || undefined;
    const featured = searchParams.get("featured");
    const search = searchParams.get("search") || undefined;
    const metal = searchParams.get("metal") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : undefined;

    const filter = {
      published: 1, // Public API ONLY returns published products
      collectionSlug: category,
      featured: featured === "true" || featured === "1" ? 1 : undefined,
      search,
      metal,
      sortBy,
      limit,
      offset,
    };

    const result = ProductRepo.listProducts(filter);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}
