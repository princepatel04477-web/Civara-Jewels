import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { file: string[] } }
) {
  try {
    const filename = params.file.join("/");
    // Sanitize path traversal attempts
    const sanitized = path.normalize(filename).replace(/^(\.\.[\/\\])+/, "");
    const diskPath = path.join(process.cwd(), "data", "uploads", sanitized);

    if (!fs.existsSync(diskPath) || !fs.statSync(diskPath).isFile()) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(diskPath);
    const ext = path.extname(diskPath).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".avif") contentType = "image/avif";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
