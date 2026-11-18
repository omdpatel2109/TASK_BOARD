// import { createTranslation, getTranslation, updateTranslation } from "@/api/translation";
// import type { DynamicLocale, TranslationEntity } from "@/features/i18n/types/translationType";

// interface TranslateParams {
//     text: string;
//     entityType: TranslationEntity;
//     entityId: string;
//     field: string;
//     locale: DynamicLocale;
// }

// interface MyMemoryResponse {
//     responseStatus: number;
//     responseData?: { translatedText?: string };
//     quotaFinished?: boolean;
// }

// // Avoid duplicate requests when the same text appears in multiple components.
// const pendingTranslations = new Map<string, Promise<string>>();

// function makeTranslationId(
//     entityType: TranslationEntity, entityId: string, field: string, locale: DynamicLocale
// ): string {
//     // Colons inside values are encoded, so this delimiter remains unambiguous.
//     return [entityType, entityId, field, locale].map(encodeURIComponent).join("::");
// }

// async function translateWithMyMemory(text: string, locale: DynamicLocale): Promise<string> {
//     // MyMemory documents a 500-byte limit for the q parameter.
//     if (new TextEncoder().encode(text).length > 500) {
//         throw new Error("This text is longer than the translation provider's 500-byte limit.");
//     }

//     const url = new URL("https://api.mymemory.translated.net/get");
//     url.searchParams.set("q", text);
//     url.searchParams.set("langpair", `en|${locale}`);

//     const response = await fetch(url.toString());
//     if (!response.ok) throw new Error("Translation provider request failed.");

//     const data = (await response.json()) as MyMemoryResponse;
//     const translatedText = data.responseData?.translatedText?.trim();
//     if (data.responseStatus !== 200 || data.quotaFinished || !translatedText) {
//         throw new Error("The translation provider could not translate this text.");
//     }
//     return translatedText;
// }

// export async function translateDynamicText({
//     text, entityType, entityId, field, locale,
// }: TranslateParams): Promise<string> {
//     if (!text.trim()) return text;

//     const pendingKey = JSON.stringify([entityType, entityId, field, locale, text]);
//     const pending = pendingTranslations.get(pendingKey);
//     if (pending) return pending;

//     const request = (async () => {
//         const existing = await getTranslation({ entityType, entityId, field, locale });
//         // Reuse a saved translation only when it still matches the English source.
//         if (existing?.sourceText === text) return existing.translatedText;

//         const translatedText = await translateWithMyMemory(text, locale);
//         if (existing) {
//             await updateTranslation(existing.id, translatedText, text);
//         } else {
//             await createTranslation({
//                 id: makeTranslationId(entityType, entityId, field, locale),
//                 entityType, entityId, field, locale,
//                 sourceText: text, translatedText,
//             });
//         }
//         return translatedText;
//     })();

//     pendingTranslations.set(pendingKey, request);
//     try {
//         return await request;
//     } finally {
//         pendingTranslations.delete(pendingKey);
//     }
// }

import {createTranslation, getTranslation, updateTranslation} from "@/api/translation";
import type {DynamicLocale, TranslationEntity} from "@/features/i18n/types/translationType";
interface TranslateParams {
    text: string;
    entityType: TranslationEntity;
    entityId: string;
    field: string; //name, title, description, etc..
    locale: DynamicLocale;
}

interface MyMemoryResponse {
    responseStatus: number; // 200(OK)
    responseData?: {translatedText?: string};
    quotaFinished?: boolean;
}

//This function generates a unique ID for a translation record
function makeTranslationId(entityType: TranslationEntity, entityId: string, field: string,locale: DynamicLocale): string {
    return [entityType, entityId, field, locale]
        .map(encodeURIComponent)//encodeURIComponent encodes special characters so they can safely be included in the generated ID
        .join("::");
}
//This function communicates with the external MyMemory API and returns the translated text
async function translateWithMyMemory(text: string, locale: DynamicLocale): Promise<string> {
    if(new TextEncoder().encode(text).length > 500){
        throw new Error("Text exceeds the 500-byte translation limit.");
    }

    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text); //store main english sentence
    url.searchParams.set("langpair", `en|${locale}`); //the source and target languages

    const response = await fetch(url.toString());
    if(!response.ok){
        throw new Error("Translation provider request failed.");
    }
    const data = (await response.json()) as MyMemoryResponse;
    const translatedText = data.responseData?.translatedText?.trim();

    if(data.responseStatus !== 200 || data.quotaFinished || !translatedText){
        throw new Error("Unable to translate this text.");
    }
    return translatedText;
}

export async function translateDynamicText({text, entityType, entityId, field, locale}: TranslateParams): Promise<string> {

    if (!text.trim()) return text;
    // Check existing translation
    const existing = await getTranslation({entityType, entityId, field, locale});

    // Reuse translation if original text hasn't changed
    if(existing?.sourceText === text){
        return existing.translatedText;
    }

    // Translate original English text
    const translatedText = await translateWithMyMemory(text, locale);

    // Save or update translation
    if(existing){
        await updateTranslation(existing.id, translatedText, text);
    }else{
        await createTranslation({id: makeTranslationId( entityType, entityId, field, locale),
            entityType, entityId, field, locale, sourceText: text, translatedText});
    }

    // Return translated text
    return translatedText;
}