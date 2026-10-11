"use client";

import { useRouter } from "next/navigation";
import type { Task } from "../type/taskType";

interface TaskDetailsProps {
    task: Task;
}

export default function TaskDetails({ task }: TaskDetailsProps) {
    const router = useRouter();

    const statusStyles: Record<Task["status"], string> = {
        todo: "bg-slate-100 text-slate-700",
        in_progress: "bg-amber-100 text-amber-800",
        done: "bg-green-100 text-green-800",
    };

    const statusLabels: Record<Task["status"], string> = {
        todo: "To Do",
        in_progress: "In Progress",
        done: "Completed",
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                    ← Back
                </button>

                <button
                    type="button"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                    Edit Task
                </button>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="mb-2 text-sm text-slate-500">
                            Task #{task.id}
                        </p>

                        <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900">
                            {task.title}
                        </h1>
                    </div>

                    <span
                        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                            statusStyles[task.status]
                        }`}
                    >
                        {statusLabels[task.status]}
                    </span>
                </div>

                <div className="py-5">
                    <h2 className="mb-2 text-sm font-semibold text-slate-800">
                        Description
                    </h2>

                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                        {task.description || "No description provided."}
                    </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Task ID
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                        {task.id}
                    </p>
                </div>
            </section>
        </div>
    );
}