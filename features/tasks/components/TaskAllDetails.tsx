"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskDetails from "@/features/tasks/components/TaskDetails";
import CommentList from "@/features/comments/components/CommentList";
import CommentBox from "@/features/comments/components/CommentBox";
import { useComments } from "@/features/comments/hooks/useComments";
import type { Task } from "@/features/tasks/type/taskType";
import type { SafeUser } from "@/features/auth/type/userType";

interface TaskAllDetailsProps {
    initialTask: Task;
    currentUser: SafeUser;
}

export default function TaskAllDetails({initialTask, currentUser}: TaskAllDetailsProps) {
    const router = useRouter();
    const [task, setTask] = useState<Task>(initialTask);
    const commentsState = useComments(String(task.id));

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-background">
            <div className="mx-auto max-w-4xl space-y-6">
                <TaskDetails
                    task={task}
                    onUpdate={setTask}
                    onClose={() => router.push("/board")}
                />

                <CommentBox
                    taskId={String(task.id)}
                    currentUser={currentUser}
                    addComment={commentsState.addComment}
                    error={commentsState.error}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900">
                    <CommentList
                        comments={commentsState.comments}
                        currentUserId={currentUser.id}
                        isLoading={commentsState.isLoading}
                        error={commentsState.error}
                        editComment={commentsState.editComment}
                        removeComment={commentsState.removeComment}
                        loadError={commentsState.loadError}
                        onRetry={() => commentsState.loadComments()}
                    />
                </div>
            </div>
        </div>
    );
}