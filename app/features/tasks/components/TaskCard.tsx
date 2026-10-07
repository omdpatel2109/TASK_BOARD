"use client"
import React, { useEffect, useState } from "react";
import type {Task} from "@/app/features/tasks/type/taskType";
import { getTasks } from "@/api/task";

export default function TaskCard(){

    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        async function loadTask() {
            try {
                const taskData: Task[] | any = await getTasks();
                setTask(taskData);
            } catch (error) {
                console.error("Failed to load tasks", error);
                setTask(null);
            }
        }
        loadTask();
    }, []);

    
    return(
        <div className="border border-blue-400 border-2 text-lg ml-4 mr-4 mt-4 mb-4
        rounded-md text-left bg-gray-100 hover:bg-gray-200 shadow-lg shadow-blue-400 transition duration-400 hover:-translate-y-2">
            <div className="grid grid-cols-1 flex items-left p-4">
                
                <h2 className="mb-2 text-lg font-bold text-blue-500">
                    Title: {task?.title}
                </h2>

                <p className=" text-lg font-bold text-blue-500">
                    Desc: {task?.description}
                </p>
                
            </div>
        </div>
    )
}

// "use client";

// import { useState } from "react";

// import type { Task } from "@/app/features/tasks/type/taskType";

// interface TaskCardProps {
//     task: Task;
//     onEdit: (task: Task) => void;
//     onDelete: (id: string) => void;
// }

// export default function TaskCard({
//     task,
//     onEdit,
//     onDelete
// }: TaskCardProps) {
//     const [isDeleting, setIsDeleting] = useState(false);

//     async function handleDelete() {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this task?"
//         );

//         if (!confirmed) {
//             return;
//         }

//         try {
//             setIsDeleting(true);

//             await onDelete(task.id);
//         } finally {
//             setIsDeleting(false);
//         }
//     }

//     return (
//         <div className="rounded-lg border bg-white p-4 shadow-sm">
//             <div className="mb-3">
//                 <h3 className="text-lg font-semibold">
//                     {task.title}
//                 </h3>

//                 <p className="mt-1 text-sm text-gray-600">
//                     {task.description}
//                 </p>
//             </div>

//             <div className="mb-3 text-sm text-gray-500">
//                 Status: {task.status}
//             </div>

//             <div className="flex gap-2">
//                 <button
//                     type="button"
//                     onClick={() => onEdit(task)}
//                     className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
//                 >
//                     Edit
//                 </button>

//                 <button
//                     type="button"
//                     onClick={handleDelete}
//                     disabled={isDeleting}
//                     className="rounded bg-red-500 px-3 py-1 text-sm text-white disabled:opacity-50"
//                 >
//                     {isDeleting ? "Deleting..." : "Delete"}
//                 </button>
//             </div>
//         </div>
//     );
// }