import { NextResponse } from "next/server";
import { MetalRatesRepo } from "@/lib/db/repo/metal-rates";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { z } from "zod";

const updateRateSchema = z.object({
  metal: z.string().optional(),
  purity: z.string().optional(),
  rate_inr: z.number().int().positive().optional(),
  is_active: z.number().int().min(0).max(1).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid rate ID" }, { status: 400 });
  }

  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const body = await request.json();
    const parsed = updateRateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const updated = MetalRatesRepo.updateRate(id, {
      ...parsed.data,
      updated_by: adminEmail,
      ip_address: ip,
    });

    if (!updated) {
      return NextResponse.json({ error: "Metal rate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, rate: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update metal rate" }, { status: 500 });
  }
}
