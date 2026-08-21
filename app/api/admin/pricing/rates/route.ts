import { NextResponse } from "next/server";
import { MetalRatesRepo } from "@/lib/db/repo/metal-rates";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { z } from "zod";

const createRateSchema = z.object({
  metal: z.string().min(1, "Metal name is required"),
  purity: z.string().min(1, "Purity is required"),
  rate_inr: z.number().int().positive("Rate must be positive in INR"),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const rates = MetalRatesRepo.listRates(activeOnly);
    return NextResponse.json({ rates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch metal rates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const body = await request.json();
    const parsed = createRateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const created = MetalRatesRepo.createRate({
      metal: parsed.data.metal,
      purity: parsed.data.purity,
      rate_inr: parsed.data.rate_inr,
      updated_by: adminEmail,
      ip_address: ip,
    });

    return NextResponse.json({ success: true, rate: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create metal rate" }, { status: 500 });
  }
}
