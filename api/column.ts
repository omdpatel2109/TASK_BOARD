import { api } from "@/lib/api";
import type { TaskColumn, CreateColumn } from "@/features/tasks/type/taskType";

export async function getColumns(): Promise<TaskColumn[]> {
    const response = await api.get<TaskColumn[]>("/columns");
    return response.data.sort((a, b) => a.order - b.order);
}

export async function newColumn(column: CreateColumn): Promise<TaskColumn> {
    const response = await api.post<TaskColumn>("/columns", column);
    return response.data;
}

// Update a column's position.
export async function updateColumnOrder(id: string, order: number): Promise<TaskColumn> {
    const response = await api.patch<TaskColumn>(`/columns/${id}`,{order});
    return response.data;
}