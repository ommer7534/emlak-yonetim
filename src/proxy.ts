import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    response.headers.set("x-admin-route", "1");

    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
