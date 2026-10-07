"use client";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import {getTasks, deleteTask} from "@/api/task";
import type {Task} from "@/features/tasks/type/taskType";

export default function TaskBoard(){
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    //load tasks
    async function loadTasks(){
        try{
            setIsLoading(true);
            setError("");
            const data = await getTasks();
            setTasks(data);
        }catch(error){
            console.error("Failed to load tasks:", error);
            setError("Unable to load tasks. Please try again.");
        }finally{
            setIsLoading(false);
        }
    }   
    //load task on every render
    useEffect(() => {
        loadTasks();
    }, []);

    //delete the task
    async function handleDelete(id: string){
        try{
            setError("");
            await deleteTask(id);
            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task.id !== id
                )
            );
        }catch(error){
            console.error("Failed to delete task:", error);
            setError("Unable to delete the task. Please try again.");
        }
    }

    //edit task
    function handleEdit(task: Task){
        console.log("Edit task:", task);
    }

    const todoTasks = tasks.filter(
        (task) => task.status === "todo"
    );

    const inProgressTasks = tasks.filter(
        (task) => task.status === "in_progress"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "done"
    );

    if(isLoading){
        return(
            <div className="w-full p-6">
                <p>Loading tasks...</p>
            </div>
        );
    }

    if(error && tasks.length === 0) {
        return(
            <div className="w-full p-6">
                <p className="mb-4 text-red-600">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={loadTasks}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return(
        <div className="w-full">
            <div className="ml-5 mr-5 mt-2 mb-2 flex h-14 justify-between rounded-md">
                <span className="m-2 px-4 py-2 text-xl font-bold text-gray-900">
                    Task Status
                </span>

                <button type="button"
                    className="m-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
                >
                    + Add Task
                </button>
            </div>

            {error && (
                <div className="mx-5 mb-3 rounded bg-red-100 p-3 text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-2 ml-5 mr-5 mb-5 md:grid-cols-3">

                {/* To Do */}
                <div className="rounded-md border-2 border-blue-300 bg-blue-50">
                    <div className="flex justify-between pl-4 pr-5 text-lg border-blue-300 bg-blue-100 border-b-2 ">
                        <span className="block w-full py-2 text-blue-700">
                            To Do
                        </span>
                        <span className="rounded-full bg-blue-200 px-4 py-1 text-xs m-2">
                            {todoTasks.length}
                        </span>
                    </div>

                    {todoTasks.map((task) => (
                        <TaskCard key={task.id} task={task}
                            onEdit={handleEdit} onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* In Progress */}
                <div className="rounded-md border-2 border-amber-300 bg-amber-50">
                    <div className="flex justify-between pl-4 pr-5 text-lg border-amber-300 bg-amber-100 border-b-2 ">
                        <span className="block w-full py-2 text-amber-700">
                            In Progress
                        </span>
                        <span className="rounded-full bg-amber-200 px-4 py-1 text-xs m-2">
                            {inProgressTasks.length}
                        </span>
                    </div>

                    {inProgressTasks.map((task) => (
                        <TaskCard key={task.id} task={task}
                            onEdit={handleEdit} onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Done */}
                <div className="rounded-md border-2 border-emerald-300 bg-emerald-50">
                    <div className="flex justify-between pl-4 pr-5 text-lg border-emerald-300 bg-emerald-100 border-b-2 ">
                        <span className="block w-full py-2 text-emerald-700">
                            Done
                        </span>
                        <span className="rounded-full bg-emerald-200 px-4 py-1 text-xs m-2">
                            {doneTasks.length}
                        </span>
                    </div>

                    {doneTasks.map((task) => (
                        <TaskCard key={task.id} task={task}
                            onEdit={handleEdit} onDelete={handleDelete}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}