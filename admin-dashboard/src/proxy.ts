import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Gate the whole dashboard behind a login cookie. The value must match the
// server-side secret; the cookie is set only by /api/login on a correct password.
const COOKIE = "scolrly_admin";

export function proxy(request: NextRequest) {
  const expected = process.env.DASHBOARD_COOKIE || "bmi-authenticated";
  const authed = request.cookies.get(COOKIE)?.value === expected;
  if (!authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Run on everything except the login page, the login API, and static assets.
export const config = {
  matcher: ["/((?!login|api/login|_next/static|_next/image|favicon.ico).*)"],
};
