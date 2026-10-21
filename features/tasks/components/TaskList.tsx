"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/features/tasks/type/taskType";

interface TaskListProps {
    tasks: Task[];
}

const TASKS_PER_PAGE = 5;

const statusLabels: Record<Task["status"], string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
};

const statusStyles: Record<Task["status"], string> = {
    todo: "bg-slate-100 text-slate-700",
    in_progress: "bg-amber-100 text-amber-800",
    done: "bg-green-100 text-green-800",
};

export default function TaskList({ tasks }: TaskListProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
    // Keep the current page valid when filtering or deleting tasks.
    useEffect(() => {
        setCurrentPage((page) => Math.max(1, Math.min(page, totalPages || 1)));
    }, [totalPages]);
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    const paginatedTasks = tasks.slice(startIndex,startIndex + TASKS_PER_PAGE);

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
                <>
                    {/* Task cards */}
                    <div className="space-y-4">
                        {paginatedTasks.map((task) => (
                            <div key={task.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700"
                            >
                                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                                            {task.title}
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
                                            Description:{" "}{task.description || "No description provided."}
                                        </p>
                                    </div>
                                    <span
                                        className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                                    >
                                        {statusLabels[task.status]}
                                    </span>
                                </div>

                                <button type="button" onClick={() =>
                                        router.push(`/board/tasks/${task.id}`)
                                    }
                                    className="mt-4 cursor-pointer text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row">
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Showing {Math.min(startIndex + TASKS_PER_PAGE,tasks.length)}{" "} of {tasks.length} tasks
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button type="button" disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages },(_, index) => index + 1).map((page) => (
                                <button key={page} type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                                        currentPage === page ? "bg-blue-600 text-white"
                                            : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button type="button" disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => page + 1)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
