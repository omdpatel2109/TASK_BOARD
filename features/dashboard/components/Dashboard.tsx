"use client";
import Link from "next/link";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useTranslations } from "next-intl";
import {Layers3, ListTodo, Clock3, CircleCheck, TriangleAlert, CalendarDays} from "lucide-react";

export default function Dashboard() {
    const {tasks, isLoading, error, loadTasks, columns} = useTasks();
    const t = useTranslations("dashboard");
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length;
    const todoTasks = tasks.filter((task) => task.status === "todo").length;
    const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeTasksWithDueDates = tasks.filter((task) => task.dueDate && task.status !== "done");
    const overdueTasks = activeTasksWithDueDates.filter((task) => {
        const dueDate = new Date(`${task.dueDate}T00:00:00`);
        return dueDate < today;
    }).length;
    const dueTodayTasks = activeTasksWithDueDates.filter((task) => {
        const dueDate = new Date(`${task.dueDate}T00:00:00`);
        return dueDate.getTime() === today.getTime();
    }).length;

    const stats = [
        {
            key: "totalTasks",
            value: tasks.length,
            icon: Layers3,
            color: "text-primary bg-blue-50 dark:bg-blue-950/50",
        },
        {
            key: "todo",
            value: todoTasks,
            icon: ListTodo,
            color: "text-slate-600 bg-slate-100 dark:bg-slate-800",
        },
        {
            key: "inProgress",
            value: inProgressTasks,
            icon: Clock3,
            color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
        },
        {
            key: "completed",
            value: completedTasks,
            icon: CircleCheck,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
        },
        {
            key: "overdue",
            value: overdueTasks,
            icon: TriangleAlert,
            color: "text-red-600 bg-red-50 dark:bg-red-950/40",
        },
        {
            key: "duetoday",
            value: dueTodayTasks,
            icon: CalendarDays,
            color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
        },
    ];

    return(
        <div className="w-full max-w-7xl space-y-7 p-4 sm:p-6 lg:p-6">

            {/* Page heading */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary-text dark:text-primary-dark-text sm:text-3xl">
                        {t("title")}
                    </h1>
                    <p className="mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
                        {t("subtitle")}
                    </p>
                </div>

                <Link href="/tasks" className="flex w-fit items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-hover-primary focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {t("viewAllTasks")}
                </Link>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-secondary-text dark:border-slate-800 dark:bg-slate-900 dark:text-secondary-dark-text"
                >
                    {t("loading")}
                </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
                <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-error dark:text-red-300">
                        {error}
                    </p>

                    <button type="button" onClick={() => void loadTasks()}
                        className="w-fit rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-error hover:bg-red-100 dark:border-red-900 dark:bg-slate-900 dark:text-red-300"
                    >
                        {t("tryAgain")}
                    </button>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {/* Statistics */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-md font-semibold text-secondary-text dark:text-secondary-dark-text">
                                                {t(`stats.${stat.key}.label`)}
                                            </p>

                                            <p className="mt-3 text-3xl font-bold tracking-tight text-primary-text dark:text-primary-dark-text">
                                                {stat.value}
                                            </p>
                                        </div>

                                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${stat.color}`}>
                                            <Icon size={22} />
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm text-slate-500 dark:text-secondary-dark-text">
                                        {t(`stats.${stat.key}.description`)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress and column overview */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-primary-text dark:text-primary-dark-text">
                                        {t("progress.title")}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-secondary-dark-text">
                                        {t("progress.description")}
                                    </p>
                                </div>

                                <span className="text-2xl font-bold text-primary dark:text-blue-400">
                                    {completionRate}%
                                </span>
                            </div>

                            <div className="mt-6 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                                <div className="h-full rounded-full bg-primary duration-300"
                                    style={{ width: `${completionRate}%` }} //React's style prop lets you apply CSS styles dynamically.
                                />
                            </div>

                            <div className="mt-3 flex justify-between gap-3 text-sm text-slate-500 dark:text-secondary-dark-text">
                                <span>
                                    {t("progress.completed", {
                                        count: completedTasks,
                                    })}
                                </span>

                                <span>
                                    {t("progress.remaining", {
                                        count: tasks.length - completedTasks,
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Task columns */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-primary-text dark:text-primary-dark-text">
                                {t("columns.title")}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-secondary-dark-text">
                                {t("columns.description")}
                            </p>

                            <div className="mt-5 space-y-4">
                                {[...columns].sort((a, b) => a.order - b.order)
                                    .map((column) => {
                                        const count = tasks.filter(
                                            (task) => task.status === column.id).length;

                                        return (
                                            <div key={column.id} className="flex items-center justify-between gap-3">
                                                <span className="text-sm text-secondary-text dark:text-third-dark-text">
                                                    {t.has(`status.${column.id}`)
                                                        ? t(`status.${column.id}`)
                                                        : column.title}
                                                </span>

                                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-secondary-text dark:bg-slate-800 dark:text-third-dark-text">
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
        </div>
    );
}