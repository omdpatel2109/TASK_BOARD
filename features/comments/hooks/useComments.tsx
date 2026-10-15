"use client";

import { useCallback, useEffect, useState } from "react";
import {getCommentsByTask, createComment, updateComment, deleteComment} from "@/api/comments";
import type { Comment, CreateComment,} from "@/features/comments/type/commentType";
import { getApiErrorMessage } from "@/lib/api";

export function useComments(taskId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadComments = useCallback(async () => {
        if(!taskId){
            setComments([]);
            setLoadError(null);
            setIsLoading(false);
            return;
        }

        try{
            setIsLoading(true);
            setLoadError(null);
            const data = await getCommentsByTask(taskId);
            setComments(data);
        }catch(error){
            console.error("Failed to load comments:", error);
            setLoadError("Failed to load comments.");
        }finally{
            setIsLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    async function addComment(comment: CreateComment){
        try{
            setError(null);
            const newComment = await createComment(comment);
            setComments((current) => [...current, newComment]);
        }catch(error){
            setError(getApiErrorMessage(error));
        }
    }

    async function editComment(id: string, text: string){
        try{
            const updatedComment = await updateComment(id, {
                text, updatedAt: new Date().toISOString(),
            });

            setComments((current) =>
                current.map((comment) =>
                    comment.id === id ? updatedComment : comment
                )
            );

            setError(null);
        }catch(error){
            setError(getApiErrorMessage(error));
        }
    }

    async function removeComment(id: string) {
        try{
            await deleteComment(id);
            setComments((current) =>
                current.filter((comment) => comment.id !== id)
            );

            setError(null);
        }catch(error){
            console.error("Failed to delete comment:", error);
            setError(getApiErrorMessage(error));
        }
    }

    return{
        comments, isLoading, error, addComment,
        editComment, removeComment, loadComments, setLoadError, loadError
    };
}