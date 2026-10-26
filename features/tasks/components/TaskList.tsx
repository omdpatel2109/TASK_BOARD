"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/features/tasks/type/taskType";
import { useTasks } from "../hooks/useTasks";
import { getPriorityStyle } from "./TaskCard";

interface TaskListProps {
    tasks: Task[];
}

const TASKS_PER_PAGE = 5;

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
    const { columns } = useTasks();

    const getStatusLabel = (status: string) => {
        const column = columns.find((column) => String(column.id) === String(status));
        return column?.title ?? "Unknown Status";
    };

    return (
        <div>
            {tasks.length === 0 ? (
                <div className="rounded-lg mt-3 border bg-white border-slate-300 p-8 text-center dark:bg-slate-900 dark:border-slate-700">
                    <p className="font-medium text-primary-text dark:text-slate-200">
                        No tasks found.
                    </p>
                    <p className="mt-1 text-sm text-secondary-text dark:text-slate-400">
                        Try changing your search or status filter.
                    </p>
                </div>
            ) : (
                <>
                    {/* Task cards */}
                    <div className="space-y-4 mt-3">
                        {paginatedTasks.map((task) => (
                            <div key={task.id} className="rounded-lg border border-gray-200 bg-white pl-4 pt-3 pb-3 pr-3 shadow-sm dark:bg-slate-900 dark:border-slate-700"
                            >                                
                            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                <div>
                                    <h2 className="text-lg font-semibold text-primary-text dark:text-slate-100">
                                        {task.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-secondary-text dark:text-slate-400">
                                        Description:{" "}
                                        {task.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-start gap-2">
                                    <span
                                        className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityStyle(task.priority)}`}
                                    >
                                        {task.priority ?? ""}
                                    </span>

                                    <span
                                        className="h-fit w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                    >
                                        {getStatusLabel(task.status)}
                                    </span>
                                </div>
                            </div>


                                <button type="button" onClick={() =>
                                        router.push(`/tasks/tasks/${task.id}`)
                                    }
                                    className="mt-2 cursor-pointer text-sm font-semibold text-primary hover:text-hover-primary dark:text-blue-500 dark:hover:text-blue-400"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-2 flex flex-col items-center justify-between gap-4 p-4  sm:flex-row">
                        <p className="text-sm text-primary-text dark:text-slate-400">
                            Showing {Math.min(startIndex + TASKS_PER_PAGE,tasks.length)}{" "} of {tasks.length} tasks
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button type="button" disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-primary-text hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                Previous
                            </button>
                            <span className="text-primary-text dark:text-slate-400">{currentPage}</span>
                            <button type="button" disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => page + 1)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-primary-text hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
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
