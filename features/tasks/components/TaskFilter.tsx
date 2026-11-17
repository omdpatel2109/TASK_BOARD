// import React, { useEffect } from "react";
// import { useState } from "react";
// import type { Task } from "@/features/tasks/type/taskType";
// import { useTasks } from "../hooks/useTasks";

// interface TaskFilterProps{
//     tasks: Task[];
//     onFilterChange: (filteredTasks: Task[], isFilterApplied: boolean) => void;
// }
// type StatusFilter = "all" | Task["status"];
// type PriorityFilter = "all" | Task["priority"];
// const Priority = ["low", "medium", "high"]; 

// export default function TaskFilter({tasks, onFilterChange}: TaskFilterProps){
//     const {columns} = useTasks();
//     const [search, setSearch] = useState("");
//     const [status, setStatus] = useState<StatusFilter>("all");
//     const [priority, setPriority] = useState<PriorityFilter>("all");
//     const filteredTasks = tasks.filter((task) => {
//         const searchedTask = search.trim().toLowerCase();
//         const matchesSearch = task.title.toLowerCase().includes(searchedTask);
//         const matchesStatus = status === "all" || task.status === status;
//         const matchesPriority = priority === "all" || task.priority === priority;
//         return matchesSearch && matchesStatus && matchesPriority;
//     });

//     useEffect(() => {
//         const isFilterApplied =
//             search.trim() !== "" ||
//             status !== "all" ||
//             priority !== "all";

//         onFilterChange(filteredTasks, isFilterApplied);
//     }, [search, status, priority, tasks, onFilterChange]);

//     return(
//         <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-center">
//             <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search tasks..."
//                 className="min-w-0 w-[400px] flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-primary-text outline-none placeholder-gray-500 focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-primary-dark-text"
//             />

//             <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}
//                 className="h-[50px] w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-500 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-secondary-dark-text sm:w-40">
//                 <option value="all">All Statuses</option>
//                 {columns.map((column) => (
//                     <option key={column.id} value={column.id}>
//                         {column.title}
//                     </option>
//                 ))}
//             </select>

//             <select value={priority} onChange={(event) => setPriority(event.target.value as PriorityFilter)}
//                 className="h-[50px] w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-500 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-secondary-dark-text sm:w-40"
//             >
//                 <option value="all">All Priorities</option>
//                 {Priority.map((priority) => (
//                     <option key={priority} value={priority}>
//                         {priority.charAt(0).toUpperCase() + priority.slice(1)}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     )
// }   

"use client";
import { useEffect, useState } from "react";
import type {Task, TaskColumn, TaskPriority} from "@/features/tasks/type/taskType";

interface TaskFilterProps {
    tasks: Task[];
    columns: TaskColumn[];
    onFilterChange: (filteredTasks: Task[], isFilterApplied: boolean) => void;
}

type StatusFilter = "all" | string;
type PriorityFilter = "all" | TaskPriority;
const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export default function TaskFilter({tasks, columns, onFilterChange}: TaskFilterProps){
    const [search, setSearch] = useState("");
    const [text, setText] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [priority, setPriority] = useState<PriorityFilter>("all");

    useEffect(() => {
        const searchedTask = search.trim().toLowerCase();
        const filteredTasks = tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchedTask);
            const matchesStatus = status === "all" || task.status === status;
            const matchesPriority = priority === "all" || task.priority === priority;
            return (
                matchesSearch && matchesStatus && matchesPriority
            );
        });

        const isFilterApplied = search.trim() !== "" || status !== "all" || priority !== "all";

        onFilterChange(filteredTasks, isFilterApplied);
    }, [search, status, priority, tasks, onFilterChange]);


    return (
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-center">
            <input type="search" value={text}
                onChange={(event) => {
                    setText(event.target.value)
                    if(event.target.value === ""){
                        setSearch("");
                    }
                }}
                onKeyDown={(event) => {
                    if(event.key === "Enter"){
                        setSearch(text);
                    }
                }}
                placeholder="Search tasks..."
                className="min-w-0 w-full flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-primary-text outline-none placeholder-gray-500 focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-primary-dark-text sm:max-w-[280px]"/>

            <select value={status} onChange={(event) => setStatus(event.target.value)}
                className="h-[50px] w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-500 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-secondary-dark-text sm:w-40">
                <option value="all">All Statuses</option>

                {columns.map((column) => (
                    <option key={column.id} value={column.id}>
                        {column.title}
                    </option>
                ))}
            </select>

            <select value={priority} onChange={(event) =>
                    setPriority(event.target.value as PriorityFilter)
                } className="h-[50px] w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-500 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-secondary-dark-text sm:w-40">
                <option value="all">All Priorities</option>

                {PRIORITIES.map((item) => (
                    <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                ))}
            </select>

            <button type="button" onClick={() => {
                setSearch("");
                setText("");
                setStatus("all");
                setPriority("all");
            }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400">
                Clear Filter
            </button>
        </div>
    );
}
