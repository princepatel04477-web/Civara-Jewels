import { NextResponse } from "next/server";
import { MetalRatesRepo } from "@/lib/db/repo/metal-rates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const rates = MetalRatesRepo.listRates(true);
    return NextResponse.json({ rates }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch metal rates" }, { status: 500 });
  }
}

