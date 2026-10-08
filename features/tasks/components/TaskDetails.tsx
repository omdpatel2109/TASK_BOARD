"use client";

import { useRouter } from "next/navigation";

import type { Task } from "../type/taskType";

interface TaskDetailsProps {
    task: Task;
}

export default function TaskDetails({
    task
}: TaskDetailsProps) {
    const router = useRouter();

    return (
        <div className="w-full max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                    {` < `}
                </button>

                <button
                    type="button"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Edit Task
                </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <p className="mb-2 text-sm font-medium text-slate-500">
                        Task #{task.id}
                    </p>

                    <h1 className="text-2xl font-bold text-slate-900">
                        {task.title}
                    </h1>
                </div>

                <div className="mb-6">
                    <h2 className="mb-2 text-sm font-semibold text-slate-700">
                        Description
                    </h2>

                    <p className="text-slate-600">
                        {task.description || "No description provided."}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                            Status
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                            {task.status}
                        </p>
                    </div>

                    

                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                            Task ID
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                            {task.id}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Comments
                </h2>

                <p className="text-sm text-slate-500">
                    Comments will appear here.
                </p>
            </div>
        </div>
    );
}