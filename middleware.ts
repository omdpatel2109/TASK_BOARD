import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/board"];
const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isProtected = protectedRoutes.some((route) =>
        path === route || path.startsWith(`${route}/`)
    );

    const isPublic = publicRoutes.includes(path);

    const token = request.cookies.get("access_token")?.value;

    // Redirect unauthenticated users to login
    if (isProtected && !token) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    // Redirect authenticated users away from login
    if (isPublic && token) {
        return NextResponse.redirect(
            new URL("/board", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/board/:path*", "/login"],
};
