"use client";

import { AlertCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface AlertProps {
    message: string;
    onClose: () => void;
}

export default function AlertBox({ message, onClose }: AlertProps) {
    const t = useTranslations("alert");

    if (!message) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t("close")}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-error" />
                    </div>

                    <h2 className="mb-2 text-lg font-semibold text-primary-text">
                        {t("loginFailed")}
                    </h2>

                    <p className="mb-6 text-sm leading-6 text-secondary-text">
                        {message}
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-hover-primary"
                    >
                        {t("tryAgain")}
                    </button>
                </div>
            </div>
        </div>
    );
}