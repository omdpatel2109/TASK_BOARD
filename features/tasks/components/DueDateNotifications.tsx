"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays, X } from "lucide-react";
import { useTasks } from "@/features/tasks/hooks/useTasks";

export function getDueDateInfo(dueDate: string){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(`${dueDate}T00:00:00`);
    const differenceInDays = Math.round(
        (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if(differenceInDays < 0){
        return {
            label: "Overdue",
            style: "date-overdue",
        };
    }
    if(differenceInDays === 0){
        return {
            label: "Due today",
            style: "date-duetoday",
        };
    }
    if (differenceInDays <= 3) {
        return {
            label: "Due soon",
            style: "date-duesoon",
        };
    }
    return null;
}

export default function DueDateNotifications() {
    const { tasks } = useTasks();
    const [isOpen, setIsOpen] = useState(false);

    const notifications = tasks.filter((task) => {
        if(!task.dueDate || task.status === "done"){
            return false;
        }
        return getDueDateInfo(task.dueDate) !== null;
    }).sort((a, b) => a.dueDate!.localeCompare(b.dueDate!));

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button type="button" onClick={() => setIsOpen((previous) => !previous)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-primary-text transition hover:bg-slate-100 dark:text-third-dark-text dark:hover:bg-slate-700 cursor-pointer"
            >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                        {notifications.length > 99 ? "99+" : notifications.length}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:w-96">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-primary-dark-text">
                                Due Date Notifications
                            </h3>
                        </div>

                        <button type="button" onClick={() => setIsOpen(false)}
                            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Bell className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-primary-dark-text" />
                                <p className="text-sm font-medium text-slate-700 dark:text-third-dark-text">
                                    You're all caught up!
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-secondary-dark-text">
                                    No tasks are due within the next 3 days.
                                </p>
                            </div>
                        ) : (
                            notifications.map((task) => {
                                const dueDateInfo = getDueDateInfo(task.dueDate!)!;

                                return (
                                    <Link key={task.id} href={`/tasks/tasks/${task.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
                                        <div className="flex items-start gap-3">
                                            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-secondary-dark-text"/>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-800 dark:text-primary-dark-text">
                                                    {task.title}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500 dark:text-secondary-dark-text">
                                                    Due:{" "}{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${dueDateInfo.style}`}
                                            >
                                                {dueDateInfo.label}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}