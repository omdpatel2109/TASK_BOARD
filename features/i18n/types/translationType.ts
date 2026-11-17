export type SupportedLocale = "en" | "hi" | "gu";
export type DynamicLocale = Exclude<SupportedLocale, "en">;

export type TranslationEntity =
    | "task"
    | "comment"
    | "workflow"
    | "workflowStatus";

export interface Translation {
    id: string;
    entityType: TranslationEntity;
    entityId: string;
    field: string;
    locale: DynamicLocale;
    sourceText: string;
    translatedText: string;
    updatedAt: string;
}

export interface CreateTranslation {
    id: string;
    entityType: TranslationEntity;
    entityId: string;
    field: string;
    locale: DynamicLocale;
    sourceText: string;
    translatedText: string;
}
