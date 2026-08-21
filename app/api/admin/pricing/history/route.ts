import { NextResponse } from "next/server";
import { MetalRatesRepo } from "@/lib/db/repo/metal-rates";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const history = MetalRatesRepo.listHistory(limit);
    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch rate history" }, { status: 500 });
  }
}
