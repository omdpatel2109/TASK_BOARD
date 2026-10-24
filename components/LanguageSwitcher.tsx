"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "gu", label: "ગુજરાતી" },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();

    function handleLanguageChange(newLocale: string) {
        document.cookie = `locale=${newLocale}; path=/; max-age=31536000; samesite=lax`;
        router.refresh();
    }

    return (
        <select
            value={locale}
            onChange={(event) => handleLanguageChange(event.target.value)}
            aria-label="Select language"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
            {languages.map((language) => (
                <option key={language.code} value={language.code}>
                {language.label}
                </option>
            ))}
        </select>
    );
}