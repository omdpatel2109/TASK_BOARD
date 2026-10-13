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

export default function TaskCard({task, onEdit, onDelete}: TaskCardProps){
    const router = useRouter();

    const {attributes, listeners, setNodeRef, transform, isDragging,} = useDraggable({
        id: String(task.id),
    });

    const theme = {
        todo:{
            border: "border-l-4 border-l-blue-500 border-r-gray-300 border-y-gray-300",
            title: "text-blue-600",
            hover: "hover:bg-blue-50",
        },
        in_progress:{
            border: "border-l-4 border-l-amber-500 border-r-gray-300 border-y-gray-300",
            title: "text-amber-600",
            hover: "hover:bg-amber-50",
        },
        done:{
            border: "border-l-4 border-l-green-600 border-r-gray-300 border-y-gray-300",
            title: "text-green-600",
            hover: "hover:bg-green-50",
        },
    };

    const currentTheme = theme[task.status];

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        transition: isDragging ? "none" : undefined,
        willChange: isDragging ? "transform" : undefined,
    };

    return (
        <div ref={setNodeRef} style={style}
            className={`mx-4 my-4 rounded-md border-2 bg-gray-100 text-left shadow-lg transition duration-200 ${currentTheme.border} ${currentTheme.hover}
                ${isDragging ? "z-10 opacity-100" : "hover:-translate-y-1"}
            `}
        >
            <div className="p-4">
                <div className="mb-2 flex justify-between">
                    <h2 className={`text-lg font-bold ${currentTheme.title}`}>
                        {task.title}
                    </h2>

                    <button type="button" {...listeners} {...attributes}
                        className="cursor-grab rounded p-1 text-gray-500 hover:bg-gray-200 active:cursor-grabbing"
                    >
                        <GripVertical className="h-5 w-5" />
                    </button>
                </div>

                <button type="button" onClick={() => router.push(`/board/tasks/${task.id}`)}
                    className="block w-full text-left cursor-pointer"
                >
                    <p className="text-sm leading-6 text-gray-700">
                        Description: {task.description}
                    </p>
                </button>

                <div className="mt-4 grid lg:grid-cols-2 gap-5 sm:grid-cols-1 md:grid-cols-1">
                    <button type="button" onClick={() => onEdit(task)}
                        className="rounded-md border border-blue-200 bg-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-300"
                    >
                        Edit
                    </button>

                    <button type="button" onClick={() => onDelete(task.id)}
                        className="rounded-md border border-red-200 bg-red-100 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-200 "
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}