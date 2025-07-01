import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./server/api/axios";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path === "/" ||
    path === "/home" ||
    path === "/login" ||
    path === "/register";

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await api.get("/auth/check-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.expired) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token validation error:", error);

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

// Apply middleware to all routes except public paths
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|/|home|login|register).*)",
  ],
};
