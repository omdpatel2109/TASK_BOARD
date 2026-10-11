export  interface Comment{
    id: string,
    taskId: string,
    text: string,
    author: string
    createdAt: string,
    updatedAt: string
}

export interface CreateComment{
    taskId: string,
    text: string,
    createdAt: string,
}

export interface UpdateComment{
    text: string,
    updatedAt: string,
}