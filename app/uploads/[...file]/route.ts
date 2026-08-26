import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { getUploadsDir } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { file: string[] } }
) {
  try {
    const filename = params.file.join("/");
    // Sanitize path traversal attempts
    const sanitized = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");

    // Search in priority order:
    // 1. data/uploads (local persistence)
    // 2. public/uploads (Next.js public directory)
    // 3. os.tmpdir()/civara_data/uploads (serverless persistence)
    const candidatePaths = [
      path.join(getUploadsDir(), sanitized),
      path.join(process.cwd(), "public", "uploads", sanitized),
      path.join(os.tmpdir(), "civara_data", "uploads", sanitized),
      path.join(process.cwd(), "uploads", sanitized),
    ];

    let foundPath: string | null = null;
    for (const candidate of candidatePaths) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        foundPath = candidate;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(foundPath);
    const ext = path.extname(foundPath).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".avif") contentType = "image/avif";
    else if (ext === ".svg") contentType = "image/svg+xml";
    else if (ext === ".gif") contentType = "image/gif";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Uploads Route Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

