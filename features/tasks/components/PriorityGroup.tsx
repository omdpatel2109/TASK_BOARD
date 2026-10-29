"use client";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { ChevronDown, ChevronUp } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task, TaskPriority} from "@/features/tasks/type/taskType";

interface PriorityGroupProps {
    columnId: string;
    priority: TaskPriority;
    label: string;
    dot: string;
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export default function PriorityGroup({columnId, priority, label, dot, tasks, onEdit, onDelete}: PriorityGroupProps) {
    // High priority is expanded initially.
    const [isOpen, setIsOpen] = useState(priority === "high");
    const { setNodeRef, isOver } = useDroppable({// Make priority group a droppable target (a task can be dropped here).
        id: `priority-${columnId}-${priority}`, // Unique ID of the group that accepts dropped task cards.
        data: {
            // Metadata describing the drop target.
            type: "priority-group",
            columnId,
            priority,
        },
    });

    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
    return (
        <section ref={setNodeRef} className={`rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900 ${isOver ? "ring-2 ring-blue-400 dark:ring-blue-500" : ""}`}>
            {/* Priority Group Header */}
            <button type="button" onClick={() => setIsOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-800">
                <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                    <span className="truncate text-sm font-semibold text-gray-700 dark:text-third-dark-text">
                        {label}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-third-dark-text">
                        {tasks.length}
                    </span>
                </div>

                {isOpen ? ( <ChevronUp className="h-4 w-4 shrink-0 text-gray-500" />) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />)}
            </button>

            {/* Collapsible Task Cards */}
            {isOpen && (
                <div className="px-1 pb-2">
                    {/* SortableContext tells dnd-kit which items belong to this sortable task list and manages their sorting order. tems contain on which the sortable is applying*/}
                    <SortableContext items={sortedTasks.map((task) => String(task.id))}
                        strategy={verticalListSortingStrategy}>
                        <div className="flex min-h-3 flex-col gap-3">
                            {sortedTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete}/>
                            ))}
                        </div>
                    </SortableContext>

                    {tasks.length === 0 && (
                        <p className="px-3 py-2 text-xs text-gray-400 dark:text-secondary-dark-text">
                            No tasks in this group
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}