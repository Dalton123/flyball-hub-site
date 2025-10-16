import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");

  // Only redirect the Vercel subdomain
  // Let Vercel domain settings handle www redirect to avoid conflicts
  if (hostname === "flyball-hub-site-web.vercel.app") {
    const newUrl = new URL(request.url);
    newUrl.hostname = "flyballhub.com";
    newUrl.protocol = "https:";
    newUrl.port = "";

    return NextResponse.redirect(newUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
