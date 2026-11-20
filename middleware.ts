// import { NextRequest, NextResponse } from "next/server";

// const protectedRoutes = [
//     "/board",
//     "/tasks",
//     "/workflows",
// ];

// const publicRoutes = ["/login"];

// export function middleware(request: NextRequest) {
//     const path = request.nextUrl.pathname;

//     const isProtected = protectedRoutes.some((route) =>
//         path === route || path.startsWith(`${route}/`)
//     );

//     const isPublic = publicRoutes.includes(path);

//     const token = request.cookies.get("access_token")?.value;

//     if (isProtected && !token) {
//         return NextResponse.redirect(
//             new URL("/login", request.url)
//         );
//     }

//     if (isPublic && token) {
//         return NextResponse.redirect(
//             new URL("/board", request.url)
//         );
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         "/board/:path*",
//         "/tasks/:path*",
//         "/workflows/:path*",
//         "/login",
//     ],
// };

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/board", "/tasks", "/workflows"];
const publicRoutes = ["/login"];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtected = protectedRoutes.some((route) =>
        path === route || path.startsWith(`${route}/`)
    );

    const isPublic = publicRoutes.includes(path);

    const token = request.cookies.get("access_token")?.value;

    // Redirect unauthenticated users to login.
    if(isProtected && !token){
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    // Redirect authenticated users to workflow selection.
    if(isPublic && token){
        return NextResponse.redirect(
            new URL("/workflows", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/board/:path*", "/tasks/:path*", "/workflows/:path*", "/login"],
};