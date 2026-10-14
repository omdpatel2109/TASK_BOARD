"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateComment } from "@/features/comments/type/commentType";
import SuccessBox from "@/components/SuccessBox";

interface CommentBoxProps {
    taskId: string;
    addComment: (comment: CreateComment) => Promise<void>;
    error: string | null;
}

export default function CommentBox({taskId, addComment, error}: CommentBoxProps) {
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    async function handleAddComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText || isSubmitting) return;

        try{
            setIsSubmitting(true);
            const commentDate = new Date().toISOString();

            await addComment({
                taskId,
                text: trimmedText,
                createdAt: commentDate,
                updatedAt: commentDate,
            });
            setSuccessMessage("Comment Added Successfully..")
            setText("");
        }catch(error){
            console.error("Failed to add comment:", error);
        }finally{
            setIsSubmitting(false);
        }
    }

    return(
        <>
            <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:bg-slate-900 dark:border-slate-700">
                <h2 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Add comment
                </h2>

                <form onSubmit={handleAddComment} className="relative flex w-full items-center">
                    <input type="text" value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Add comments here..."
                        className="w-full border-b border-slate-200 py-3 pr-16 text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-none dark:border-slate-700 dark:text-slate-400"
                    />

                    {text.trim().length > 0 && (
                        <button type="submit" disabled={isSubmitting}
                            className="absolute right-0 rounded bg-slate-800 px-3 py-1 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-500"
                        >
                            {isSubmitting ? "Adding..." : "Add"}
                        </button>
                    )}
                </form>

                {error && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                )}
            </div>
            <SuccessBox message={successMessage}
                    onClose={() => setSuccessMessage("")}
            />
        </>
    );
}