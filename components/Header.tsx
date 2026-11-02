
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
    LogOut,
    Sun,
    Moon,
    SlidersHorizontal,
    X,
    Check,
    SunMoon,
} from "lucide-react";

import { getCurrentUser } from "@/features/auth/action";
import type { SafeUser } from "@/features/auth/type/userType";
import useAuth from "@/features/auth/hooks/useAuth";
import { useSettingHook } from "@/features/settings/hooks/useSettingHook";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import DueDateNotifications from "@/features/tasks/components/DueDateNotifications";

export default function Header() {
    const t = useTranslations("header");

    const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

    const { logout } = useAuth();
    const { theme, setTheme } = useSettingHook();

    const userName = currentUser?.name || currentUser?.username;
    const isDark = theme === "dark";

    // Load current user
    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Failed to load user:", error);
            }
        }

        loadUser();
    }, []);

    // Close drawer using Escape and prevent background scrolling
    useEffect(() => {
        if (!isPreferencesOpen) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsPreferencesOpen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isPreferencesOpen]);

    return (
        <>
            <header className="flex min-h-16 w-full items-center justify-end gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-6 dark:border-slate-700 dark:bg-background">

                {/* Notifications */}
                <DueDateNotifications />

                {/* User Profile */}
                <div className="relative flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700">

                    <button
                        type="button"
                        aria-label={userName || t("user")}
                        aria-expanded={isDropdownOpen}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="flex cursor-pointer items-center gap-2 rounded-md p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                            {currentUser?.image ? (
                                <Image
                                    src={currentUser.image}
                                    alt={userName || t("profilePhoto")}
                                    width={36}
                                    height={36}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="font-semibold text-primary dark:text-blue-300">
                                    {userName?.charAt(0).toUpperCase() || "U"}
                                </span>
                            )}
                        </span>

                        <span className="hidden text-sm font-medium text-primary-text sm:inline dark:text-blue-400">
                            {userName || t("welcomeBack")}
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">

                            {/* User Name */}
                            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                                <p className="text-sm font-semibold text-primary-text dark:text-primary-dark-text">
                                    {userName || t("user")}
                                </p>
                            </div>

                            {/* Preferences */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    setIsPreferencesOpen(true);
                                }}
                                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-medium text-secondary-text transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <span className="flex items-center gap-3">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    {t("preferences")}
                                </span>
                            </button>

                            {/* Logout */}
                            <div className="border-t border-slate-200 py-1 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-error transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    <LogOut className="h-4 w-4" />
                                    {t("logout")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Preferences Drawer */}
            {isPreferencesOpen && (
                <div className="fixed inset-0 z-[100]">

                    {/* Background Overlay */}
                    <button
                        type="button"
                        aria-label="Close preferences"
                        onClick={() => setIsPreferencesOpen(false)}
                        className="absolute inset-0 h-full w-full cursor-default bg-black/40 backdrop-blur-[1px]"
                    />

                    {/* Right Side Drawer */}
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="preferences-title"
                        className="absolute right-0 top-0 flex h-full w-[320px] max-w-[85vw] flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300 dark:border-slate-700 dark:bg-slate-900"
                    >

                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-slate-700">
                            <div>
                                <h2
                                    id="preferences-title"
                                    className="text-lg font-semibold text-primary-text dark:text-primary-dark-text"
                                >
                                    {t("preferences")}
                                </h2>

                                <p className="mt-1 text-xs text-secondary-text dark:text-secondary-dark-text">
                                    {t("preferencesDescription")}
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close preferences"
                                onClick={() => setIsPreferencesOpen(false)}
                                className="cursor-pointer rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 space-y-7 overflow-y-auto p-5">

                            {/* Language Section */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="h-4 w-4 text-primary dark:text-blue-400" />

                                    <h3 className="text-sm font-semibold text-primary-text dark:text-primary-dark-text">
                                        {t("language")}
                                    </h3>
                                </div>

                                <LanguageSwitcher />
                            </section>

                            {/* Theme Section */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <SunMoon className="h-4 w-4 text-primary dark:text-blue-400" />

                                    <h3 className="text-sm font-semibold text-primary-text dark:text-primary-dark-text">
                                        {t("theme")}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">

                                    {/* Current Theme */}
                                    <div className="flex items-center gap-3">
                                        {isDark ? (
                                            <Moon className="h-5 w-5 text-indigo-400" />
                                        ) : (
                                            <Sun className="h-5 w-5 text-amber-500" />
                                        )}

                                        <div>
                                            <p className="text-sm font-medium text-primary-text dark:text-primary-dark-text">
                                                {isDark ? t("dark") : t("light")}
                                            </p>

                                            <p className="text-xs text-secondary-text dark:text-secondary-dark-text">
                                                {t("themeDescription")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Light / Dark Toggle */}
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={isDark}
                                        aria-label={t("theme")}
                                        onClick={() => setTheme(isDark ? "light" : "dark")}
                                        className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ${
                                            isDark
                                                ? "bg-blue-600"
                                                : "bg-slate-300"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform duration-200 ${
                                                isDark ? "translate-x-5" : "translate-x-0"
                                            }`}
                                        >
                                            <Check className="h-3 w-3 text-blue-600" />
                                        </span>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
