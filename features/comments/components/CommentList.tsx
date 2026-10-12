"use client";

import { useState } from "react";
import { useComments } from "@/features/comments/hooks/useComments";

interface CommentListProps {
    taskId: string;
}

export default function CommentList({ taskId }: CommentListProps) {
    const { comments, isLoading, error, editComment, removeComment } =
        useComments(taskId);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    async function handleEdit(id: string) {
        if (!editText.trim()) return;

        try {
            await editComment(id, editText.trim());
            setEditingId(null);
            setEditText("");
        } catch (error) {
            console.error("Failed to edit comment:", error);
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            await removeComment(id);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    }

    if (isLoading) {
        return (
            <p className="py-4 text-sm text-slate-500">
                Loading comments...
            </p>
        );
    }

    if (error) {
        return (
            <p className="py-4 text-sm text-red-600">
                {error}
            </p>
        );
    }

    if (comments.length === 0) {
        return (
            <p className="py-4 text-sm text-slate-500">
                No comments yet.
            </p>
        );
    }

    return (
        <div className="divide-y divide-slate-200">
            <h2 className="py-3 text-lg font-semibold text-slate-900">
                Comments 
            </h2>

            {comments.map((comment) => (
                <div key={comment.id} className="py-4">
                    <div className="flex items-center justify-between gap-3">
                        <time className="text-sm text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </time>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(comment.id);
                                    setEditText(comment.text);
                                }}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(comment.id)}
                                className="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {editingId === comment.id ? (
                        <div className="mt-3 space-y-2">
                            <textarea
                                value={editText}
                                onChange={(event) =>
                                    setEditText(event.target.value)
                                }
                                rows={3}
                                className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(comment.id)}
                                    disabled={!editText.trim()}
                                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditText("");
                                    }}
                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-2 whitespace-pre-wrap text-base leading-6 text-slate-600">
                            {comment.text}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
