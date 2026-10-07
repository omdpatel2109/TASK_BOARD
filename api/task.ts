import { api } from "@/lib/api";

import type {Task, CreateTask, UpdateTask} from "@/features/tasks/type/taskType";

export async function getTasks(): Promise<Task[]>{
    try{
        const response = await api.get<Task[]>("/tasks");
        return response.data;
    }catch(error){
        console.error("Error fetching tasks:", error);
        throw error;
    }
}

export async function getTaskById(id: string): Promise<Task>{
    try{
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    }catch(error){
        console.error("Error fetching task by id:", error);
        throw error;
    }
}

export async function createTask(task: CreateTask): Promise<Task>{
    try{
        const response = await api.post<Task>("/tasks", task);
        return response.data;
    }catch(error){
        console.error("Error creating task:", error);
        throw error;
    }
}

export async function updateTask(id: string, task: UpdateTask): Promise<Task>{
    try{
        const response = await api.patch<Task>(`/tasks/${id}`, task);
        return response.data;
    }catch(error){
        console.error("Error updating task:", error);
        throw error;
    }
}

export async function deleteTask(id: string): Promise<void>{
    try{
        await api.delete(`/tasks/${id}`);
    }catch(error){
        console.error("Error deleting task:",error);
        throw error;
    }
}