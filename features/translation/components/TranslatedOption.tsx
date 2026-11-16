"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface TranslatedOptionProps {
    value: string;
    text: string;
    sourceLanguage?: string;
}

export default function TranslatedOption({ value, text, sourceLanguage = "en" }: TranslatedOptionProps) {
    const targetLanguage = useLocale();
    const [label, setLabel] = useState(text);

    useEffect(() => {
        let cancelled = false;
        setLabel(text);
        if (!text.trim() || sourceLanguage === targetLanguage) return;

        async function translate() {
            try {
                const response = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text, sourceLanguage, targetLanguage }),
                });
                if (!response.ok) return;
                const result = await response.json() as { translatedText?: string };
                if (!cancelled && result.translatedText) setLabel(result.translatedText);
            } catch {
                // Keep the original option label when the free service is unavailable.
            }
        }
        void translate();
        return () => { cancelled = true; };
    }, [text, sourceLanguage, targetLanguage]);

    return <option value={value}>{label}</option>;
}
