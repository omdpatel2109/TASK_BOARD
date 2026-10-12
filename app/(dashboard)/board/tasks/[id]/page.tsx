"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskById } from "@/api/task";
import TaskDetails from "@/features/tasks/components/TaskDetails";
import CommentList from "@/features/comments/components/CommentList";
import CommentBox from "@/features/comments/components/CommentBox";
import type { Task } from "@/features/tasks/type/taskType";

export default function TaskDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTask(){
            try{
                setIsLoading(true);
                setError("");
                const data = await getTaskById(params.id);
                setTask(data);
            }catch(error){
                console.error("Failed to load task:", error);
                setError("Unable to load this task. Please try again.");
            }finally{
                setIsLoading(false);
            }
        }

        loadTask();
    }, [params.id]);

    if(isLoading){
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8">
                <p className="text-slate-600">Loading task...</p>
            </div>
        );
    }

    if(error || !task){
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-8">
                <p className="text-red-600">
                    {error || "Task not found."}
                </p>

                <button type="button" onClick={() => router.push("/board")}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
                >
                    Back to Board
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <TaskDetails
                    task={task}
                    onUpdate={(updatedTask) => setTask(updatedTask)}
                    onClose={() => router.push("/board")}
                />

                <CommentBox taskId={task.id}/>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">  
                    <div className="mt-1 border-b border-slate-200">
                        <CommentList taskId={task.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
