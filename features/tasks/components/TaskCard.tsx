"use client";
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/features/tasks/type/taskType";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({    id: String(task.id),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Native layout tracking to close dropdown safely
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // const theme = {
    //     todo: {
    //         border: "border-l-4 border-l-blue-500",
    //         title: "text-blue-600 dark:text-blue-400",
    //         hover: "hover:bg-blue-50 dark:hover:bg-slate-600",
    //     },
    //     in_progress: {
    //         border: "border-l-4 border-l-amber-500",
    //         title: "text-amber-600 dark:text-amber-400",
    //         hover: "hover:bg-amber-50 dark:hover:bg-slate-600",
    //     },
    //     done: {
    //         border: "border-l-4 border-l-green-600",
    //         title: "text-green-600 dark:text-green-400",
    //         hover: "hover:bg-green-50 dark:hover:bg-slate-600",
    //     },
    // };

    // const currentTheme = theme[task.status as keyof typeof theme] || theme.todo;
    // const style = {
    //     transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    //     transition: isDragging ? "none" : undefined,
    // };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className={`mx-2 min-w-0 rounded-md border border-gray-200 bg-white text-left shadow-sm transition dark:border-slate-600 dark:bg-slate-700 active:cursor-grabbing ${isDragging ? "z-10 opacity-60 shadow-lg" : "hover:shadow-md"} hover:-translate-y-0.5`}
        >
            <div className="min-w-0 p-3 sm:p-4">
                <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                    <h2 className="min-w-0 font-bold text-gray-800 dark:text-white sm:text-lg">
                        {task.title}
                    </h2>

                    <div className="flex items-center " ref={menuRef}>
                        <div className="relative">
                            <button type="button" onClick={(e) => {
                                    e.stopPropagation(); 
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                className="flex h-7 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-slate-600"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>

                            {/* Dropdown Action Overlay Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full z-50 mt-1 flex w-fit items-center gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">

                                    {/* View Details */}
                                    <Link href={`/tasks/tasks/${task.id}`}
                                        onClick={() => setIsMenuOpen(false)} title="View Details"
                                        className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>

                                    {/* Edit */}
                                    <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            setIsMenuOpen(false);
                                            onEdit(task);
                                        }}
                                        title="Edit"
                                        className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation();
                                            setIsMenuOpen(false);
                                            onDelete(String(task.id));
                                        }}
                                        className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card Main Body Description Link */}
                <Link 
                    href={`/tasks/tasks/${task.id}`}
                    className="block w-full min-w-0 cursor-pointer text-left focus:outline-none"
                >
                    <p className="text-sm text-gray-700 dark:text-slate-300 line-clamp-3">
                        Description: {task.description || "No description"}
                    </p>
                </Link>
            </div>
        </div>
    );
}