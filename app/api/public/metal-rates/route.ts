import { NextResponse } from "next/server";
import { MetalRatesRepo } from "@/lib/db/repo/metal-rates";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rates = MetalRatesRepo.listRates(true);
    return NextResponse.json({ rates }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch metal rates" }, { status: 500 });
  }
}
