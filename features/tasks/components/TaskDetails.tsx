"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import TaskForm from "./TaskForm";
import type { Task } from "../type/taskType";
import SuccessBox from "@/components/SuccessBox";

interface TaskDetailsProps {
    task: Task;
    onUpdate: (updatedTask: Task) => void;
    onClose: () => void;
}

export default function TaskDetails({
    task,
    onUpdate,
    onClose
}: TaskDetailsProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    function handleEditSuccess(updatedTask: Task) {
        onUpdate(updatedTask);
        setSuccessMessage("Task updated successfully..")
        setIsEditing(false);
    }

    const statusStyles: Record<Task["status"], string> = {
        todo: "bg-slate-100 text-slate-700",
        in_progress: "bg-amber-100 text-amber-800",
        done: "bg-green-100 text-green-800"
    };

    const statusLabels: Record<Task["status"], string> = {
        todo: "To Do",
        in_progress: "In Progress",
        done: "Completed"
    };

    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            router.back();
                        }}
                        className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                    >
                        <ArrowLeftIcon className="h-3 w-3" />
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="rounded-md bg-blue-600 px-4 py-2 text-md font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Edit Task
                    </button>
                </div>
                
                <SuccessBox message={successMessage} onClose={() => setSuccessMessage("")}/>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="mb-2 text-sm text-slate-500">
                                Task #{task.id}
                            </p>

                            <h1 className="text-2xl font-semibold text-slate-900">
                                {task.title}
                            </h1>
                        </div>

                        <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[task.status]}`}
                        >
                            {statusLabels[task.status]}
                        </span>
                    </div>

                    <div className="py-5">
                        <h2 className="mb-2 text-sm font-semibold text-slate-800">
                            Description
                        </h2>

                        <p className="text-sm leading-7 text-slate-600">
                            {task.description || "No description provided."}
                        </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-medium text-slate-400">
                            TASK ID
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                            {task.id}
                        </p>
                    </div>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                            <h2 className="mb-5 text-xl font-semibold text-slate-900">
                                Edit Task
                            </h2>

                            <TaskForm
                                task={task}
                                onSuccess={handleEditSuccess}
                                onCancel={() => setIsEditing(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}