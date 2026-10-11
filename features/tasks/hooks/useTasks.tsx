"use client";

import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTask } from "@/api/task";
import type { Task } from "@/features/tasks/type/taskType";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to load tasks:", error);
            setError("Unable to load tasks. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    // Add a created task or replace an updated task.
    function saveTask(savedTask: Task) {
        setTasks((currentTasks) => {
            const exists = currentTasks.some(
                (task) => task.id === savedTask.id
            );

            if (exists) {
                return currentTasks.map((task) =>
                    task.id === savedTask.id ? savedTask : task
                );
            }

            return [...currentTasks, savedTask];
        });

        setError("");
    }

    async function removeTask(id: string) {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            setError("");
            await deleteTask(id);

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== id)
            );
        } catch (error) {
            console.error("Failed to delete task:", error);
            setError("Unable to delete the task. Please try again.");
        }
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
