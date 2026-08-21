import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";
import { createProductSchema } from "@/lib/db/schemas/product";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const publishedParam = searchParams.get("published");
    const featuredParam = searchParams.get("featured");
    const collectionIdParam = searchParams.get("collectionId");
    const metal = searchParams.get("metal") || undefined;
    const purity = searchParams.get("purity") || undefined;
    const stockStatus = searchParams.get("stockStatus") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    const filter = {
      search,
      published: publishedParam !== null ? publishedParam === "true" || publishedParam === "1" : undefined,
      featured: featuredParam !== null ? featuredParam === "true" || featuredParam === "1" : undefined,
      collectionId: collectionIdParam ? parseInt(collectionIdParam, 10) : undefined,
      metal,
      purity,
      stockStatus,
      sortBy,
      limit: limitParam ? parseInt(limitParam, 10) : undefined,
      offset: offsetParam ? parseInt(offsetParam, 10) : undefined,
    };

    const result = ProductRepo.listProducts(filter);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = ProductRepo.getProductBySlug(parsed.data.slug);
    if (existing) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
    }

    const created = ProductRepo.createProduct(parsed.data, adminEmail, ip);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
