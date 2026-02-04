import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filePath = path.join("/");

  // Only serve known verification files
  const allowedFiles = ["assetlinks.json", "apple-app-site-association"];

  if (!allowedFiles.includes(filePath)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const fullPath = join(process.cwd(), "public", ".well-known", filePath);
    const content = await readFile(fullPath, "utf-8");

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
