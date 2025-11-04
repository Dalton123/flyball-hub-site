import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");

  // Domain-level www redirect (flyballhub.com → www.flyballhub.com) 
  // is now handled by Vercel platform configuration (308 redirect)
  // Removed from middleware to prevent double redirect hops

  // Keep Vercel subdomain redirect since this isn't configured at platform level
  if (hostname === "flyball-hub-site-web.vercel.app") {
    const newUrl = new URL(request.url);
    newUrl.hostname = "www.flyballhub.com";
    newUrl.protocol = "https:";
    newUrl.port = "";

    return NextResponse.redirect(newUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude static files, images, favicon, robots.txt, and ads.txt from middleware
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|ads.txt|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)",
  ],
};
