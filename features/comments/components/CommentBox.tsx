"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { useComments } from "@/features/comments/hooks/useComments";

interface CommentBoxProps {
    taskId: string;
    onCommentAdded: () => void;
}

export default function CommentBox({
    taskId,
    onCommentAdded
}: CommentBoxProps) {
    const { addComment, error } = useComments(taskId);

    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleAddComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!text.trim()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const now = new Date().toISOString();

            await addComment({
                taskId,
                text: text.trim(),
                createdAt: now,
                updatedAt: now
            });

            setText("");
            onCommentAdded();
        }  catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
                Add comment
            </h2>

            <form
                onSubmit={handleAddComment}
                className="relative flex w-full items-center"
            >
                <input
                    type="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Add comments here..."
                    className="w-full border-b border-slate-200 py-3 pr-16 text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-none"
                />

                {text.trim().length > 0 && (
                    <button
                        type="submit"
                        onClick={() => handleAddComment}
                        disabled={isSubmitting}
                        className="absolute right-0 rounded bg-slate-800 px-3 py-1 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </button>
                )}
            </form>

            {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}