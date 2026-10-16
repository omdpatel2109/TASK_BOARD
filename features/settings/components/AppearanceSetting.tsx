
"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useAppearance, type Theme } from "../hooks/useAppearance";

const themes = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "system", label: "System", Icon: Monitor },
] as const;

export default function AppearanceSettings() {
    const { theme, setTheme, mounted } = useAppearance();

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-blue-400">
                    Appearance
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Customize your dashboard.
                </p>
            </div>

            <h3 className="mb-3 text-sm font-medium text-slate-900 dark:text-white">
                Theme
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {themes.map(({ value, label, Icon }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value as Theme)}
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                            theme === value
                                ? "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        }`}
                    >
                        <span className="flex items-center gap-3">
                            <Icon size={20} />
                            <span className="font-medium">{label}</span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}