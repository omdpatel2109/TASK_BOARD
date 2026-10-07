import {api} from "@/lib/api";
import type {Task, CreateTask, UpdateTask} from "@/app/features/tasks/type/taskType";

export async function getTasks(){
    try{
        const response = await api.get<Task[]>("/tasks");
        return response.data;
    }catch(error){
        console.error("Error fetching tasks: ", error);
    }
}

export async function getTaskById(id: string){
    try{
        const response = await api.get<Task>(`tasks/${id}`);
        return response.data;
    }catch(error){
        console.error("Error fetching task by id: ", error);
    }
}

export async function createTask(task: CreateTask){
    try{
        const response = await api.post<Task>("/tasks", task);
        return response.data;
    }catch(error){
        console.error("Error creating task: ", error);
    }
}

export async function updateTask(id: string, task: UpdateTask){
    try{
        const response = await api.patch<Task>(`tasks/${id}`, task);
        return response.data;
    }catch(error){
        console.error("Error updating task: ", error);
    }
}

export async function deleteTask(id: string){
    try{
        const response = await api.delete<Task>(`tasks/${id}`);
    }catch(error){
        console.error("Error deleting task: ", error);
    }
}