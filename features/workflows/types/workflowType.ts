export interface WorkflowStatus {
    id: string;
    title: string;
    order: number;
    isStart: boolean;
    isCompleted: boolean;
}

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    userId: number;
    statuses: WorkflowStatus[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkflow {
    name: string;
    description?: string;
    userId: number;
    statuses: WorkflowStatus[];
}

export interface UpdateWorkflow {
    name?: string;
    description?: string;
    statuses?: WorkflowStatus[];
    updatedAt?: string;
}