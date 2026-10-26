"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getCurrentUser } from "@/features/auth/action";
import type { SafeUser } from "@/features/auth/type/userType";
import useAuth from "@/features/auth/hooks/useAuth";
import { LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useSettingHook, type Theme} from "@/features/settings/hooks/useSettingHook";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import DueDateNotifications from "@/features/tasks/components/DueDateNotifications";

export default function Header() {
    const t = useTranslations("header");
    const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [themeDropDown, setThemeDropDown] = useState(false);
    const { logout } = useAuth();
    const { theme, setTheme } = useSettingHook();

    useEffect(() => {
        async function loadUser() {
            try{
                const user = await getCurrentUser();
                setCurrentUser(user);
            }catch(error){
                console.error("Failed to load user:", error);
            }
        }
        loadUser();
    }, []);

    const userName = currentUser?.name || currentUser?.username;

    // Helper to get active theme icon
    const getThemeIcon = (currentTheme: Theme) => {
        switch(currentTheme){
            case "light":
                return <Sun className="h-5 w-5 text-amber-500" />;
            case "dark":
                return <Moon className="h-5 w-5 text-indigo-400" />;
            case "system":
                return <Monitor className="h-5 w-5 text-slate-500" />;
        }
    };

    return (
        <header className="flex min-h-16 w-full items-center justify-end gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-6 dark:border-slate-700 dark:bg-slate-950">

            <LanguageSwitcher />

            <div className="relative flex items-center gap-2">
                {/* Theme Selector */}
                <div className="relative">
                    <button type="button" onClick={() => {
                            setThemeDropDown((prev) => !prev);
                            setIsDropdownOpen(false);
                        }}
                        aria-label={t("theme")}
                        className="flex items-center gap-1 rounded-md p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        {getThemeIcon(theme)}
                    </button>

                    {/* Theme Dropdown */}
                    {themeDropDown && (
                        <div className="absolute right-0 top-10 z-50 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                            <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                                    {t("theme")}
                                </span>
                            </div>

                            <div className="py-1">
                                {([
                                    {
                                        mode: "light",
                                        icon: <Sun className="h-4 w-4" />,
                                        key: "light",
                                    },
                                    {
                                        mode: "dark",
                                        icon: <Moon className="h-4 w-4" />,
                                        key: "dark",
                                    },
                                    {
                                        mode: "system",
                                        icon: <Monitor className="h-4 w-4" />,
                                        key: "system",
                                    },
                                ] as const).map(({ mode, icon, key }) => (
                                    <button key={mode} type="button"
                                        onClick={() => {
                                            setTheme(mode);
                                            setThemeDropDown(false);
                                        }}
                                        className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors ${
                                            theme === mode
                                                ? "bg-blue-50 text-primary dark:bg-slate-800 dark:text-blue-400"
                                                : "text-secondary-text hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                                        }`}
                                    >
                                        {icon}
                                        <span>{t(key)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DueDateNotifications />

                {/* User Profile */}
                <div className="relative flex cursor-pointer items-center justify-between gap-1 border-l border-slate-200 pl-2" onClick={() => {
                        setIsDropdownOpen((prev) => !prev);
                        setThemeDropDown(false);
                    }}
                >
                    <button type="button" aria-label={userName || t("user")}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-100 transition hover:ring-2 hover:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    >
                        {currentUser?.image ? (
                            <Image src={currentUser.image} alt={userName || t("profilePhoto")}
                                width={36} height={36} className="rounded-full "
                            />
                        ) : (
                            <span className="font-semibold text-primary dark:text-blue-300">
                                {userName?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                    </button>

                    {/* User Profile Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                                <p className="text-sm font-semibold text-primary-text dark:text-white">
                                    {userName || t("user")}
                                </p>
                            </div>

                            <div className="py-1.5">
                                <button type="button" onClick={logout}
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-error hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>{t("logout")}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <span className="hidden cursor-pointer text-sm font-medium text-primary-text sm:inline dark:text-blue-400">
                        {userName || t("welcomeBack")}
                    </span>
                </div>
            </div>
        </header>
    );
}