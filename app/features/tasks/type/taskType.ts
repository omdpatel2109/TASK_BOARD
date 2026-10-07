export type TaskStatus = "To do" | "In Progress" | "Done";

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