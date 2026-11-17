"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { translateDynamicText } from "@/features/i18n/services/translationService";
import type { DynamicLocale, TranslationEntity } from "@/features/i18n/types/translationType";

interface TranslatedTextProps {
    text: string;
    entityType: TranslationEntity;
    entityId: string;
    field: string;
}

export default function TranslatedText({ text, entityType, entityId, field }: TranslatedTextProps) {
    const locale = useLocale();
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        let active = true;
        setDisplayText(text);

        if (locale === "en" || (locale !== "hi" && locale !== "gu") || !text.trim()) {
            return () => { active = false; };
        }

        void translateDynamicText({
            text, entityType, entityId, field, locale: locale as DynamicLocale,
        }).then((translated) => {
            if (active) setDisplayText(translated);
        }).catch((error: unknown) => {
            // Keep the original English text visible if translation is unavailable.
            console.error("Dynamic translation failed:", error);
            if (active) setDisplayText(text);
        });

        return () => { active = false; };
    }, [text, entityType, entityId, field, locale]);

    return <>{displayText}</>;
}
