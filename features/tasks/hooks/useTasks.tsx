"use client";
import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask} from "@/api/task";
import type { Task, TaskColumn } from "@/features/tasks/type/taskType";
import { getApiErrorMessage } from "@/lib/api";
import { getColumns, newColumn, updateColumnOrder } from "@/api/column";
import { type DragEndEvent} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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

    const todoTasks = tasks
        .filter((task) => task.status === "todo")
        .sort((a, b) => a.order - b.order);

    const inProgressTasks = tasks
        .filter((task) => task.status === "in_progress")
        .sort((a, b) => a.order - b.order);

    const doneTasks = tasks
        .filter((task) => task.status === "done")
        .sort((a, b) => a.order - b.order);

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

    async function handleColumnDragEnd(
        activeId: string,
        overId: string
    ): Promise<boolean> {
        if (activeId === overId) return true;

        const previousColumns = [...columns].sort(
            (a, b) => a.order - b.order
        );

        const oldIndex = previousColumns.findIndex(
            (column) => String(column.id) === activeId
        );

        const newIndex = previousColumns.findIndex(
            (column) => String(column.id) === overId
        );

        if (oldIndex === -1 || newIndex === -1) return false;

        // Move the column locally first for a smooth UI.
        const reorderedColumns = arrayMove(
            previousColumns,
            oldIndex,
            newIndex
        ).map((column, index) => ({
            ...column,
            order: index,
        }));

        setColumns(reorderedColumns);
        setError("");

        try {
            // Persist every column's new position.
            await Promise.all(
                reorderedColumns.map((column) =>
                    updateColumnOrder(String(column.id), column.order)
                )
            );

            setSuccessMessages("Column order updated successfully!");
            return true;
        } catch (error) {
            // Restore the original order if saving fails.
            setColumns(previousColumns);
            setError(getApiErrorMessage(error));
            console.error("Failed to update column order:", error);

            return false;
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const taskId = String(active.id);
        const overId = String(over.id);
        const task = tasks.find((item) => String(item.id) === taskId);
        if (!task) return;
        // Check whether the drop target is a task or a column
        const targetTask = tasks.find((item) => String(item.id) === overId);
        const newStatus = targetTask ? targetTask.status : overId;
        
        if (!columns.some((column) => String(column.id) === String(newStatus))){
            return;
        }

        // Get tasks in the destination column, in their current order
        const destinationTasks = tasks.filter((item) => item.status === newStatus).sort((a, b) => a.order - b.order);

        let reorderedTasks: Task[];
        if (task.status === newStatus){
            // Reorder within the same column
            const oldIndex = destinationTasks.findIndex(
                (item) => String(item.id) === taskId
            );
            const newIndex = destinationTasks.findIndex(
                (item) => String(item.id) === overId
            );
            if (newIndex === -1) return;
            reorderedTasks = arrayMove(destinationTasks, oldIndex, newIndex);
        }else{
            // Move to another column
            const sourceTasks = tasks.filter((item) =>
                    item.status === task.status &&
                    String(item.id) !== taskId
                ).sort((a, b) => a.order - b.order);

            const movedTask = { ...task, status: newStatus };
            const targetIndex = targetTask ? destinationTasks.findIndex(
                    (item) => String(item.id) === overId
                ) : destinationTasks.length;

            const updatedDestination = [...destinationTasks];
            updatedDestination.splice(targetIndex < 0 ? updatedDestination.length : targetIndex, 0,movedTask);

            reorderedTasks = updatedDestination;
            // Optimistically update both source and destination columns
            const updatedTasks = [...sourceTasks.map((item, index) => ({...item,order: index,})),
                ...reorderedTasks.map((item, index) => ({...item, order: index,})),];
            setTasks((current) => current.map( (item) =>
                updatedTasks.find( (updated) => updated.id === item.id
                ) ?? item));

            try{
                await Promise.all(updatedTasks.map((item) =>
                        updateTask(item.id, {
                            title: item.title,
                            description: item.description,
                            status: item.status,
                            order: item.order,
                        })
                    )
                );
                setSuccessMessages("Task order updated successfully!");
            }catch(error){
                console.error(error);
                setDragError("Unable to update task order. Please try again.");
                await loadTasks();
            }
            return;
        }

        // Save the new order for same-column reordering
        const updatedTasks = reorderedTasks.map((item, index) => ({...item,order: index}));

        setTasks((current) =>current.map((item) =>
            updatedTasks.find((updated) => updated.id === item.id) ?? item
            )
        );

        try{
            await Promise.all(
                updatedTasks.map((item) =>
                    updateTask(item.id, {
                        title: item.title,
                        description: item.description,
                        status: item.status,
                        order: item.order,
                    })
                )
            );

            setSuccessMessages("Task order updated successfully!");
        } catch (error) {
            console.error(error);
            setDragError("Unable to update task order. Please try again.");
            await loadTasks();
        }
    }

    return {tasks, todoTasks, inProgressTasks, doneTasks, isLoading,
    error, loadTasks, saveTask, removeTask, columns, setColumns, addColumn,
    handleDragEnd, handleColumnDragEnd, successMessages,};
}