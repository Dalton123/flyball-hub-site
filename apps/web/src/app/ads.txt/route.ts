import { NextResponse } from "next/server";

export const revalidate = 86400; // 24 hours

export async function GET() {
  const adsTxt = "google.com, pub-7614147681863452, DIRECT, f08c47fec0942fa0";
  return new NextResponse(adsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
