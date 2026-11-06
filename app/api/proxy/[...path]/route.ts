import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { serverApi } from "@/lib/serverApi";

type RouteContext = {
    params: Promise<{path: string[]}>;
};

async function handleRequest(request: NextRequest, context: RouteContext){
    try {
        const { path } = await context.params;

        // Allow only the resources used by this application.
        const allowedResources = ["tasks", "columns", "comments"];

        if(!allowedResources.includes(path[0])){
            return NextResponse.json(
                { message: "Invalid API resource." },
                { status: 404 }
            );
        }

        const endpoint = `/${path.join("/")}${request.nextUrl.search}`;

        const body =
            request.method === "GET" || request.method === "HEAD"
                ? undefined : await request.text();

        const response = await serverApi.request({
            url: endpoint,
            method: request.method,
            data: body,
            headers: {
                "Content-Type":
                    request.headers.get("content-type") ||
                    "application/json",
            },
        });

        return NextResponse.json(response.data, {
            status: response.status,
        });

    }catch(error){
        if(axios.isAxiosError(error)){
            return NextResponse.json(
                error.response?.data || {
                    message: "Unable to connect to the backend.",
                },
                {
                    status: error.response?.status || 502,
                }
            );
        }

        console.error("Backend proxy error:", error);
        return NextResponse.json(
            { message: "Something went wrong." },
            { status: 500 }
        );
    }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const HEAD = handleRequest;