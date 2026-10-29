"use client";
import {DndContext, DragOverlay, type DragEndEvent, type DragStartEvent} from "@dnd-kit/core";
import {SortableContext, horizontalListSortingStrategy} from "@dnd-kit/sortable";
import { useState } from "react";
import {Eye, ChevronDown} from "lucide-react";
import SortableTaskColumn from "./SortableTaskColumn";
import type { Task, TaskColumn} from "@/features/tasks/type/taskType";

interface TaskColumnsProps {
    tasks: Task[];
    columns: TaskColumn[];
    onDragEnd: (event: DragEndEvent) => void;
    onColumnDragEnd: ( activeId: string, overId: string) => void | Promise<boolean>;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const getColumnDragId = (id: string | number) => `column-${id}`; // If a task and column have the same ID, this prefix keeps their IDs unique.

// Drag and drop of cards and columns.
export default function TaskColumns({ tasks, columns, onDragEnd, onColumnDragEnd, onEdit, onDelete}: TaskColumnsProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

    function toggleColumnVisibility(columnId: string) {
        setHiddenColumns((current) =>
            current.includes(columnId) // If the column is already hidden.
                ? current.filter((id) => id !== columnId) // Remove it from the hidden list.
                : [...current, columnId] // Add it to the hidden list.
        );
    }

    const visibleColumns = sortedColumns.filter((column) => !hiddenColumns.includes(String(column.id)));
    function handleDragStart(event: DragStartEvent) {
        // Only task cards should appear in the drag overlay.
        if (event.active.data.current?.type === "column") {
            // This metadata identifies a dragged column.
            setActiveTask(null);
            return;
        }

        const task = tasks.find((item) => String(item.id) === String(event.active.id));
        setActiveTask(task ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        // Handle column reordering.
        if(active.data.current?.type === "column"){
            const activeColumnId = String(active.data.current.columnId);
            const overColumnId = over.data.current?.columnId;
            if(overColumnId !== undefined){
                onColumnDragEnd( activeColumnId, String(overColumnId));
            }
            return;
        }

        // Handle a task dropped on a column.
        const overColumnId = over.data.current?.columnId;
        if(overColumnId !== undefined && over.data.current?.type !== "priority-group"){
            onDragEnd({ ...event, over: {
                ...over,
                id: String(overColumnId), // Change over.id from column-in_progress to in_progress.
            }});
            return;
        }
        onDragEnd(event);
    }

    function handleDragCancel() {
        setActiveTask(null);
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            {/* Restore Hidden Columns */}
            {hiddenColumns.length > 0 && (
                <div className="relative mb-3 inline-block text-left">
                    <button type="button" onClick={() => setIsDropdownOpen((current) => !current)}
                        className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-third-dark-text dark:hover:bg-slate-800"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Hidden Columns</span>
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-secondary-dark-text">
                            {hiddenColumns.length}
                        </span>

                        <ChevronDown className={`h-4 w-4 transition-transform ${ isDropdownOpen ? "rotate-180" : "" }`}/>
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}/>
                            <div className="absolute left-0 z-20 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                                <div className="py-1">
                                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-secondary-dark-text">
                                        Select column to restore
                                    </div>

                                    {sortedColumns.filter((column) => hiddenColumns.includes(String(column.id)))
                                        .map((column) => (
                                            <button key={column.id} type="button"
                                                onClick={() => {toggleColumnVisibility(String(column.id));
                                                    if(hiddenColumns.length === 1){
                                                        setIsDropdownOpen(false);
                                                    }
                                                }}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-third-dark-text dark:hover:bg-slate-800"
                                            >
                                                {column.title}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Sortable Columns */}
            <SortableContext items={sortedColumns.map((column) => getColumnDragId(column.id))}
                strategy={horizontalListSortingStrategy}
            >
                <div className="flex items-start gap-3 overflow-x-auto pb-4">
                    {visibleColumns.map((column) => (
                        <SortableTaskColumn key={column.id} column={column}
                            tasks={tasks} onEdit={onEdit}
                            onDelete={onDelete} onToggleVisibility={toggleColumnVisibility}/>
                    ))}
                </div>
            </SortableContext>

            {/* Task Drag Overlay */}
            <DragOverlay>
                {activeTask ? (
                    <div className="rounded-md border border-blue-300 bg-white p-4 opacity-90 shadow-xl dark:border-slate-500 dark:bg-slate-700">
                        <p className="font-semibold text-secondary-text dark:text-white">
                            {activeTask.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-third-dark-text">
                            Description:{" "}
                            {activeTask.description || "No description"}
                        </p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}