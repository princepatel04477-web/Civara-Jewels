import { NextResponse } from "next/server";
import { RingSizesRepo } from "@/lib/db/repo/ring-sizes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = RingSizesRepo.getConfig();
    const sizes = RingSizesRepo.generateSizeList(config);
    return NextResponse.json({ 
      config: {
        min_size: config.min_size,
        max_size: config.max_size,
        increment: config.increment,
        pricing_mode: config.pricing_mode,
        chart_image_url: config.chart_image_url || "/images/Civaraa_Ring_size.png",
      }, 
      sizes 
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch ring sizes" }, { status: 500 });
  }
}
