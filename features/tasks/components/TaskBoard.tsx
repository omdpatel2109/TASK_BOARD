"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DndContext, type DragEndEvent, useDroppable} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { updateTask } from "@/api/task";
import type { Task } from "@/features/tasks/type/taskType";

interface DropZoneProps {
    id: "todo" | "in_progress" | "done";
    children: React.ReactNode;
}
function DropZone({ id, children }: DropZoneProps) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return(
        <div
            ref={setNodeRef}
            className={ isOver ? "rounded-md ring-2 ring-blue-400" : ""}
        >
            {children}
        </div>
    );
}

export default function TaskBoard(){
    const { tasks, todoTasks, inProgressTasks, doneTasks, isLoading,
        error, loadTasks, saveTask, removeTask,
    } = useTasks();

    // Task form state
    const [taskForm, setTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dragError, setDragError] = useState("");

    // Prevent background scrolling while the form is open
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        if(taskForm){
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [taskForm]);

    // Open form for creating a new task
    function addTask(){
        setSelectedTask(null);
        setTaskForm(true);
    }

    // Open form for editing an existing task
    function editTask(task: Task){
        setSelectedTask(task);
        setTaskForm(true);
    }

    // Close task form
    function formClose(){
        setTaskForm(false);
        setSelectedTask(null);
    }

    // Called after creating or updating a task
    function handleTaskSuccess(savedTask: Task){
        saveTask(savedTask);
        formClose();
    }

    // Handle drag and drop
    async function handleDragEnd(event: DragEndEvent){
        const { active, over } = event;
        if(!over){
            return;
        }
        const taskId = String(active.id);
        const newStatus = String(over.id);

        if( newStatus !== "todo" && newStatus !== "in_progress" && newStatus !== "done"){
            return;
        }
        const task = tasks.find(
            (currentTask) => String(currentTask.id) === taskId
        );

        if(!task || task.status === newStatus){
            return;
        }

        const previousTask = task;
        const updatedTask: Task = {...task, status: newStatus,};
        setDragError("");

        // Move the task immediately in the UI
        saveTask(updatedTask);

        try{
            // Save the new status through the API
            const savedTask = await updateTask(task.id, {
                title: task.title,
                description: task.description,
                status: newStatus,
            });
            saveTask(savedTask);
        }catch(error){
            console.error("Failed to update task status:", error);

            // Restore the previous status if the request fails
            saveTask(previousTask);
            setDragError("Unable to update task status. Please try again.");
        }
    }

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
                <p className="mb-4 text-red-600">{error}</p>

                <button type="button" onClick={loadTasks}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return(
        <>
            {/* Task Form*/}
            {taskForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
                        <button type="button" onClick={formClose}
                            className="absolute right-7 top-7 rounded-full p-1 text-gray-800 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <TaskForm task={selectedTask ?? undefined}
                            onSuccess={handleTaskSuccess} onCancel={formClose}
                        />
                    </div>
                </div>
            )}

            {/* Main Dashboard and Drag Context */}
            <DndContext onDragEnd={handleDragEnd}>
                <div className="w-full">
                    <div className="mb-2 ml-5 mr-5 mt-2 flex h-14 justify-between rounded-md">
                        <span className="m-2 px-4 py-2 text-xl font-bold text-gray-900">
                            Task Status
                        </span>

                        <button type="button" onClick={addTask}
                            className="m-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            Add Task
                        </button>
                    </div>

                    {/* Task Columns */}
                    <div className="mb-5 ml-5 mr-5 grid grid-cols-1 gap-2 md:grid-cols-3">
                        {/* To Do */}
                        <DropZone id="todo">
                            <div className="rounded-md border-2 border-slate-200 bg-slate-50">
                                <div className="flex justify-between border-b-2 border-slate-200 bg-white pl-4 pr-5 text-lg">
                                    <span className="block w-full py-2 text-slate-600">
                                        To Do
                                    </span>

                                    <span className="m-2 rounded-full bg-slate-200 px-4 py-1.5 text-xs">
                                        {todoTasks.length}
                                    </span>
                                </div>

                                {todoTasks.map((task) => (
                                    <TaskCard key={task.id} task={task}
                                        onEdit={editTask} onDelete={removeTask}
                                    />
                                ))}
                            </div>
                        </DropZone>

                        {/* In Progress */}
                        <DropZone id="in_progress">
                            <div className="rounded-md border-2 border-slate-200 bg-slate-50">
                                <div className="flex justify-between border-b-2 border-slate-200 bg-white pl-4 pr-5 text-lg">
                                    <span className="block w-full py-2 text-slate-600">
                                        In Progress
                                    </span>

                                    <span className="m-2 rounded-full bg-slate-200 px-4 py-1.5 text-xs">
                                        {inProgressTasks.length}
                                    </span>
                                </div>

                                {inProgressTasks.map((task) => (
                                    <TaskCard key={task.id} task={task}
                                        onEdit={editTask} onDelete={removeTask}
                                    />
                                ))}
                            </div>
                        </DropZone>

                        {/* Done */}
                        <DropZone id="done">
                            <div className="rounded-md border-2 border-slate-200 bg-slate-50">
                                <div className="flex justify-between border-b-2 border-slate-200 bg-white pl-4 pr-5 text-lg">
                                    <span className="block w-full py-2 text-slate-600">
                                        Done
                                    </span>

                                    <span className="m-2 rounded-full bg-slate-200 px-4 py-1.5 text-xs">
                                        {doneTasks.length}
                                    </span>
                                </div>

                                {doneTasks.map((task) => (
                                    <TaskCard key={task.id} task={task}
                                        onEdit={editTask} onDelete={removeTask}
                                    />
                                ))}
                            </div>
                        </DropZone>
                    </div>

                    {/* API and drag errors */}
                    {(error || dragError) && (
                        <p className="mx-5 mb-4 text-sm text-red-600">
                            {dragError || error}
                        </p>
                    )}
                </div>
            </DndContext>
        </>
    );
}