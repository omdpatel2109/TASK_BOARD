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
        document.cookie = `locale=${newLocale}; path=/; samesite=lax`;
        router.refresh();
    }
    return (
        <select value={locale} onChange={(event) => handleLanguageChange(event.target.value)}
            className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-primary-text outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-primary-dark-text dark:focus:ring-blue-900">
            {languages.map((language) => (
                <option key={language.code} value={language.code}>
                    {language.label}
                </option>
            ))}
        </select>
    );
}