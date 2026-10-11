"use client";

import { useComments } from "@/features/comments/hooks/useComments";

interface CommentListProps {
    taskId: string;
}

export default function CommentList({ taskId }: CommentListProps) {
    const { comments, isLoading, error } = useComments(taskId);

    if (isLoading) {
        return (
            <p className="py-4 text-sm text-slate-500">
                Loading comments...
            </p>
        );
    }

    if (error) {
        return (
            <p className="py-4 text-sm text-red-600">
                {error}
            </p>
        );
    }

    if (comments.length === 0) {
        return (
            <p className="py-4 text-sm text-slate-500">
                No comments yet.
            </p>
        );
    }

    return (
        <div className="divide-y divide-slate-100">
            {comments.map((comment) => (
                <article key={comment.id} className="py-4">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-800">
                            {comment.author}
                        </p>

                        <time className="text-xs text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </time>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {comment.text}
                    </p>
                </article>
            ))}
        </div>
    );
}