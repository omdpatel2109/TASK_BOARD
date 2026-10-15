"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task } from "@/features/tasks/type/taskType";
interface TaskListProps {
    tasks: Task[];
}

type StatusFilter = "all" | Task["status"];

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

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");

    const filteredTasks = tasks.filter((task) => {
        const searchedTask = search.trim().toLowerCase();

        const matchesSearch =
            task.title.toLowerCase().includes(searchedTask) ||
            (task.description ?? "").toLowerCase().includes(searchedTask);

        const matchesStatus =
            status === "all" || task.status === status;

        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row ">
                
                <input type="search" value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks..."
                    className="w-[500px] rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                />

                <select value={status}  onChange={(event) =>
                        setStatus(event.target.value as StatusFilter)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                >
                    <option value="all">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">
                Showing {filteredTasks.length} of {tasks.length} tasks
            </p>

            {/* Filtered task list */}
            {filteredTasks.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-center">
                    <p className="font-medium text-gray-700">
                        No tasks found.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or status filter.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 ">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700"
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

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(`/board/tasks/${task.id}`)
                                }
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