"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DndContext, type DragEndEvent, useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";
import { ColumnForm } from "./ColumnForm";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { updateTask } from "@/api/task";
import type { Task } from "@/features/tasks/type/taskType";
import SuccessBox from "@/components/SuccessBox";
import ConfirmBox from "@/components/ConfirmBox";

interface DropZoneProps {
    id: string;
    children: React.ReactNode;
}

function DropZone({ id, children }: DropZoneProps) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={ isOver ? "rounded-md ring-2 ring-blue-400": ""}>
            {children}
        </div>
    );
}

export default function TaskBoard() {
    const {tasks, isLoading, error, loadTasks, saveTask,
        removeTask, columns, addColumn,} = useTasks();
    const [taskForm, setTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dragError, setDragError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);
    const [columnForm, setColumnForm] = useState(false);
    const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks);

    // copy the task in display task to use display task for filter
    useEffect(() => {
        setDisplayedTasks(tasks);
    }, [tasks]);
    // Prevent background scrolling while the task form is open.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        if (taskForm) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [taskForm]);

    function addTask(){
        setSelectedTask(null);
        setTaskForm(true);
    }

    function editTask(task: Task){
        setSelectedTask(task);
        setTaskForm(true);
    }

    function formClose(){
        setTaskForm(false);
        setSelectedTask(null);
    }

    function handleTaskSuccess(savedTask: Task){
        saveTask(savedTask);
        setSuccessMessage(selectedTask ? "Task updated successfully!" : "Task added successfully!");
        formClose();
    }

    function askDeleteTask(id: string){
        const task = tasks.find(
            (currentTask) => String(currentTask.id) === String(id)
        );

        if(task){
            setConfirmDeleteTask(task);
        }
    }

    async function handleConfirmDelete(){
        if (!confirmDeleteTask) return;
        setSuccessMessage("");
        const success = await removeTask(confirmDeleteTask.id);
        if (success) {
            setConfirmDeleteTask(null);
            setSuccessMessage("Task deleted successfully!");
        }
    }

    async function handleAddColumn(title: string): Promise<boolean> {
        const success = await addColumn(title);
        if(success){
            setColumnForm(false);
            setSuccessMessage("Column added successfully!");
        }
        return success;
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        const taskId = String(active.id);
        const newStatus = String(over.id);
        // Only allow dropping onto an existing column.
        if (!columns.some((column) => String(column.id) === newStatus)) {
            return;
        }
        const task = tasks.find(
            (currentTask) => String(currentTask.id) === taskId
        );
        if (!task || task.status === newStatus) return;
        const previousTask = task;
        const nextOrder = tasks
                .filter((item) => item.status === newStatus)
                .reduce((maxOrder, item) => Math.max(maxOrder, item.order),-1) + 1;

        const updatedTask: Task = {...task,
            status: newStatus,
            order: nextOrder,
        };

        setDragError("");
        setSuccessMessage("");
        saveTask(updatedTask);

        try{
            const savedTask = await updateTask(task.id, {
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                order: updatedTask.order,
            });
            saveTask(savedTask);
            setSuccessMessage("Task status changed successfully!");
        }catch(error){
            console.error("Failed to update task status:", error);
            saveTask(previousTask);
            setDragError("Unable to update task status. Please try again.");
        }
    }

    function openColumnForm(){
        setColumnForm(true);
    }

    if(isLoading){
        return (
            <div className="w-full p-6">
                <p>Loading tasks...</p>
            </div>
        );
    }
    if (error && tasks.length === 0) {
        return (
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

    return (
        <>
            {successMessage && (
                <SuccessBox message={successMessage} onClose={() => setSuccessMessage("")}/>
            )}

            {dragError && (
                <p className="mb-2 px-2 text-red-500">
                    {dragError}
                </p>
            )}

            {taskForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
                        <button type="button" onClick={formClose}
                            className="absolute right-7 top-7 rounded-full p-1 text-gray-800 transition hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <TaskForm
                            task={selectedTask ?? undefined}
                            onSuccess={handleTaskSuccess}
                            onCancel={formClose}
                        />
                    </div>
                </div>
            )}

            {confirmDeleteTask && (
                <ConfirmBox
                    message={`Are you sure you want to delete "${confirmDeleteTask.title}"?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmDeleteTask(null)}
                />
            )}

            {columnForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={() => setColumnForm(false)}
                >
                    <div className="relative w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-2xl"
                    >
                        <button type="button" onClick={() => setColumnForm(false)}
                            className="absolute right-6 top-6 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Add New Column
                        </h2>
                        <ColumnForm onAddColumn={handleAddColumn}/>
                    </div>
                </div>
            )}

            <DndContext onDragEnd={handleDragEnd}>
                <div className="w-full p-4 overflow-x-auto">                    
                    <div className="mb-6 flex items-center justify-between min-w-max">
                        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
                        <div className="flex gap-2">
                            <button 
                                onClick={openColumnForm} 
                                className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 transition"
                            >
                                + Add Column
                            </button>
                            <button 
                                onClick={addTask} 
                                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition "
                            >
                                + Add Task
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start pb-4">
                        {columns.map((column) => {
                            const columnTasks = displayedTasks
                                .filter((t) => String(t.status) === String(column.id))
                                .sort((a, b) => a.order - b.order);

                            return (
                                <div key={column.id} className="w-80 shrink-0 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-700 truncate">{column.title}</h3>
                                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                            {columnTasks.length}
                                        </span>
                                    </div>
                                    <DropZone id={String(column.id)}>
                                        <div className="flex flex-col gap-3 min-h-[500px]">
                                            {columnTasks.map((task) => (
                                                <TaskCard key={task.id} task={task} onEdit={() => editTask(task)} 
                                                    onDelete={() => askDeleteTask(String(task.id))}
                                                />
                                            ))}
                                        </div>
                                    </DropZone>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </DndContext>

        </>
    );
}