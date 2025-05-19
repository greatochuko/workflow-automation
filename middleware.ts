import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

const authRoutes = ["/login"];

const adminRoutes = ["/users", "/settings"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value || "";

  let isAuthenticated = false;
  let userRole;

  if (token) {
    const payload = await verifyToken(token);
    if (payload?.user.id) {
      isAuthenticated = true;
      userRole = payload.user.role;
    }
  }

  const { pathname } = request.nextUrl;

  // If authenticated and trying to access login, redirect to /
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    isAuthenticated &&
    userRole !== "ADMIN" &&
    adminRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not authenticated and trying to access protected routes, redirect to /login
  if (!isAuthenticated && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|static).*)"], // Only run middleware on application routes
};
