"use client";
import { useState } from "react";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import TaskList from "@/features/tasks/components/TaskList";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { TaskStatus } from "@/features/tasks/type/taskType";

export default function TaskListPage() {
    const { tasks, isLoading, error } = useTasks();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"all" | TaskStatus>("all");

    const filteredTasks = tasks.filter((task) => {
        const searchText = search.trim().toLowerCase();

        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText);

        const matchesStatus =
            status === "all" || task.status === status;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-950">
            <Header />

            <div className="flex min-h-screen w-full">
                <SideBar />

                <div className="flex-1 p-6">
                    <TaskList tasks={tasks} />
                </div>
            </div>
        </div>
    );
}