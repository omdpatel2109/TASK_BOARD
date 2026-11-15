
import { api } from "@/lib/api";
import type {
    Workflow,
    CreateWorkflow,
    UpdateWorkflow,
} from "@/features/workflows/types/workflowType";

export async function getWorkflows(userId: number): Promise<Workflow[]> {
    const response = await api.get<Workflow[]>(
        `/workflows?userId=${userId}`
    );

    return response.data;
}

export async function getWorkflowById(id: string): Promise<Workflow> {
    const response = await api.get<Workflow>(`/workflows/${id}`);
    return response.data;
}

export async function createWorkflow(
    workflow: CreateWorkflow
): Promise<Workflow> {
    const now = new Date().toISOString();

    const response = await api.post<Workflow>("/workflows", {
        ...workflow,
        createdAt: now,
        updatedAt: now,
    });

    return response.data;
}

export async function updateWorkflow(
    id: string,
    workflow: UpdateWorkflow
): Promise<Workflow> {
    const response = await api.patch<Workflow>(
        `/workflows/${id}`,
        {
            ...workflow,
            updatedAt: new Date().toISOString(),
        }
    );

    return response.data;
}

export async function deleteWorkflow(id: string): Promise<void> {
    await api.delete(`/workflows/${id}`);
}
