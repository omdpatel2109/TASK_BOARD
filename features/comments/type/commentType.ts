export interface Comment {
  id: string;
  taskId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  authorName: string;
}

export interface CreateComment {
  taskId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  authorName: string;
}

export interface UpdateComment {
  text: string;
  updatedAt: string;
}