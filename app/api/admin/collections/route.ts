import { NextResponse } from "next/server";
import { CollectionRepo } from "@/lib/db/repo/collections";
import { createCollectionSchema } from "@/lib/db/schemas/collection";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const activeOnly = searchParams.get("active") === "true";

    const collections = CollectionRepo.listCollections({ search, activeOnly });
    return NextResponse.json({ collections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const body = await request.json();
    const parsed = createCollectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const existing = CollectionRepo.getCollectionBySlug(parsed.data.slug);
    if (existing) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
    }

    const created = CollectionRepo.createCollection(parsed.data, adminEmail, ip);
    return NextResponse.json({ success: true, collection: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const categoryIds = body.categoryIds as number[];

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json({ error: "categoryIds must be an array of IDs" }, { status: 400 });
    }

    CollectionRepo.reorderCollections(categoryIds);
    return NextResponse.json({ success: true, collections: CollectionRepo.listCollections() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reorder categories" }, { status: 500 });
  }
}
