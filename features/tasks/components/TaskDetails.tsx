"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CalendarDays } from "lucide-react";
import TaskForm from "./TaskForm";
import type { Task } from "../type/taskType";
import SuccessBox from "@/components/SuccessBox";
import { getCurrentUser } from "@/features/auth/action";
import type { SafeUser } from "@/features/auth/type/userType";
import { useTasks } from "../hooks/useTasks";
import { getPriorityStyle } from "./TaskCard";
import { getDueDateStyle } from "./TaskCard";

interface TaskDetailsProps {
    task: Task;
    onUpdate: (updatedTask: Task) => void;
    onClose: () => void;
}

export default function TaskDetails({task, onUpdate, onClose}: TaskDetailsProps) {
    const router = useRouter();
    const {columns} = useTasks();
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        let active = true;
        async function loadCurrentUser() {
            try{
                const user = await getCurrentUser();
                if(active){
                    setCurrentUser(user);
                    if(!user){
                        router.push("/login");
                    }
                }
            }finally{
                if(active) setIsUserLoading(false);
            }
        }
        void loadCurrentUser();
        return () => {
            active = false;
        };
    }, [router]);

    function handleEditSuccess(updatedTask: Task) {
        onUpdate(updatedTask);
        setSuccessMessage("Task updated successfully..")
        setIsEditing(false);
    }

    const statusLabels: Record<Task["status"], string> = {
        todo: "To Do",
        in_progress: "In Progress",
        done: "Completed"
    };

    if(isUserLoading){
        return <p className="p-6">Please wait for a while...</p>;
    }

    if(!currentUser){ 
        return <p className="p-6">Redirecting to login...</p>;
    }

    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <button type="button" onClick={() => {
                            onClose();
                            router.back();
                        }}
                        className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 cursor-pointer dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                    >
                        <ArrowLeftIcon className="h-3 w-3" />
                        Back
                    </button>

                    <button type="button" onClick={() => setIsEditing(true)}
                        className="rounded-md bg-primary px-4 py-2 text-md font-medium text-white transition-colors hover:bg-hover-primary cursor-pointer"
                    >
                        Edit Task
                    </button>
                </div>
                
                <SuccessBox message={successMessage} onClose={() => setSuccessMessage("")}/>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:bg-slate-900 dark:border-slate-700">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-slate-700">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-semibold text-primary-text dark:text-slate-100 mb-3">
                                {task.title}
                            </h1>
                            <span className={` h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityStyle(task.priority)}`}>
                                {task.priority ?? ""}
                            </span>
                        </div>

                        <div className="flex flex-col items-end w-full">
                            <span
                                className="w-fit rounded-full px-3 py-1 text-xs font-medium mb-5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 " 
                            >
                                {statusLabels[task.status]}
                            </span>
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

                    <div className="py-5">
                        <h2 className="mb-2 text-lg font-semibold text-secondary-text dark:text-slate-400">
                            Description
                        </h2>

                        <p className="text-md text-slate-600 dark:text-slate-400">
                            {task.description || "No description provided."}
                        </p>
                    </div>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                            <h2 className="mb-5 text-xl font-semibold text-primary-text">
                                Edit Task
                            </h2>

                            <TaskForm task={task} columns={columns}
                                onSuccess={handleEditSuccess} onCancel={() => setIsEditing(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}