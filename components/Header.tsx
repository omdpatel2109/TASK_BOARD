"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getCurrentUser } from "@/features/auth/action";
import type { SafeUser } from "@/features/auth/type/userType";
import useAuth from "@/features/auth/hooks/useAuth";
import { LogOut, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useSettingHook, type Theme } from "@/features/settings/hooks/useSettingHook";

export default function Header() {
    const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [themeDropDown, setThemeDropDown] = useState(false);
    const { logout } = useAuth();
    const { theme, setTheme } = useSettingHook();


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

    // Helper to get active theme icon
    const getThemeIcon = (currentTheme: Theme) => {
        switch(currentTheme){
            case "light": return <Sun className="h-5 w-5 text-amber-500" />;
            case "dark": return <Moon className="h-5 w-5 text-indigo-400" />;
            case "system": return <Monitor className="h-5 w-5 text-slate-500" />;
        }
    };

    return (
        <header className="flex min-h-16 w-full items-center justify-end gap-3 border-b border-gray-200 bg-white px-3 py-3 sm:px-6 dark:border-gray-700 dark:bg-slate-950">
            {/* <h1 className="text-lg font-bold text-blue-700 sm:text-2xl dark:text-blue-400">
                Task Board
            </h1> */}

            <div className="relative flex items-center gap-2">
                
                {/* Theme Selector Trigger Container */}
                <div className="relative">
                    <button type="button"onClick={() => {
                            setThemeDropDown((prev) => !prev);
                            setIsDropdownOpen(false); // Close other dropdown
                        }}
                        className="flex items-center gap-1 rounded-md p-1.5 transition hover:bg-gray-100 dark:hover:bg-slate-800"
                    >    
                        {getThemeIcon(theme)}
                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${themeDropDown ? "rotate-180" : ""}`} />
                    </button>

                    {/* Theme Dropdown Overlay */}
                    {themeDropDown && (
                        <div className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-slate-900">
                            <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                                <span className="text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
                                    Theme
                                </span>
                            </div>

                            <div className="py-1">
                                {([
                                    { mode: "light", icon: <Sun className="h-4 w-4" />, label: "Light" },
                                    { mode: "dark", icon: <Moon className="h-4 w-4" />, label: "Dark" },
                                    { mode: "system", icon: <Monitor className="h-4 w-4" />, label: "System" }
                                ] as const).map(({ mode, icon, label }) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => {
                                            setTheme(mode);
                                            setThemeDropDown(false);
                                        }}
                                        className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors
                                            ${theme === mode 
                                                ? "bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-400" 
                                                : "text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                                            }`}
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Trigger Container */}
                <div className="flex items-center justify-between gap-1 border-l border-gray-200 pl-2 cursor-pointer " 
                    onClick={() => {
                            setIsDropdownOpen((prev) => !prev);
                            setThemeDropDown(false); // Close other dropdown
                        }}
                >
                    <button 
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-100 transition hover:ring-2 hover:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 cursor-pointer"
                    >
                        {currentUser?.image ? (
                            <Image 
                                src={currentUser.image} 
                                alt={userName || "User profile photo"}
                                width={36} 
                                height={36}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                                {userName?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                    </button>

                    {/* User Profile Dropdown Overlay */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-slate-900">
                            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                    {userName || "User"}
                                </p>
                            </div>

                            <div className="py-1.5">
                                <button type="button" onClick={logout}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                    <span className="hidden text-sm font-medium text-blue-700 sm:inline dark:text-blue-400 cursor-pointer" >
                        {userName || "Welcome back"}
                    </span>
                </div>

            </div>
        </header>
    );
}