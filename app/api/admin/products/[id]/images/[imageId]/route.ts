import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { AuditRepo } from "@/lib/db/repo/audit";
import db from "@/lib/db/client";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const imageId = parseInt(params.imageId, 10);
  if (isNaN(imageId)) {
    return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
  }

  const session = await getAdminSession();
  const adminEmail = session.email || "Admin";
  const ip = getClientIP(request);

  const success = ProductRepo.removeProductImage(imageId, adminEmail, ip);
  if (!success) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Image removed successfully" });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const productId = parseInt(params.id, 10);
  const imageId = parseInt(params.imageId, 10);

  if (isNaN(productId) || isNaN(imageId)) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  const session = await getAdminSession();
  const adminEmail = session.email || "Admin";
  const ip = getClientIP(request);

  try {
    const body = await request.json().catch(() => ({}));
    if (body.alt !== undefined) {
      db.prepare("UPDATE product_images SET alt = ? WHERE id = ? AND product_id = ?").run(body.alt, imageId, productId);
    }

    if (body.is_primary === 1 || body.is_primary === true || body.setPrimary) {
      ProductRepo.setPrimaryImage(productId, imageId);
      AuditRepo.log({
        action: "IMAGE_SET_PRIMARY",
        entity: "ProductImage",
        entityId: imageId,
        adminEmail,
        ipAddress: ip,
        details: { productId, imageId },
      });
    }

    return NextResponse.json({ success: true, images: ProductRepo.listProductImages(productId) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update image" }, { status: 500 });
  }
}
