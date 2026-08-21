import { NextResponse } from "next/server";
import { RingSizesRepo } from "@/lib/db/repo/ring-sizes";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { z } from "zod";

const updateRingConfigSchema = z.object({
  min_size: z.number().positive(),
  max_size: z.number().positive(),
  increment: z.number().positive(),
  pricing_mode: z.enum(["SAME_PRICE", "VARIABLE"]).optional(),
});

export async function GET() {
  try {
    const config = RingSizesRepo.getConfig();
    const sizes = RingSizesRepo.generateSizeList(config);
    return NextResponse.json({ config, sizes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch ring sizes config" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const body = await request.json();
    const parsed = updateRingConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    if (parsed.data.min_size >= parsed.data.max_size) {
      return NextResponse.json({ error: "Minimum size must be less than maximum size" }, { status: 400 });
    }

    const updated = RingSizesRepo.updateConfig({
      ...parsed.data,
      adminEmail,
      ipAddress: ip,
    });

    const sizes = RingSizesRepo.generateSizeList(updated);
    return NextResponse.json({ success: true, config: updated, sizes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update ring config" }, { status: 500 });
  }
}
