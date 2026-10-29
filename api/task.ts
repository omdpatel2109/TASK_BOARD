import { api, getApiErrorMessage } from "@/lib/api";
import type {Task, CreateTask, UpdateTask} from "@/features/tasks/type/taskType";

const RESOURCE = "tasks";

export async function getTasks(){
    try{
        const response = await api.get<Task[]>(`/${RESOURCE}`);
        return response.data;
    }catch(error){
        console.error("Error fetching tasks:", error);
        getApiErrorMessage(error);
        throw error;
    }
}

export async function getTaskById(id: string){
    try{
        const response = await api.get<Task>(`/${RESOURCE}/${id}`);
        return response.data;
    }catch(error){
        console.error("Error fetching task by id:", error);
        getApiErrorMessage(error);
        throw error;
    }
}

export async function createTask(task: CreateTask){
    try{
        const response = await api.post<Task>(`/${RESOURCE}`, task);
        return response.data;
    }catch(error){
        console.error("Error creating task:", error);
        getApiErrorMessage(error);
        throw error;
    }
}

export async function updateTask(id: string, task: UpdateTask){
    try{
        const response = await api.patch<Task>(`/${RESOURCE}/${id}`, task);
        return response.data;
    }catch(error){
        console.error("Error updating task:", error);
        getApiErrorMessage(error);
        throw error;
    }
}

export async function deleteTask(id: string): Promise<void>{
    try{
        await api.delete(`/${RESOURCE}/${id}`);
    }catch(error){
        console.error("Error deleting task:",error);
        getApiErrorMessage(error);
        throw error;
    }
}