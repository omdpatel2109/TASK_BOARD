import { api } from "@/lib/api";
import type { TaskColumn } from "@/features/tasks/type/taskType";

export type CreateColumn = Omit<TaskColumn, "id">;

export async function getColumns(): Promise<TaskColumn[]> {
    const response = await api.get<TaskColumn[]>("/columns");
    return response.data.sort((a, b) => a.order - b.order);
}

export async function newColumn(column: CreateColumn): Promise<TaskColumn> {
    const response = await api.post<TaskColumn>("/columns", column);
    return response.data;
}