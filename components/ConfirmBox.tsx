"use client";
import { useTranslations } from "next-intl";
interface ConfirmBoxProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmBox({message, onConfirm, onCancel}: ConfirmBoxProps) {
    const t = useTranslations("confirm");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-primary-text">
                    {t("title")}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-secondary-text hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                        {t("cancel")}
                    </button>

                    <button type="button" onClick={onConfirm}
                        className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                        {t("delete")}
                    </button>
                </div>
            </div>
        </div>
    );
}