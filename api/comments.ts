import {api} from "@/lib/api";
import type {Comment, CreateComment, UpdateComment} from "@/app/features/comments/type/commentType";

export async function getCommentsByTask(taskId: string){
    try{
        const response = await api.get<Comment[]>(`comments?taskId=${taskId}`);
        return response.data;
    }catch(error){
        console.error("Error fetching comments by task id: ", error);
    }
}

export async function createComment(comment: CreateComment){
    try{
        const response = await api.post<Comment>("/comments", comment);
        return response.data;
    }catch(error){
        console.error("Error creating comment: ", error);
    }
}

export async function updateComment(id: string, comment: UpdateComment){
    try{
        const response = await api.patch<Comment>(`comments/${id}`, comment);
        return response.data;
    }catch(error){
        console.error("Error updating comment: ", error);
    }
}

export async function deleteComment(id: string){
    try{
        const response = await api.delete<Comment>(`comments/${id}`);
        return response.data;
    }catch(error){
        console.error("Error deleting comment: ", error);
    }
}