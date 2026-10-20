"use client";
import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTask, } from "@/api/task";
import type { Task, TaskColumn } from "@/features/tasks/type/taskType";
import { getApiErrorMessage } from "@/lib/api";
import { getColumns, newColumn } from "@/api/column";
export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [columns, setColumns] = useState<TaskColumn[]>([]);

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

    return {tasks, todoTasks, inProgressTasks, doneTasks,
        isLoading, error, loadTasks, saveTask, removeTask,
        columns, setColumns, addColumn, 
    };
}
