'use client'

import {useRouter} from "next/navigation";
import type UserType from "../type/UserType";

export default function useAuth() {
    const router = useRouter();

    //demo user data
    const demoUser: UserType = {
        id: "1",
        name: "Om Patel",
        email: "ompatel1234@gmail.com",
        password: "123456"
    };

    const login = (email: string, password: string) => {
        if (email === demoUser.email && password === demoUser.password) {
            router.push("/board"); // Redirect to dashboard after successful login
            return true;
        } else {
            return false;
        }
    }

    const logout = () => {
        router.push("/login"); // Redirect to login page after logout
    }

    return { login, logout };
}