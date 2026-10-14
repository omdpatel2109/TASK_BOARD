"use client";
import { useEffect, useState } from "react";
export type Theme = "light" | "dark" | "system";

export function useAppearance() {
    const [theme, setTheme] = useState<Theme>("system");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"){
        setTheme(savedTheme);
    }

    setMounted(true);
    },[]);

    useEffect(() => {
        if(!mounted) return;

        const root = document.documentElement;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const applyTheme = () => {
            const isDark =
                theme === "dark" || (theme === "system" && media.matches);

            root.classList.toggle("dark", isDark);
        };
        applyTheme();
        localStorage.setItem("theme", theme);

        if(theme !== "system") return;

        media.addEventListener("change", applyTheme);

        return () => media.removeEventListener("change", applyTheme);
    }, [theme, mounted]);

    return { theme, setTheme, mounted };
}
