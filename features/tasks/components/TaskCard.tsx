"use client";
import { useState } from "react";
import { MoreVertical, Edit2, Trash2, Eye, CalendarDays } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/features/tasks/type/taskType";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export function getPriorityStyle(priority?: string) {
    switch(priority){
        case "high":
            return "priority-high";
        case "medium":
            return "priority-medium";
        case "low":
            return "priority-low";
        default:
            return "priority-default";
    }
}

function getDueDateStyle(dueDate: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(`${dueDate}T00:00:00`);
    const differenceInDays = Math.round(
        (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if(differenceInDays < 0){
        return {
            label: "Overdue",
            style: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
        };
    }

    if(differenceInDays === 0){
        return {
            label: "Due today",
            style: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
        };
    }
    if(differenceInDays <= 3){
        return {
            label: "Due soon",
            style: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
        };
    }

    return {
        label: "",
        style: "",
    };
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: String(task.id)}); //useSortable - inable the item to sortable and provide the properties to drag card, calculate the position

    const style = {
        transform: CSS.Transform.toString(transform), //Moves the task card to the position calculated by dnd-kit
        transition, // card move smoothly when its position changes, such as when another task moves into its place
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className={`mx-2 min-w-0 rounded-md border border-slate-200 bg-white text-left shadow-sm transition dark:border-slate-600 dark:bg-slate-700 active:cursor-grabbing ${isDragging ? "z-10 opacity-60 shadow-lg" : "hover:shadow-md"} hover:-translate-y-0.5`}
        >
            <div className="min-w-0 p-3 sm:p-4">
                <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                    <h2 className="min-w-0 font-bold text-primary-text dark:text-white sm:text-lg">
                        {task.title}
                    </h2>

                    <div className="flex items-center justify-between gap-2">
                        <div className="mb-2">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityStyle(task.priority)}`}
                            >
                                {task.priority ?? ""}
                            </span>
                        </div>

                        <div className="" >
                            <div className="relative">
                                <button type="button" onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                        e.stopPropagation(); 
                                        setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className="flex h-7 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-600 cursor-pointer"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>

                                {/* Dropdown Action Overlay Menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full z-50 mt-1 flex w-fit items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">

                                        {/* View Details */}
                                        <Link href={`/tasks/tasks/${task.id}`}
                                            onClick={(e) => {
                                                setIsMenuOpen(false);
                                                // e.stopPropagation();
                                            }} onPointerDown={(e) => e.stopPropagation()}
                                            className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </Link>

                                        {/* Edit */}
                                        <button type="button" onClick={(e) => {
                                                setIsMenuOpen(false);
                                                onEdit(task);
                                            }} onPointerDown={(e) => e.stopPropagation()}
                                            className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </button>

                                        {/* Delete */}
                                        <button type="button"
                                            onClick={(e) => { e.stopPropagation();
                                                setIsMenuOpen(false);
                                                onDelete(String(task.id));
                                            }} onPointerDown={(e) => e.stopPropagation()}
                                            className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700 cursor-pointer"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Main Body Description Link */}
                <p className="text-sm text-secondary-text dark:text-slate-300 line-clamp-3">
                    Description: {task.description || "No description"}
                </p>

                {task.dueDate && ((() => {
                    const dueDateInfo = getDueDateStyle(task.dueDate);
                        return (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>
                                        {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
                                            undefined,
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>
                                </div>

                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${dueDateInfo.style}`}>
                                    {dueDateInfo.label}
                                </span>
                            </div>
                        );
                    })()
                )}
            </div>
        </div>
    );
}