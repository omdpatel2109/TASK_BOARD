"use client";
import Link from "next/link";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { Layers3, ListTodo, Clock3, CircleCheck,} from "lucide-react";
export default function Dashboard() {
    const {tasks, isLoading, error, loadTasks, columns} = useTasks();
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length;
    const todoTasks = tasks.filter((task) => task.status === "todo").length;
    const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const stats = [
        {
            label: "Total Tasks",
            value: tasks.length,
            description: "All tasks in your workspace",
            icon: Layers3,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
        },
        {
            label: "To Do",
            value: todoTasks,
            description: "Waiting to be started",
            icon: ListTodo,
            color: "text-slate-600 bg-slate-100 dark:bg-slate-800",
        },
        {
            label: "In Progress",
            value: inProgressTasks,
            description: "Currently being worked on",
            icon: Clock3,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
        },
        {
            label: "Completed",
            value: completedTasks,
            description: "Successfully finished",
            icon: CircleCheck,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
        },
    ];

    return (
        <section className="mx-auto w-full max-w-7xl space-y-7 p-4 sm:p-6 lg:p-6">
            {/* Page heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Track your tasks and monitor your progress.
                    </p>
                </div>

                <Link href="/tasks" className="flex w-fit items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    View all tasks
                </Link>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                >
                    Loading your dashboard...
                </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
                <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                    </p>
                    <button onClick={() => void loadTasks()} className="w-fit rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-slate-900 dark:text-red-300"
                    >
                        Try again
                    </button>
                </div>
            )}
            {!isLoading && !error && (
                <>
                    {/* Statistics */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {stat.label}
                                        </p>
                                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${stat.color}`}>
                                        <stat.icon size={22}/>
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Progress and column overview */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Overall progress
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Percentage of tasks completed
                                    </p>
                                </div>

                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {completionRate}%
                                </span>
                            </div>

                            <div className="mt-6 h-3 rounded-full bg-slate-100 dark:bg-slate-800"
                            >
                                <div className="h-full rounded-full bg-blue-600"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>

                            <div className="mt-3 flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                <span>{completedTasks} completed</span>
                                <span>{tasks.length - completedTasks} remaining</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Task columns
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Tasks grouped by status
                            </p>

                            <div className="mt-5 space-y-4">
                                {([...columns].sort((a, b) => a.order - b.order)
                                ).map((column) => {
                                    const count = tasks.filter((task) => task.status === column.id).length;
                                    return (
                                        <div key={column.id} className="flex items-center justify-between gap-3"
                                        >
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                {column.title}
                                            </span>
                                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
