import { NextRequest, NextResponse } from "next/server";

const PRODUCTION_URL = "flyballhub.com";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Check if we need to redirect to production domain
  const shouldRedirect =
    hostname === "www.flyballhub.com" ||
    hostname === "flyball-hub-site-web.vercel.app";

  if (shouldRedirect) {
    const url = request.nextUrl.clone();
    url.host = PRODUCTION_URL;
    url.protocol = "https:";
    
    return NextResponse.redirect(url, {
      status: 308, // Permanent redirect
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
