"use client";

import { useEffect, useState } from "react";
import { getCommentsByTask } from "@/api/comments";
import type { Comment } from "@/features/comments/type/commentType";

export function useComments(taskId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        async function fetchComments() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getCommentsByTask(taskId);

                if (isActive) {
                    setComments(data);
                }
            } catch {
                if (isActive) {
                    setError("Failed to load comments.");
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        fetchComments();

        return () => {
            isActive = false;
        };
    }, [taskId]);

    return {
        comments,
        isLoading,
        error,
        setComments,
    };
}