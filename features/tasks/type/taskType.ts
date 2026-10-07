export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task{
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    order: number;
}

export interface CreateTask{
    title: string;
    description: string;
    status: TaskStatus;
    order: number;
}

export interface UpdateTask{
    title?: string;
    description?: string;
    status?: TaskStatus;
    order?: number;
}