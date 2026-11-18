import { api } from "@/lib/api";
import type {Translation, CreateTranslation, TranslationEntity, DynamicLocale} from "@/features/i18n/types/translationType";

export interface TranslationQuery {
    entityType: TranslationEntity;
    entityId: string;
    field: string;
    locale: DynamicLocale;
}

export async function getTranslation(query: TranslationQuery) : Promise<Translation | null> {
    const response = await api.get<Translation[]>("/translations", {
        params: query,
    });
    return response.data[0] ?? null;
}

export async function createTranslation(translation: CreateTranslation): Promise<Translation> {
    const response = await api.post<Translation>("/translations", {
        ...translation,
        updatedAt: new Date().toISOString(),
    });
    return response.data;
}

export async function updateTranslation(id: string, translatedText: string, sourceText: string): Promise<Translation> {
    const response = await api.patch<Translation>(`/translations/${encodeURIComponent(id)}`,
        { translatedText, sourceText, updatedAt: new Date().toISOString() }
    );
    return response.data;
}