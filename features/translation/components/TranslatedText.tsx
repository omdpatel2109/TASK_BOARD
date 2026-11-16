"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface TranslatedTextProps {
    text: string | null | undefined;
    sourceLanguage?: string;
    className?: string;
    as?: "span" | "div";
}

// Reuses a small in-memory cache during the current browser session.
const sessionCache = new Map<string, string>();

export default function TranslatedText({ text, sourceLanguage = "en", className, as = "span" }: TranslatedTextProps) {
    const targetLanguage = useLocale();
    const originalText = text ?? "";
    const [displayText, setDisplayText] = useState(originalText);

    useEffect(() => {
        let cancelled = false;
        setDisplayText(originalText);

        if (!originalText.trim() || sourceLanguage === targetLanguage) return;
        const cacheKey = `${sourceLanguage}:${targetLanguage}:${originalText}`;
        const cached = sessionCache.get(cacheKey);
        if (cached) {
            setDisplayText(cached);
            return;
        }

        async function loadTranslation() {
            try {
                const response = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: originalText, sourceLanguage, targetLanguage }),
                });
                if (!response.ok) throw new Error("Translation request failed");
                const result = await response.json() as { translatedText?: string };
                if (result.translatedText && !cancelled) {
                    sessionCache.set(cacheKey, result.translatedText);
                    setDisplayText(result.translatedText);
                }
            } catch {
                // Keep the original user content visible when translation is unavailable.
            }
        }
        void loadTranslation();
        return () => { cancelled = true; };
    }, [originalText, sourceLanguage, targetLanguage]);

    if (as === "div") return <div className={className}>{displayText}</div>;
    return <span className={className}>{displayText}</span>;
}
