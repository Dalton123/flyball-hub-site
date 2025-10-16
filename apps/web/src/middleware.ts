import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");
  const url = request.nextUrl;

  // Redirect www to non-www
  if (hostname === "www.flyballhub.com") {
    url.host = "flyballhub.com";
    return NextResponse.redirect(url, 308);
  }

  // Redirect Vercel subdomain to production domain
  if (hostname === "flyball-hub-site-web.vercel.app") {
    url.host = "flyballhub.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
