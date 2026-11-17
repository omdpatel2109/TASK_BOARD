// export interface TaskColumn {
//     id: string;
//     title: string;
//     order: number;
// }

// export type CreateColumn = Omit<TaskColumn, "id">;

// export type TaskStatus = string;
// export type TaskPriority = "low" | "medium" | "high";

// // export interface Task {
// //     id: string;
// //     title: string;
// //     description: string;
// //     status: TaskStatus;
// //     priority?: TaskPriority;
// //     dueDate?: string | null;
// //     order: number;
// // }

// // export interface CreateTask {
// //     title: string;
// //     description: string;
// //     status: TaskStatus;
// //     priority: TaskPriority;
// //     dueDate?: string | null;
// //     order: number;
// // }

// export interface Task {
//     id: string;
//     workflowId: string;
//     title: string;
//     description: string;
//     status: TaskStatus;
//     priority?: TaskPriority;
//     dueDate?: string | null;
//     order: number;
// }

// export interface CreateTask {
//     workflowId: string;
//     title: string;
//     description: string;
//     status: TaskStatus;
//     priority: TaskPriority;
//     dueDate?: string | null;
//     order: number;
// }

// export interface UpdateTask {
//     title?: string;
//     description?: string;
//     status?: TaskStatus;
//     priority?: TaskPriority;
//     dueDate?: string | null;
//     order: number;
// }

// export interface TaskFormValues {
//     title: string;
//     description: string;
//     status: TaskStatus;
//     priority: TaskPriority;
//     dueDate: string;
// }

import type { WorkflowStatus } from "@/features/workflows/types/workflowType";

export type TaskColumn = WorkflowStatus;

export type CreateColumn = Omit<TaskColumn, "id">;

export type TaskStatus = string;

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    id: string;
    workflowId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
    order: number;
}

export interface CreateTask {
    workflowId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
    order: number;
}

export interface UpdateTask {
    title?: string;
    description?: string;
    workflowId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
    order?: number;
}

export interface TaskFormValues {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
}
