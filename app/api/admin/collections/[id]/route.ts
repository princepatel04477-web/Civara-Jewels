import { NextResponse } from "next/server";
import { CollectionRepo } from "@/lib/db/repo/collections";
import { updateCollectionSchema } from "@/lib/db/schemas/collection";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  const collection = CollectionRepo.getCollectionById(id);
  if (!collection) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ collection });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const body = await request.json();
    const parsed = updateCollectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    if (parsed.data.slug) {
      const existing = CollectionRepo.getCollectionBySlug(parsed.data.slug);
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
      }
    }

    const updated = CollectionRepo.updateCollection(id, parsed.data, adminEmail, ip);
    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, collection: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  const session = await getAdminSession();
  const adminEmail = session.email || "Admin";
  const ip = getClientIP(request);

  const res = CollectionRepo.deleteCollection(id, adminEmail, ip);
  if (!res.success) {
    return NextResponse.json({ error: res.error || "Failed to delete category" }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Category deleted successfully" });
}
