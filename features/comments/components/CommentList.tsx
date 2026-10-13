"use client";
import { useState } from "react";
import type { Comment } from "@/features/comments/type/commentType";
import SuccessBox from "@/components/SuccessBox";
import ConfirmBox from "@/components/ConfirmBox";

interface CommentListProps{
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
    editComment: (id: string, text: string) => Promise<void>;
    removeComment: (id: string) => Promise<void>;
}

export default function CommentList({comments, isLoading,
error, editComment, removeComment}: CommentListProps) {
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
        return <p className="py-4 text-sm text-red-600">{error}</p>;
    }

    return(
        <>
        <div className="divide-y divide-slate-200">
            <h2 className="py-3 text-lg font-semibold text-slate-900">
                Comments ({comments.length})
            </h2>

            <SuccessBox
                message={successMessage}
                onClose={() => setSuccessMessage("")}
            />

            {comments.length === 0 ? (
                <p className="py-4 text-sm text-slate-500">
                    No comments yet.
                </p>
            ) : (
                comments.map((comment) => (
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
                                    onClick={() => setDeleteCommentId(comment.id)}
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
                                    onChange={(event) =>setEditText(event.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
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
                            <p className="mt-2 text-slate-600">
                                {comment.text}
                            </p>
                        )}


                        {deleteCommentId !== null && (
                            <ConfirmBox
                                message="Are you sure you want to delete this comment?"
                                onConfirm={handleDelete}
                                onCancel={() => setDeleteCommentId(null)}
                            />
                        )}

                    </div>
                ))
            )}
        </div>
        </>
    );
}