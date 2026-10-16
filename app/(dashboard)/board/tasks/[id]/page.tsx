
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getTaskById } from "@/api/task";
import { getCurrentUser } from "@/features/auth/action";

import TaskDetails from "@/features/tasks/components/TaskDetails";
import CommentList from "@/features/comments/components/CommentList";
import CommentBox from "@/features/comments/components/CommentBox";

import type { Task } from "@/features/tasks/type/taskType";
import type { SafeUser } from "@/features/auth/type/userType";

import { useComments } from "@/features/comments/hooks/useComments";

export default function TaskDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [task, setTask] = useState<Task | null>(null);
    const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [error, setError] = useState("");

    const commentsState = useComments(task?.id ?? "");

    // Fetch the currently authenticated user.
    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const user = await getCurrentUser();

                if (!user) {
                    router.replace("/login");
                    return;
                }

                setCurrentUser(user);
            } catch (error) {
                console.error("Failed to load current user:", error);
                router.replace("/login");
            } finally {
                setIsAuthLoading(false);
            }
        }

        void loadCurrentUser();
    }, [router]);

    // Fetch the task.
    useEffect(() => {
        async function loadTask() {
            try {
                setIsLoading(true);
                setError("");

                const data = await getTaskById(params.id);
                setTask(data);
            } catch (error) {
                console.error("Failed to load task:", error);
                setError("Unable to load this task. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadTask();
    }, [params.id]);

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
                <p className="text-slate-600 dark:text-slate-300">
                    Checking authentication...
                </p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
                <p className="text-slate-600 dark:text-slate-300">
                    Redirecting to login...
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
                <p className="text-slate-600 dark:text-slate-300">
                    Loading task...
                </p>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
                <p className="text-red-600">
                    {error || "Task not found."}
                </p>

                <button
                    type="button"
                    onClick={() => router.push("/board")}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                    Back to Board
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950">
            <div className="mx-auto max-w-4xl space-y-6">
                <TaskDetails
                    task={task}
                    onUpdate={(updatedTask) => setTask(updatedTask)}
                    onClose={() => router.push("/board")}
                />

                <CommentBox
                    taskId={task.id}
                    currentUser={currentUser}
                    addComment={commentsState.addComment}
                    error={commentsState.error}
                />

                <div
                    className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900"
                >
                    <CommentList
                        comments={commentsState.comments}
                        currentUserId={currentUser.id}
                        isLoading={commentsState.isLoading}
                        error={commentsState.error}
                        editComment={commentsState.editComment}
                        removeComment={commentsState.removeComment}
                        loadError={commentsState.loadError}
                        onRetry={() => void commentsState.loadComments()}
                    />
                </div>
            </div>
        </div>
    );
}
