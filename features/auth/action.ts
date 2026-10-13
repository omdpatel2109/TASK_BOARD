"use server";

import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
    // Demo credentials
    if(email !== "ompatel1234@gmail.com" || password !== "123456"){
        return{ 
            success: false, 
            message: "Invalid email or password." 
        };
    }

    const cookieStore = await cookies();

    cookieStore.set("access_token", "demo-token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
}