"use server";
import { cookies } from "next/headers";
import axios from "axios";
import { loginUser, getAuthenticatedUser } from "@/api/auth";
import type { SafeUser } from "./type/userType";

const COOKIE_NAME = "access_token";
export async function loginAction(username: string,password: string) {
  try{
    const result = await loginUser({ username, password });
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return{
      success: true,
      message: "Login successful.",
    };
  }catch(error){
    const message = axios.isAxiosError(error) || "Something went wrong. Please try again.";

    return{
      success: false,
      message,
    };
  }
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  try{
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    return await getAuthenticatedUser(token);
  }catch{
    return null;
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}