// export interface WorkflowStatus {
//     id: string;
//     title: string;
//     order: number;
//     isStart: boolean;
//     isCompleted: boolean;
// }

// export interface Workflow {
//     id: string;
//     name: string;
//     description?: string;
//     userId: number;
//     statuses: WorkflowStatus[];
//     createdAt: string;
//     updatedAt: string;
// }

// export interface CreateWorkflow {
//     name: string;
//     description?: string;
//     userId: number;
//     statuses: WorkflowStatus[];
// }

// export interface UpdateWorkflow {
//     name?: string;
//     description?: string;
//     statuses?: WorkflowStatus[];
//     updatedAt?: string;
// }
export interface WorkflowStatus {
    id: string;
    title: string;
    contentLanguage?: string;
    order: number;
    isStart: boolean;
    isCompleted: boolean;
}

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    contentLanguage?: string;
    userId: number;
    statuses: WorkflowStatus[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkflow {
    name: string;
    description?: string;
    contentLanguage?: string;
    userId: number;
    statuses: WorkflowStatus[];
}

export interface UpdateWorkflow {
    name?: string;
    description?: string;
    contentLanguage?: string;
    statuses?: WorkflowStatus[];
    updatedAt?: string;
}