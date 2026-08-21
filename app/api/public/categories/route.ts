import { NextResponse } from "next/server";
import { CollectionRepo } from "@/lib/db/repo/collections";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = CollectionRepo.listCollections({ activeOnly: true });
    return NextResponse.json({ categories }, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}
