"use client";
import { X } from "lucide-react";
import { Check } from "lucide-react";
import { useEffect } from "react";
interface SuccessBoxProps {
    message: string;
    onClose?: () => void;
}

export default function SuccessBox({message, onClose}: SuccessBoxProps) {
    useEffect(() => {
        if (!message || !onClose) return;
        const timer = setTimeout(() => {
            onClose();
        }, 1500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return(
        <div
            className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-100 px-4 py-3 text-md text-green-800 shadow-sm"
        >
            <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    <Check className="h-4 w-4"/>
                </span>
                <span>{message}</span>
            </div>

            {onClose && (
                <button type="button" onClick={onClose}
                    className="rounded px-2 py-1 font-semibold text-green-700 hover:bg-green-100"
                >
                    <X className="h-4 w-4"/>
                </button>
            )}
        </div>
    );
}
