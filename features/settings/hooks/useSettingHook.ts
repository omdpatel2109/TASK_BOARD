"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function useSettingHook() {
    const [theme, setTheme] = useState<Theme>("light");

    // Load saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        }
    }, []);

    // Apply and save selected theme
    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return { theme, setTheme };
}
