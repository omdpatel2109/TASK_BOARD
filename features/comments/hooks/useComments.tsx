"use client";

import { useCallback, useEffect, useState } from "react";

import {
    getCommentsByTask,
    createComment,
    updateComment,
    deleteComment
} from "@/api/comments";

import type {
    Comment,
    CreateComment
} from "@/features/comments/type/commentType";

export function useComments(taskId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadComments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getCommentsByTask(taskId);
            setComments(data);
        } catch (error) {
            setError("Failed to load comments.");
        } finally {
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    async function addComment(comment: CreateComment) {
        try {
            const newComment = await createComment(comment);

            setComments((current) => [...current, newComment]);
            setError(null);
        } catch (error) {
            console.error("Failed to add comment:", error);
            setError("Failed to add comment.");
            throw error;
        }
    }

    async function editComment(id: string, text: string) {
        try {
            const updatedComment = await updateComment(id, {
                text,
                updatedAt: new Date().toISOString()
            });

            setComments((current) =>
                current.map((comment) =>
                    comment.id === id ? updatedComment : comment
                )
            );

            setError(null);
        } catch (error) {
            console.error("Failed to edit comment:", error);
            setError("Failed to edit comment.");
            throw error;
        }
    }

    async function removeComment(id: string) {
        try {
            await deleteComment(id);

            setComments((current) =>
                current.filter((comment) => comment.id !== id)
            );

            setError(null);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            setError("Failed to delete comment.");
            throw error;
        }
    }

    return {
        comments,
        isLoading,
        error,
        addComment,
        editComment,
        removeComment,
        loadComments
    };
}
