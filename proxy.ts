import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecretkey123",
);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define routes
  const isAuthRoute = pathname === "/";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If user is not logged in and trying to access dashboard, redirect to home/login
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const isAdmin = payload.admin === true;
      const isApproved = payload.approved === true;

      // 1. If trying to access dashboard but not approved, redirect home
      if (isDashboardRoute && !isApproved) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // 2. If trying to access admin-only routes but not admin, redirect to main dashboard
      const isAdminOnlyRoute = pathname.startsWith("/dashboard/user");
      if (isAdminOnlyRoute && !isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 3. If user is logged in and trying to access auth page (home), redirect to dashboard
      if (isAuthRoute && isApproved) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Proxy JWT error:", error);
      // If token is invalid, treat as logged out
      if (isDashboardRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Config to match routes
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
