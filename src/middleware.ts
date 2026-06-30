import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_PATH =
  /^\/(?:$|about|contact|privacy|seoul|gyeonggi|metropolitan(?:\/[a-z]+)?|local(?:\/[a-z]+)?|admin(?:\/.*)?|api\/.*|sitemap\.xml|robots\.txt|ads\.txt|favicon\.(?:ico|png)|icon\.png|apple-icon\.png|uploads\/.*)$/;

export function middleware(request: NextRequest) {
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
