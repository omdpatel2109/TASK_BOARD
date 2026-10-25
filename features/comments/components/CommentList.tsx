"use client";
import { useState } from "react";
import type { Comment } from "@/features/comments/type/commentType";
import SuccessBox from "@/components/SuccessBox";
import ConfirmBox from "@/components/ConfirmBox";

interface CommentListProps {
    comments: Comment[];
    currentUserId: number;
    isLoading: boolean;
    loadError: string | null;
    error: string | null;
    onRetry: () => void;
    editComment: (id: string, text: string) => Promise<void>;
    removeComment: (id: string) => Promise<void>;
}

export default function CommentList({comments, isLoading, error, editComment, removeComment, loadError, onRetry,
currentUserId}: CommentListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

    async function handleEdit(id: string) {
        if(!editText.trim()) return;

        try{
            await editComment(id, editText.trim());
            setEditingId(null);
            setEditText("");
            setSuccessMessage("Comment Edited Successfully..");
        }catch(error){
            console.error("Failed to edit comment:", error);
        }
    }
    async function handleDelete() {
        if (!deleteCommentId) return;
        try{
            await removeComment(deleteCommentId);
            setSuccessMessage("Comment deleted successfully!");
            setDeleteCommentId(null);
        }catch(error){
            console.error("Failed to delete comment:", error);
        }
    }

    if(isLoading){
        return <p className="py-4 text-sm text-slate-500">Loading comments...</p>;
    }

    if(error){
        return <p className="py-4 text-sm text-error">{error}</p>;
    }

    return(
        <>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <h2 className="py-3 text-lg font-semibold text-primary-text dark:text-slate-100">
                    Comments ({comments.length})
                </h2>

                <SuccessBox message={successMessage} onClose={() => setSuccessMessage("")}/>

                {loadError && (
                <div className="my-3 rounded-md border border-red-200 p-4">
                    <p className="text-sm text-error">{loadError}</p>
                    <button type="button" onClick={onRetry}
                    className="mt-3 rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-hover-primary"
                    >
                        Try Again
                    </button>
                </div>
                )}

                {error && (
                    <p className="py-3 text-sm text-error">
                        {error}
                    </p>
                )}

                {comments.length === 0 ? (
                    <p className="py-4 text-sm text-secondary-text dark:slate-400">
                        No comments yet.
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="py-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-primary-text dark:text-slate-200">
                                        {comment.authorName || "Unknown user"}
                                    </p>

                                    <time dateTime={comment.createdAt}
                                        className="text-sm text-secondary-text dark:text-slate-400">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </time>
                                </div>

                                {comment.authorId === currentUserId && (
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => {
                                        setEditingId(comment.id);
                                        setEditText(comment.text);
                                    }}
                                    className="text-md font-medium text-hover-primary hover:text-hover-primary">
                                        Edit
                                    </button>
                                    <button
                                    type="button" onClick={() => setDeleteCommentId(comment.id)}
                                    className="text-md font-medium text-error hover:text-hover-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                                )}
                            </div>

                            {editingId === comment.id ? (
                                <div className="mt-3 space-y-2">
                                    <textarea value={editText}
                                        onChange={(event) => setEditText(event.target.value)} rows={3}
                                        className="w-full resize-none rounded-md border border-slate-300 p-3 text-sm dark:bg-slate-800 dark:text-slate-200"
                                    />
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => void handleEdit(comment.id)}
                                        disabled={!editText.trim()}
                                        className="rounded-md bg-primary px-3 py-1.5 text-sm text-white disabled:opacity-50">
                                            Save
                                        </button>

                                        <button type="button" onClick={() => {
                                            setEditingId(null);
                                            setEditText("");
                                        }}
                                        className="rounded-md border px-3 py-1.5 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-2 text-secondary-text dark:text-slate-300">
                                    {comment.text}
                                </p>
                            )}

                            {deleteCommentId === comment.id && (
                                <ConfirmBox message="Are you sure you want to delete this comment?"
                                onConfirm={handleDelete} onCancel={() => setDeleteCommentId(null)}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}