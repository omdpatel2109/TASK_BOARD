"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/features/tasks/type/taskType";

interface TaskListProps {
    tasks: Task[];
     
}

const statusLabels: Record<Task["status"], string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
};

const statusStyles: Record<Task["status"], string> = {
    todo: "bg-slate-100 text-slate-700",
    in_progress: "bg-amber-100 text-amber-800",
    done: "bg-green-100 text-green-800"
};

export default function TaskList({ tasks }: TaskListProps) {
    const router = useRouter();    
    return (
        <div>
            {tasks.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center dark:bg-slate-900 dark:border-slate-700">
                    <p className="font-medium text-gray-700 dark:text-slate-200">
                        No tasks found.
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        Try changing your search or status filter.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700"
                        >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                                        {task.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                                        Description: {task.description || "No description provided."}
                                    </p>
                                </div>
                                <span className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`} >
                                    {statusLabels[task.status]}
                                </span>
                            </div>
                            <button type="button"
                                onClick={() => router.push(`/board/tasks/${task.id}`)}
                                className="mt-4 text-sm font-semibold text-blue-700 cursor-pointer hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-600"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}