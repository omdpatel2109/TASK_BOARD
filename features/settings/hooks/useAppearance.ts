"use client";
import { useEffect, useState } from "react";
export type Theme = "light" | "dark" | "system";

export function useAppearance() {
    const [theme, setTheme] = useState<Theme>("system");
    // Load the saved theme when the component mounts
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if(savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"){
            setTheme(savedTheme);
        }
    }, []);

    // Apply the selected theme
    useEffect(() => {
        const root = document.documentElement;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const applyTheme = () => {
            const isDark = theme === "dark" || (theme === "system" && media.matches);
            root.classList.toggle("dark", isDark);
        };
        applyTheme();

        // Save explicit preferences; system mode uses the OS preference
        if(theme === "system"){
            localStorage.removeItem("theme");
        }else{
            localStorage.setItem("theme", theme);
        }

        // Listen for OS theme changes only in system mode
        if(theme === "system"){
            media.addEventListener("change", applyTheme);
            return () => {
                media.removeEventListener("change", applyTheme);
            };
        }
    }, [theme]);
    return { theme, setTheme };
}