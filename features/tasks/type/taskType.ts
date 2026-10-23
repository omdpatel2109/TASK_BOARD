export interface TaskColumn {
    id: string;
    title: string;
    order: number;
}
export type TaskStatus = string;
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority?: TaskPriority;
    order: number;
}

export interface CreateTask {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    order: number;
}

export interface UpdateTask {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    order: number;
}

export interface TaskFormValues {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
}