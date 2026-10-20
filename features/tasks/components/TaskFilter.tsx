import React, { useEffect } from "react";
import { useState } from "react";
import type { Task } from "@/features/tasks/type/taskType";
import { useTasks } from "../hooks/useTasks";

interface TaskFilterProps{
    tasks: Task[];
    onFilterChange: (filteredTask: Task[]) => void;
}
type StatusFilter = "all" | Task["status"];

export default function TaskFilter({tasks, onFilterChange}: TaskFilterProps){
    const {columns} = useTasks();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const filteredTasks = tasks.filter((task) => {
        const searchedTask = search.trim().toLowerCase();
        const matchesSearch =
            task.title.toLowerCase().includes(searchedTask);
        const matchesStatus = status === "all" || task.status === status;
        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        onFilterChange(filteredTasks);
    }, [search, status, tasks])

    return(
        <div className="mb-6 flex flex-col gap-4 sm:flex-row ">
            <input type="search" value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="w-[500px] rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                />
            <select value={status}  onChange={(event) =>
                    setStatus(event.target.value as StatusFilter)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                >
                <option value="all">All Statuses</option>
                {columns.map((column) => (
                    <option key={column.id} value={column.id}>
                        {column.title}
                    </option>
                ))}
            </select>
        </div>
    )
}