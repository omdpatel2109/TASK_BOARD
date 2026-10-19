"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/features/auth/action";
import type { SafeUser } from "@/features/auth/type/userType";

export default function Header() {
    const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Failed to load user:", error);
            }
        }
        void loadUser();
    }, []);

    const userName = currentUser?.name || currentUser?.username;

    return (
        <header className="flex min-h-16 w-full items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-3 sm:px-6 dark:border-gray-700 dark:bg-slate-950">
            <h1 className="text-lg font-bold text-blue-700 sm:text-2xl dark:text-blue-400">
                Task Board
            </h1>

            <span className="min-w-0 text-sm font-medium text-blue-700 sm:text-base dark:text-blue-400">
                {userName ? `Welcome back, ${userName}` : "Welcome back"}
            </span>
        </header>
    );
}
