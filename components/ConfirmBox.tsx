"use client";
interface ConfirmBoxProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmBox({message,onConfirm,onCancel,}: ConfirmBoxProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-primary-text">
                    Confirm deletion
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    {message}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-secondary-text hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button type="button" onClick={onConfirm}
                        className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:bg-error"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}