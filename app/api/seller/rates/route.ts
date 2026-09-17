import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { MetalRatesRepo } from "@/lib/db/repo/metal-rates";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { z } from "zod";

export const dynamic = "force-dynamic";

const batchUpdateSchema = z.object({
  rates: z.array(
    z.object({
      id: z.number().optional(),
      metal: z.string().optional(),
      purity: z.string().min(1),
      rate_inr: z.number().int().positive(),
    })
  ),
});

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rates = MetalRatesRepo.listRates(false);
    const history = MetalRatesRepo.listHistory(15);

    // Find the latest update info
    const lastUpdate = history.length > 0 ? history[0] : null;

    return NextResponse.json({
      rates,
      history,
      lastUpdated: lastUpdate
        ? {
            at: lastUpdate.changed_at,
            by: lastUpdate.changed_by,
            oldRate: lastUpdate.old_rate,
            newRate: lastUpdate.new_rate,
            purity: lastUpdate.purity,
          }
        : null,
      currentUser: {
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch seller metal rates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerEmail = session.email || "Seller";
    const ip = getClientIP(request);

    const body = await request.json();
    const parsed = batchUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid rate data provided" },
        { status: 400 }
      );
    }

    const updatedRates: any[] = [];

    for (const item of parsed.data.rates) {
      const existing = MetalRatesRepo.getRateByPurity(item.purity);
      if (existing) {
        const updated = MetalRatesRepo.updateRate(existing.id, {
          rate_inr: item.rate_inr,
          updated_by: sellerEmail,
          ip_address: ip,
        });
        if (updated) updatedRates.push(updated);
      } else {
        const created = MetalRatesRepo.createRate({
          metal: item.metal || "Gold",
          purity: item.purity,
          rate_inr: item.rate_inr,
          updated_by: sellerEmail,
          ip_address: ip,
        });
        if (created) updatedRates.push(created);
      }
    }

    const refreshedRates = MetalRatesRepo.listRates(false);
    const refreshedHistory = MetalRatesRepo.listHistory(15);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/products/[id]", "page");
      revalidatePath("/collections/[category]", "page");
      revalidatePath("/api/public/metal-rates");
    } catch {
      // best-effort
    }

    return NextResponse.json({
      success: true,
      message: "Daily gold rates updated and published live across the boutique.",
      rates: refreshedRates,
      history: refreshedHistory,
      updatedAt: new Date().toISOString(),
      updatedBy: sellerEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update seller metal rates" },
      { status: 500 }
    );
  }
}
