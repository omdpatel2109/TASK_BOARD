"use client";

import { useRouter } from "next/navigation";
import { loginAction, logoutAction } from "../action";

export default function useAuth() {
    const router = useRouter();

    const login = async (email: string, password: string) => {
        const result = await loginAction(email, password);

        if(result.success){
            router.push("/board");
            return true;
        }
        return false;
    };

    const logout = async () => {
        await logoutAction();
        router.push("/login");
    };

    return { login, logout };
}