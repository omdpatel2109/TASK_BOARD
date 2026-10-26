import React, { useEffect } from "react";
import { useState } from "react";
import type { Task } from "@/features/tasks/type/taskType";
import { useTasks } from "../hooks/useTasks";

interface TaskFilterProps{
    tasks: Task[];
    onFilterChange: (filteredTask: Task[]) => void;
}
type StatusFilter = "all" | Task["status"];
type PriorityFilter = "all" | Task["priority"];
const Priority = ["low", "medium", "high"]; 

export default function TaskFilter({tasks, onFilterChange}: TaskFilterProps){
    const {columns} = useTasks();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [priority, setPriority] = useState<PriorityFilter>("all");
    const filteredTasks = tasks.filter((task) => {
        const searchedTask = search.trim().toLowerCase();
        const matchesSearch = task.title.toLowerCase().includes(searchedTask);
        const matchesStatus = status === "all" || task.status === status;
        const matchesPriority = priority === "all" || task.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    useEffect(() => {
        onFilterChange(filteredTasks);
    }, [search, status, priority,tasks])

    return(
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-center">
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
                className="min-w-0 w-[400px] flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-text outline-none placeholder-gray-500 focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}
                className="h-[50px] w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-500 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:w-40"
            >
                <option value="all">All Statuses</option>
                {columns.map((column) => (
                    <option key={column.id} value={column.id}>
                        {column.title}
                    </option>
                ))}
            </select>

            <select value={priority} onChange={(event) => setPriority(event.target.value as PriorityFilter)}
                className="h-[50px] w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-500 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:w-40"
            >
                <option value="all">Priority</option>
                {Priority.map((priority) => (
                    <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    )
}   