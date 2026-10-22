"use client";
import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask} from "@/api/task";
import type { Task, TaskColumn } from "@/features/tasks/type/taskType";
import { getApiErrorMessage } from "@/lib/api";
import { getColumns, newColumn } from "@/api/column";
import { type DragEndEvent} from "@dnd-kit/core";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [columns, setColumns] = useState<TaskColumn[]>([]);
    const [dragError, setDragError] = useState("");
    const [successMessages, setSuccessMessages] = useState("");

    const loadTasks = useCallback(async () => {
        try{
            setIsLoading(true);
            setError("");
            const data = await getTasks();
            setTasks(data);
        }catch(error){
            setError(getApiErrorMessage(error));
        }finally{
            setIsLoading(false);
        }
    }, []);

    const loadColumns = useCallback(async () => {
        try{
            const data = await getColumns();
            setColumns(data);
        }catch(error){
            setError(getApiErrorMessage(error));
        }
    }, []);

    useEffect(() => {
        loadTasks();
        loadColumns();
    }, [loadTasks, loadColumns]);

    // Add a created task or replace an updated task.
    function saveTask(savedTask: Task){
        setTasks((currentTasks) => {
            const exists = currentTasks.some(
                (task) => task.id === savedTask.id
            );

            if(exists){
                return currentTasks.map((task) =>
                    task.id === savedTask.id ? savedTask : task // edited task
                );
            }
            return [...currentTasks, savedTask]; //add new task
        });
        setError("");
    }

    async function removeTask(id: string): Promise<boolean>{
        try{
            setError("");
            await deleteTask(id);
            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== id)
            );
            return true;
        }catch(error){
            setError(getApiErrorMessage(error));
            return false;
        }
    }

    // const todoTasks = tasks
    //     .filter((task) => task.status === "todo")
    //     .sort((a, b) => a.order - b.order);

    // const inProgressTasks = tasks
    //     .filter((task) => task.status === "in_progress")
    //     .sort((a, b) => a.order - b.order);

    // const doneTasks = tasks
    //     .filter((task) => task.status === "done")
    //     .sort((a, b) => a.order - b.order);

    const tasksByColumn = columns.reduce<Record<string, Task[]>>((result, column) => {
        result[column.id] = tasks
            .filter((task) => String(task.status) === String(column.id))
            .sort((a, b) => a.order - b.order);
        return result;
        },{}
    );

    async function addColumn(title: string): Promise<boolean> {
        try{
            setError("");
            const trimmedTitle = title.trim();
            if(columns.some((column) =>
                    column.title.trim().toLowerCase() === trimmedTitle.toLowerCase())
            ){
                setError("A column with this title already exists.");
                return false;
            }
            const createdColumn = await newColumn({
                title: trimmedTitle,
                order: columns.reduce(
                    (maxOrder, column) => Math.max(maxOrder, column.order),-1)+1,
            });

            setColumns((currentColumns) =>
                [...currentColumns, createdColumn].sort(
                    (a, b) => a.order - b.order
                )
            );
            return true;
        }catch(error){
            setError(getApiErrorMessage(error));
            return false;
        }
    }

    // async function handleDragEnd(event: DragEndEvent){
    //         const { active, over } = event;
    //         if (!over) return;
    //         const taskId = String(active.id);
    //         const newStatus = String(over.id);
    //         // Only allow dropping onto an existing column.
    //         if (!columns.some((column) => String(column.id) === newStatus)) {
    //             return;
    //         }
    //         const task = tasks.find(
    //             (currentTask) => String(currentTask.id) === taskId
    //         );
    //         if (!task || task.status === newStatus) return;
    //         const previousTask = task;
    //         const nextOrder = tasks
    //                 .filter((item) => item.status === newStatus)
    //                 .reduce((maxOrder, item) => Math.max(maxOrder, item.order),-1) + 1;
    
    //         const updatedTask: Task = {...task,
    //             status: newStatus,
    //             order: nextOrder,
    //         };
    
    //         setDragError("");
    //         saveTask(updatedTask);
    
    //         try{
    //             const savedTask = await updateTask(task.id, {
    //                 title: updatedTask.title,
    //                 description: updatedTask.description,
    //                 status: updatedTask.status,
    //                 order: updatedTask.order,
    //             });
    //             saveTask(savedTask);
    //             setSuccessMessages("Task status updated successfully!");
    //             return true;
    //         }catch(error){
    //             console.error("Failed to update task status:", error);
    //             saveTask(previousTask);
    //             setDragError("Unable to update task status. Please try again.");
    //             return false;
    //         }
    //     }


    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const activeId = String(active.id); //selected task id
        const overId = String(over.id); // column id(todo, in progress,...)
        const draggedTask = tasks.find((task) => String(task.id) === activeId);
        if (!draggedTask) return;

        const overTask = tasks.find((task) => String(task.id) === overId);
        const targetColumn = columns.find((column) => String(column.id) === overId);
        const destinationStatus = overTask ? overTask.status : targetColumn?.id;

        if (destinationStatus === undefined) return;
        const sourceStatus = draggedTask.status;

        // Remove the dragged task from its original position.
        const sourceTasks = tasks.filter((task) =>
            String(task.status) === String(sourceStatus) &&
            String(task.id) !== activeId
        ).sort((a, b) => a.order - b.order);

        // Build the destination list without the dragged task.
        const destinationTasks = String(sourceStatus) === String(destinationStatus) ? sourceTasks : tasks.filter((task) =>
                String(task.status) === String(destinationStatus) &&
                String(task.id) !== activeId
            ).sort((a, b) => a.order - b.order);

        const movedTask: Task = {...draggedTask,status: String(destinationStatus)};
        // Dropping over a task inserts before that task.
        // Dropping over a column appends to the end.
        const targetIndex = overTask ? destinationTasks.findIndex((task) => String(task.id) === overId)
            : destinationTasks.length;

        destinationTasks.splice(targetIndex < 0 ? destinationTasks.length : targetIndex, 0, movedTask);

        const reorderedTasks = destinationTasks.map((task, index) => ({...task,order: index,}));

        const affectedTasks = String(sourceStatus) === String(destinationStatus) ? reorderedTasks : [
                ...sourceTasks.map((task, index) => ({...task, order: index,})), ...reorderedTasks,];

        const changedTasks = affectedTasks.filter((updated) => {
            const original = tasks.find((task) => String(task.id) === String(updated.id));

        return (original &&(
            original.order !== updated.order ||
            String(original.status) !== String(updated.status)));
        });

        if (changedTasks.length === 0) return;

        const previousTasks = tasks;
        // Optimistically display the new positions.
        setTasks((currentTasks) => currentTasks.map((task) => changedTasks.find((updated) => String(updated.id) === String(task.id)) ?? task)
        );

        setDragError("");
        setSuccessMessages("");

        try{
            await Promise.all(changedTasks.map((task) => updateTask(task.id, {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    order: task.order,
                    })
                )
            );
            setSuccessMessages("Task order updated successfully!");
        }catch(error){
            console.error("Failed to save task order:", error);
            setTasks(previousTasks);
            setDragError("Unable to save task order. Please try again.");
        }
    }

    return {tasks, tasksByColumn, 
        // todoTasks, inProgressTasks, doneTasks,
        isLoading, error, loadTasks, saveTask, removeTask, dragError,
        columns, setColumns, addColumn, handleDragEnd, successMessages
    };
}