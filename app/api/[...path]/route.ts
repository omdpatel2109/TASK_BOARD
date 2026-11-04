    // import { NextRequest, NextResponse } from "next/server";
    // import { cookies } from "next/headers";
    // import axios from "axios";
    // import { serverApi } from "@/lib/serverApi";

    // const COOKIE_NAME = "access_token";

    // // Verify token using DummyJSON
    // async function verifyToken(token: string): Promise<boolean> {
    //     try {
    //         await axios.get("https://dummyjson.com/auth/me", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             timeout: 10000,
    //         });

    //         return true;
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             if (error.response?.status === 401) {
    //                 return false;
    //             }
    //         }

    //         throw error;
    //     }
    // }

    // // Handle API requests
    // async function handleRequest(request: NextRequest) {
    //     try {
    //         // 1. Read token from HttpOnly cookie
    //         const cookieStore = await cookies();

    //         const token = cookieStore.get(COOKIE_NAME)?.value;

    //         if (!token) {
    //             return NextResponse.json(
    //                 { message: "Unauthorized. Please login." },
    //                 { status: 401 }
    //             );
    //         }

    //         // 2. Verify token with DummyJSON
    //         const isValid = await verifyToken(token);

    //         if (!isValid) {
    //             return NextResponse.json(
    //                 { message: "Invalid or expired token. Please login again." },
    //                 { status: 401 }
    //             );
    //         }

    //         // 3. Get requested resource
    //         const path = request.nextUrl.pathname.replace(/^\/api\//, "");

    //         // Only allow these resources
    //         const allowedResources = ["tasks", "columns", "comments"];

    //         const resource = path.split("/")[0];

    //         if (!allowedResources.includes(resource)) {
    //             return NextResponse.json(
    //                 { message: "Resource not allowed." },
    //                 { status: 404 }
    //             );
    //         }

    //         // 4. Preserve query parameters
    //         const query = request.nextUrl.search;

    //         // 5. Read request body
    //         let data: unknown = undefined;

    //         if (["POST", "PATCH", "PUT"].includes(request.method)) {
    //             data = await request.json();
    //         }

    //         // 6. Forward request to JSON Server
    //         const response = await serverApi.request({
    //             url: `/${path}${query}`,
    //             method: request.method,
    //             data,
    //         });

    //         return NextResponse.json(response.data, {
    //             status: response.status,
    //         });

    //     } catch (error) {
    //         console.error("API Route Error:", error);

    //         if (axios.isAxiosError(error)) {
    //             return NextResponse.json(
    //                 error.response?.data || {
    //                     message: error.message,
    //                 },
    //                 {
    //                     status: error.response?.status || 500,
    //                 }
    //             );
    //         }

    //         return NextResponse.json(
    //             { message: "Something went wrong." },
    //             { status: 500 }
    //         );
    //     }
    // }

    // export async function GET(request: NextRequest) {
    //     return handleRequest(request);
    // }

    // export async function POST(request: NextRequest) {
    //     return handleRequest(request);
    // }

    // export async function PATCH(request: NextRequest) {
    //     return handleRequest(request);
    // }

    // export async function PUT(request: NextRequest) {
    //     return handleRequest(request);
    // }

    // export async function DELETE(request: NextRequest) {
    //     return handleRequest(request);
    // }