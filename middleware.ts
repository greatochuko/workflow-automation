import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

const authRoutes = ["/login"];

const adminRoutes = ["/users", "/settings"];

const publicRoutes = ["/privacy-policy", "/terms-of-service"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value || "";

  let isAuthenticated = false;
  let userRole;
  let userHasChangedPassword;

  if (token) {
    const payload = await verifyToken(token);
    if (payload?.user.id) {
      isAuthenticated = true;
      userRole = payload.user.role;
      userHasChangedPassword = payload.user.passwordChanged;
    }
  }

  // If authenticated and trying to access login, redirect to /
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    isAuthenticated &&
    !userHasChangedPassword &&
    userRole !== "ADMIN" &&
    pathname !== "/change-password"
  ) {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  if (
    isAuthenticated &&
    (userHasChangedPassword || userRole === "ADMIN") &&
    pathname === "/change-password"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    isAuthenticated &&
    userRole !== "ADMIN" &&
    adminRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated && userRole === "ADMIN" && pathname === "/") {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  if (
    isAuthenticated &&
    userRole !== "CLIENT" &&
    pathname === "/newsletter-content"
  ) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/users", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (
    isAuthenticated &&
    userRole !== "CLIENT" &&
    pathname.startsWith("/script-generator")
  ) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/users", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
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
