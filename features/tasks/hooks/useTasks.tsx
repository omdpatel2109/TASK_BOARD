"use client";
import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTask } from "@/api/task";
import type { Task } from "@/features/tasks/type/taskType";
import { getApiErrorMessage } from "@/lib/api";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    

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

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    // Add a created task or replace an updated task.
    function saveTask(savedTask: Task){
        setTasks((currentTasks) => {
            const exists = currentTasks.some(
                (task) => task.id === savedTask.id
            );

            if(exists){
                return currentTasks.map((task) =>
                    task.id === savedTask.id ? savedTask : task
                );
            }
            return [...currentTasks, savedTask];
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

    return {
        tasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        isLoading,
        error,
        loadTasks,
        saveTask,
        removeTask,
    };
}
