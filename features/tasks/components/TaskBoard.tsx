"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import {getTasks, deleteTask} from "@/api/task";
import type { Task } from "@/features/tasks/type/taskType";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import AlertBox from "@/components/AlertBox";

export default function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Task form
    const [taskForm, setTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Load tasks
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

    // Load tasks when component mounts
    useEffect(() => {
        loadTasks();
    }, []);

    // Open form for creating a new task
    function handleAddTask(){
        setSelectedTask(null);
        setTaskForm(true);
    }

    // Open form for editing an existing task
    function handleEdit(task: Task){
        setSelectedTask(task);
        setTaskForm(true);
    }

    // Close task form
    function handleCancel(){
        setTaskForm(false);
        setSelectedTask(null);
    }

    // Called after create/update succeeds
    function handleTaskSuccess(savedTask: Task) {
        setTasks((currentTasks) => {
            // Editing task
            if (selectedTask){
                return currentTasks.map((task) => 
                    task.id === savedTask.id ? savedTask : task);
            }

            // Creating new task
            return [...currentTasks, savedTask];
        });
        setTaskForm(false);
        setSelectedTask(null);
        setError("");
    }

    // Delete task
    async function handleDelete(id: string){
        try{
            setError("");
            await deleteTask(id);
            confirm("Are you want to delte this task??");
            setTasks((currentTasks) => 
                currentTasks.filter((task) => task.id !== id));
        }catch(error){
            console.error("Failed to delete task:",error);
            setError("Unable to delete the task. Please try again.");
        }
    }

    // Filter tasks by status
    const todoTasks = tasks.filter((task) => task.status === "todo");
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
    const doneTasks = tasks.filter((task) => task.status === "done");

    // //dnd update status
    // function updateStatusDrag(taskId: string, newStatus: string){
    //     setTasks((prevTask) => 
    //         prevTask.map((task) => 
    //                 task.id === taskId ? {...task, status: newStatus as any} : task
    //         )
    //     )
    // }

    //dnd kit drop handler
    // const handleDragEnd = (event: DragEndEvent) => {
    //     const {active, over} = event;
    //     //if dont drop into valid column then do nothing
    //     if(!over) return;
    //     const taskId = active.id as string;
    //     const targetColumnId = over.id as string;
    //     updateStatusDrag(taskId, targetColumnId);
    // }

    // Loading state
    if(isLoading){
        return (
            <div className="w-full p-6">
                <p>Loading tasks...</p>
            </div>
        );
    }

    // Initial loading error
    if(error && tasks.length === 0){
        return(
            <div className="w-full p-6">
                <p className="mb-4 text-red-600">
                    {error}
                </p>
                <button type="button"onClick={loadTasks}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return(
        <>
            {/* Task Form */}
            {taskForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-30 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
                        {/* Close button */}
                        <button type="button" onClick={handleCancel}
                            className="absolute right-7 top-7 rounded-full p-1 text-gray-800 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Same form for Add + Edit */}
                        <TaskForm task={selectedTask ?? undefined}
                            onSuccess={handleTaskSuccess} onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}

            {/* Main dashBoard */}
            {/* <DndContext onDragEnd={handleDragEnd}> */}
                <div className="w-full">
                    <div className="mb-2 ml-5 mr-5 mt-2 flex h-14 justify-between rounded-md">
                        <span className="m-2 px-4 py-2 text-xl font-bold text-gray-900">
                            Task Status
                        </span>

                        <button type="button" onClick={handleAddTask}
                            className="m-2 rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
                        >
                            + Add Task
                        </button>
                    </div>

                    <div className="mb-5 ml-5 mr-5 grid grid-cols-1 gap-2 md:grid-cols-3">
                        {/* todo */}
                        <div className="rounded-md border-2 border-blue-300 bg-blue-50">
                            <div className="flex justify-between border-b-2 border-blue-300 bg-blue-100 pl-4 pr-5 text-lg">
                                <span className="block w-full py-2 text-blue-700">
                                    To Do
                                </span>
                                <span className="m-2 rounded-full bg-blue-200 px-4 py-1 text-xs">
                                    {todoTasks.length}
                                </span>
                            </div>

                            {todoTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}

                        </div>

                        {/* in progress */}
                        <div className="rounded-md border-2 border-amber-300 bg-amber-50">
                            <div className="flex justify-between border-b-2 border-amber-300 bg-amber-100 pl-4 pr-5 text-lg">
                                <span className="block w-full py-2 text-amber-700">
                                    In Progress
                                </span>
                                <span className="m-2 rounded-full bg-amber-200 px-4 py-1 text-xs">
                                    {inProgressTasks.length}
                                </span>
                            </div>

                            {inProgressTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* done */}
                        <div className="rounded-md border-2 border-emerald-300 bg-emerald-50">
                            <div className="flex justify-between border-b-2 border-emerald-300 bg-emerald-100 pl-4 pr-5 text-lg">
                                <span className="block w-full py-2 text-emerald-700">
                                    Done
                                </span>

                                <span className="m-2 rounded-full bg-emerald-200 px-4 py-1 text-xs">
                                    {doneTasks.length}
                                </span>
                            </div>
                            {doneTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            {/* </DndContext> */}
        </>
    );
}