import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_PATH =
  /^\/(?:$|about|contact|privacy|seoul|gyeonggi|metropolitan(?:\/[a-z]+)?|local(?:\/[a-z]+)?|admin(?:\/.*)?|api\/.*|sitemap\.xml|robots\.txt|rss\.xml|ads\.txt|favicon\.(?:ico|png)|icon\.png|apple-icon\.png|uploads\/.*)$/;

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  if (hostname.startsWith("www.")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = hostname.slice(4);
    return NextResponse.redirect(redirectUrl, 301);
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (VALID_PATH.test(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url), 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
};
