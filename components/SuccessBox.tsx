"use client";
import { X, Check } from "lucide-react";
import { useEffect } from "react";
interface SuccessBoxProps {
    message: string;
    onClose?: () => void;
}

export default function SuccessBox({ message, onClose }: SuccessBoxProps) {
    useEffect(() => {
        if (!message || !onClose) return;

        const timer = setTimeout(() => {
            onClose();
        }, 1500);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center justify-between gap-3 rounded-lg border border-status-done  bg-status-done/25 px-4 py-3 text-md text-status-done">
            <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-status-done/15 font-bold text-status-done">
                    <Check className="h-4 w-4" />
                </span>
                <span>{message}</span>
            </div>

            {onClose && (
                <button type="button" onClick={onClose}
                    className="rounded px-2 py-1 font-semibold text-status-done hover:bg-status-done/15"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
