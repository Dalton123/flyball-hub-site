import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");

  // Redirect non-www to www
  if (hostname === "flyballhub.com") {
    const newUrl = new URL(request.url);
    newUrl.hostname = "www.flyballhub.com";
    newUrl.protocol = "https:";
    newUrl.port = "";

    return NextResponse.redirect(newUrl, 308);
  }

  // Redirect Vercel subdomain to production domain
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
