"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";
import { ColumnForm } from "./ColumnForm";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { Task } from "@/features/tasks/type/taskType";
import SuccessBox from "@/components/SuccessBox";
import ConfirmBox from "@/components/ConfirmBox";
import { LayoutGrid, List } from "lucide-react";
import TaskColumns from "./TaskColumns";
import TaskList from "./TaskList";

export default function TaskBoard() {
    const {tasks, isLoading, error, loadTasks, saveTask,
        removeTask, columns, addColumn, handleDragEnd, successMessages} = useTasks();
    const [taskForm, setTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dragError, setDragError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);
    const [columnForm, setColumnForm] = useState(false);
    const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks);
    const [view, setView] = useState<"columns" | "list">("columns");

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

    function openColumnForm(){
        setColumnForm(true);
    }

    useEffect(() => {
        if(successMessages){
            setSuccessMessage(successMessages);
        }
    }, [successMessages]);

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
                <p className="mb-4 text-error">{error}</p>
                <button type="button" onClick={loadTasks}
                    className="rounded bg-error px-4 py-2 text-white hover:bg-hover-error"
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

            {dragError && ( <p className="mb-2 px-2 text-error"> {dragError} </p>)}

            {taskForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={(e)=>e.stopPropagation()}>
                    <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={formClose}
                            className="absolute right-7 top-7 rounded-full p-1 text-gray-800 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <TaskForm
                            task={selectedTask ?? undefined}
                            columns={columns}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="relative w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
                        <button type="button" onClick={() => setColumnForm(false) }
                            className="absolute right-6 top-6 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Add New Column
                        </h2>
                        <ColumnForm onAddColumn={handleAddColumn}/>
                    </div>
                </div>
            )}

            <div className="w-full p-6 overflow-x-auto">                    
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>    
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Task Board</h1>
                        <h2 className="mb-1 mt-1 text-sm text-gray-500">Manage your all task here.</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={openColumnForm} className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-blue-50 dark:border-primary dark:text-white dark:bg-primary dark:hover:bg-slate-900"
                        >
                            + Add Column
                        </button>
                        <button onClick={addTask} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-hover-primary shadow-sm"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <div className="">
                        <TaskFilter tasks={tasks} onFilterChange={(filtered) => setDisplayedTasks(filtered)}/>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg p-1">
                        <button type="button" onClick={() => setView("columns")}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${ view === "columns" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                            <LayoutGrid className="h-4 w-4" />
                                Columns
                        </button>

                        <button type="button" onClick={() => setView("list")}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${view === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                            <List className="h-4 w-4" />
                                List
                        </button>
                    </div>
                </div>
                <p className="mb-2 text-sm flex items-start justify-end text-gray-600 dark:text-slate-400">
                    Showing {displayedTasks.length} of {tasks.length} tasks
                </p>
                {view === "columns" ? (
                    <TaskColumns tasks={displayedTasks} columns={columns}
                    onDragEnd={handleDragEnd} onEdit={editTask} onDelete={askDeleteTask}
                    />       
                ) : (
                    <TaskList tasks={displayedTasks} />
                )}
            </div>
        </>
    );
}