"use client";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Task } from "@/features/tasks/type/taskType";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}
export default function TaskCard({task, onEdit, onDelete,}: TaskCardProps) {
    const router = useRouter();

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: String(task.id),
    });

    const theme = {
        todo:{
            border: "border-l-4 border-l-blue-500",
            title: "text-blue-600 dark:text-blue-400",
            hover: "hover:bg-blue-50 dark:hover:bg-slate-600",
        },
        in_progress:{
            border: "border-l-4 border-l-amber-500",
            title: "text-amber-600 dark:text-amber-400",
            hover: "hover:bg-amber-50 dark:hover:bg-slate-600",
        },
        done:{
            border: "border-l-4 border-l-green-600",
            title: "text-green-600 dark:text-green-400",
            hover: "hover:bg-green-50 dark:hover:bg-slate-600",
        },
    };

    const currentTheme = theme[task.status];

    const style = {
        //where to move the task (on x and y axis)
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)`: undefined,
        //it use for the dragged task card from lagging behind cursor due to a CSS transition.it disables transition animations on the card while dragging.
        transition: isDragging ? "none" : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}
            className={`mx-2 my-3 min-w-0 rounded-md border border-gray-200 bg-gray-100 text-left shadow-sm transition duration-200 dark:bg-slate-700 sm:mx-3 ${currentTheme.border} ${currentTheme.hover} ${
                isDragging ? "opacity-80" : "hover:-translate-y-0.5"
            }`}
        >
            <div className="min-w-0 p-3 sm:p-4">
                <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                    <h2
                        className={`min-w-0 font-bold sm:text-lg ${currentTheme.title}`}
                    >
                        {task.title}
                    </h2>

                    <button type="button" {...listeners} {...attributes}
                        className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 active:cursor-grabbing dark:text-gray-200 dark:hover:bg-slate-600"
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                </div>

                <button type="button" onClick={() => router.push(`/board/tasks/${task.id}`)}
                    className="block w-full min-w-0 cursor-pointer text-left"
                >
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                        Description: {task.description || "No description"}
                    </p>
                </button>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                    <button type="button" onClick={() => onEdit(task)}
                        className="flex min-h-11 min-w-0 items-center justify-center rounded-md border border-blue-200 bg-slate-200 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:border-slate-500 dark:bg-slate-500 dark:text-white dark:hover:bg-slate-400"
                    >
                        Edit
                    </button>

                    <button type="button" onClick={() => onDelete(String(task.id))}
                        className="flex min-h-11 min-w-0 items-center justify-center rounded-md border border-red-200 bg-red-100 px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}