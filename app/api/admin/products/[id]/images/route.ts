import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { AuditRepo } from "@/lib/db/repo/audit";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const images = ProductRepo.listProductImages(productId);
  return NextResponse.json({ images });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = ProductRepo.getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const session = await getAdminSession();
  const adminEmail = session.email || "Admin";
  const ip = getClientIP(request);

  try {
    const formData = await request.formData();
    // Accept single or multiple files
    let files = formData.getAll("files") as File[];
    if (files.length === 0) {
      const singleFile = formData.get("file") as File | null;
      if (singleFile) files = [singleFile];
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No image files provided" }, { status: 400 });
    }

    const currentImages = ProductRepo.listProductImages(productId);
    const existingCount = currentImages.length;

    if (existingCount + files.length > 12) {
      return NextResponse.json(
        { error: `Gallery maximum limit reached. Current: ${existingCount}, Attempted: +${files.length}. Maximum allowed: 12 photos.` },
        { status: 400 }
      );
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    const maxSizeBytes = 12 * 1024 * 1024; // 12MB per photo

    const uploadsDir = path.join(process.cwd(), "data", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const savedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedMimeTypes.includes(file.type)) {
        continue;
      }
      if (file.size > maxSizeBytes) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const imagePipeline = sharp(buffer);
      const metadata = await imagePipeline.metadata();

      const uuid = crypto.randomUUID();
      const filename = `${uuid}.webp`;
      const diskPath = path.join(uploadsDir, filename);

      // Preserve jewelry photography fidelity: max 2400px edge, WebP quality 88 (near-lossless for stones)
      const outputBuffer = await imagePipeline
        .resize({
          width: metadata.width && metadata.width > 2400 ? 2400 : undefined,
          height: metadata.height && metadata.height > 2400 ? 2400 : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 88, effort: 4 })
        .toBuffer();

      fs.writeFileSync(diskPath, outputBuffer);

      const relativeWebPath = `/uploads/${filename}`;
      const isPrimary = existingCount === 0 && i === 0 ? 1 : 0;
      const sortOrder = existingCount + i;
      const alt = `${product.name} — View ${existingCount + i + 1}`;

      const newImage = ProductRepo.addProductImage(productId, relativeWebPath, alt, isPrimary, sortOrder);
      savedImages.push(newImage);
    }

    AuditRepo.log({
      action: "IMAGES_UPLOADED",
      entity: "ProductImage",
      entityId: productId,
      adminEmail,
      ipAddress: ip,
      details: { count: savedImages.length, productName: product.name },
    });

    return NextResponse.json(
      {
        success: true,
        images: ProductRepo.listProductImages(productId),
        uploadedCount: savedImages.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Image Batch Upload Error]", error);
    return NextResponse.json({ error: error.message || "Failed to process image uploads" }, { status: 500 });
  }
}

// Reorder images
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const session = await getAdminSession();
    const adminEmail = session.email || "Admin";
    const ip = getClientIP(request);

    const body = await request.json();
    const imageIds = body.imageIds as number[];

    if (!Array.isArray(imageIds)) {
      return NextResponse.json({ error: "imageIds must be an array of image IDs" }, { status: 400 });
    }

    ProductRepo.reorderImages(productId, imageIds);

    AuditRepo.log({
      action: "IMAGES_REORDERED",
      entity: "ProductImage",
      entityId: productId,
      adminEmail,
      ipAddress: ip,
      details: { newOrder: imageIds },
    });

    return NextResponse.json({ success: true, images: ProductRepo.listProductImages(productId) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reorder images" }, { status: 500 });
  }
}
