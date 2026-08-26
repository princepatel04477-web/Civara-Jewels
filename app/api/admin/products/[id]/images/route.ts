import { NextResponse } from "next/server";
import { ProductRepo } from "@/lib/db/repo/products";
import { getAdminSession } from "@/lib/auth/session";
import { getClientIP } from "@/lib/auth/ip";
import { AuditRepo } from "@/lib/db/repo/audit";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getUploadsDir } from "@/lib/db/client";

function resolveProduct(idOrSlug: string) {
  const numericId = parseInt(idOrSlug, 10);
  if (!isNaN(numericId)) {
    const p = ProductRepo.getProductById(numericId);
    if (p) return p;
  }
  return ProductRepo.getProductBySlug(idOrSlug);
}

function saveBufferToUploads(filename: string, buffer: Buffer): string {
  const uploadsDir = getUploadsDir();
  const publicUploadsDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(publicUploadsDir)) {
    try {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    } catch {
      // ignore
    }
  }

  // 1. Write to persistent uploads dir
  try {
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  } catch (err) {
    console.error("[Disk Upload Write Error: Data Dir]", err);
  }

  // 2. Write to public uploads dir for instant static serving
  try {
    fs.writeFileSync(path.join(publicUploadsDir, filename), buffer);
  } catch (err) {
    console.error("[Disk Upload Write Error: Public Dir]", err);
  }

  return `/uploads/${filename}`;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = resolveProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const images = ProductRepo.listProductImages(product.id);
  return NextResponse.json({ images });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = resolveProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const productId = product.id;

  const session = await getAdminSession();
  const adminEmail = session.email || "Admin";
  const ip = getClientIP(request);

  try {
    const contentType = request.headers.get("content-type") || "";
    const currentImages = ProductRepo.listProductImages(productId);
    const existingCount = currentImages.length;
    const savedImages = [];

    // Mode 1: JSON payload with Base64 / URL strings
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const items: Array<{ path?: string; dataUrl?: string; url?: string; alt?: string }> = Array.isArray(body.images)
        ? body.images
        : body.dataUrl || body.path || body.url
        ? [body]
        : [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let imagePath = item.path || item.url || "";

        if (item.dataUrl && item.dataUrl.startsWith("data:image/")) {
          const match = item.dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            const rawExt = match[1].toLowerCase().replace("jpeg", "jpg");
            const base64Data = match[2];
            const buffer = Buffer.from(base64Data, "base64");
            const uuid = crypto.randomUUID();
            const filename = `${uuid}.${rawExt}`;

            try {
              imagePath = saveBufferToUploads(filename, buffer);
            } catch {
              // fallback to storing dataUrl directly if disk write is constrained
              imagePath = item.dataUrl;
            }
          }
        }

        if (imagePath) {
          const isPrimary = existingCount === 0 && i === 0 ? 1 : 0;
          const sortOrder = existingCount + i;
          const alt = item.alt || `${product.name} — View ${existingCount + i + 1}`;
          const newImg = ProductRepo.addProductImage(productId, imagePath, alt, isPrimary, sortOrder);
          savedImages.push(newImg);
        }
      }
    } else {
      // Mode 2: Standard multipart/form-data upload
      const formData = await request.formData();
      const files: File[] = [];

      // Extract all file fields regardless of input naming
      for (const [, value] of formData.entries()) {
        if (value && typeof value === "object" && "arrayBuffer" in value && (value as File).size > 0) {
          files.push(value as File);
        }
      }

      if (files.length === 0) {
        return NextResponse.json({ error: "No valid image files provided." }, { status: 400 });
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const lowerName = file.name.toLowerCase();
        let ext = ".jpg";
        if (lowerName.endsWith(".png") || file.type.includes("png")) ext = ".png";
        else if (lowerName.endsWith(".webp") || file.type.includes("webp")) ext = ".webp";
        else if (lowerName.endsWith(".avif") || file.type.includes("avif")) ext = ".avif";
        else if (lowerName.endsWith(".svg") || file.type.includes("svg")) ext = ".svg";

        let outputBuffer: Buffer = buffer;
        let finalExt = ext;

        // Try sharp optimization if available, otherwise preserve raw buffer
        try {
          const sharpModule = await import("sharp");
          const sharp = sharpModule.default || sharpModule;
          const imagePipeline = sharp(buffer);
          const metadata = await imagePipeline.metadata();

          outputBuffer = await imagePipeline
            .resize({
              width: metadata.width && metadata.width > 2400 ? 2400 : undefined,
              height: metadata.height && metadata.height > 2400 ? 2400 : undefined,
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({ quality: 90, effort: 4 })
            .toBuffer();
          finalExt = ".webp";
        } catch {
          // Keep raw outputBuffer and original extension
          outputBuffer = buffer;
          finalExt = ext;
        }

        const uuid = crypto.randomUUID();
        const filename = `${uuid}${finalExt}`;

        let relativeWebPath = `/uploads/${filename}`;
        try {
          relativeWebPath = saveBufferToUploads(filename, outputBuffer);
        } catch {
          const mimeType = finalExt === ".webp" ? "image/webp" : file.type || "image/jpeg";
          relativeWebPath = `data:${mimeType};base64,${outputBuffer.toString("base64")}`;
        }

        const isPrimary = existingCount === 0 && i === 0 ? 1 : 0;
        const sortOrder = existingCount + i;
        const alt = `${product.name} — View ${existingCount + i + 1}`;

        const newImage = ProductRepo.addProductImage(productId, relativeWebPath, alt, isPrimary, sortOrder);
        savedImages.push(newImage);
      }
    }

    try {
      AuditRepo.log({
        action: "IMAGES_UPLOADED",
        entity: "ProductImage",
        entityId: productId,
        adminEmail,
        ipAddress: ip,
        details: { count: savedImages.length, productName: product.name },
      });
    } catch {
      // non-blocking
    }

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
  const product = resolveProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const productId = product.id;

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

    try {
      AuditRepo.log({
        action: "IMAGES_REORDERED",
        entity: "ProductImage",
        entityId: productId,
        adminEmail,
        ipAddress: ip,
        details: { newOrder: imageIds },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, images: ProductRepo.listProductImages(productId) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reorder images" }, { status: 500 });
  }
}

