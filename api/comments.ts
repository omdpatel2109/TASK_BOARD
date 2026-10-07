import { api } from "@/lib/api";

import type {Comment, CreateComment, UpdateComment} from "@/features/comments/type/commentType";

export async function getCommentsByTask(taskId: string): Promise<Comment[]>{
    try{
        const response = await api.get<Comment[]>(`/comments?taskId=${taskId}`);
        return response.data;
    }catch(error){
        console.error("Error fetching comments by task id:", error);
        throw error;
    }
}

export async function createComment(comment: CreateComment): Promise<Comment>{ 
    try{
        const response = await api.post<Comment>("/comments", comment);
        return response.data;
    }catch(error){
        console.error("Error creating comment:", error);
        throw error;
    }
}

export async function updateComment(id: string, comment: UpdateComment): Promise<Comment>{
    try{
        const response = await api.patch<Comment>(`/comments/${id}`, comment);
        return response.data;
    }catch(error){
        console.error("Error updating comment:", error);
        throw error;
    }
}

export async function deleteComment(id: string): Promise<void>{
    try{
        await api.delete(`/comments/${id}`);
    }catch(error){
        console.error("Error deleting comment:", error);
        throw error;
    }
}