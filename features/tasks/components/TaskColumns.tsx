"use client";
import {DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, useDroppable} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, useSortable,} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task, TaskColumn } from "@/features/tasks/type/taskType";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

interface TaskColumnsProps {
    tasks: Task[];
    columns: TaskColumn[];
    onDragEnd: (event: DragEndEvent) => void;
    onColumnDragEnd: ( activeId: string,
    overId: string) => void | Promise<boolean>;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

// Separate IDs for sortable columns and task drop zones.
const getColumnDragId = (id: string | number) => `column-${id}`;

function DropZone({id, children}: {id: string; children: React.ReactNode}){
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`min-h-[500px] rounded-md ${ isOver ? "bg-blue-50 ring-2 ring-blue-400 dark:bg-slate-700" : "" }`}>
            {children}
        </div>
    );
}

interface SortableTaskColumnProps {
    column: TaskColumn;
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleVisibility: (columnId: string) => void;
}

function SortableTaskColumn({ column, tasks, onEdit, onDelete, onToggleVisibility}: SortableTaskColumnProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({
        id: getColumnDragId(column.id),
        data: {
            type: "column",
            columnId: String(column.id),
        },
    });

    const columnTasks = tasks.filter(
            (task) => String(task.status) === String(column.id)
        ).sort((a, b) => a.order - b.order);

    return (
        <div ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                position: "relative",
            }}
            className="w-80 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800"
        >
            <div className="mb-3 mt-1 mx-3 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">    
                    <h3 className="truncate font-semibold text-gray-700 dark:text-white">
                        {column.title}
                    </h3>
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-slate-700 dark:text-slate-200">
                        {columnTasks.length}
                    </span>
                </div> 

                {/* button to hide the column in column */}
                <div className="flex item-center justify-between gap-2">
                    {columnTasks.length === 0 && (
                        <button type="button" onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => onToggleVisibility(String(column.id))}
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-slate-700 dark:hover:text-white"
                        >
                            <EyeOff className="h-4 w-4" />
                        </button>
                    )} 
                
                    <button type="button" {...attributes} {...listeners} 
                    className="touch-none cursor-grab rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 active:cursor-grabbing dark:hover:bg-slate-700 dark:hover:text-white">
                        <GripVertical className="h-5 w-5" />
                    </button>  
                </div>            
            </div>

            <DropZone id={String(column.id)}>
                <SortableContext items={columnTasks.map((task) => String(task.id))}
                    strategy={verticalListSortingStrategy}>
                    <div className="flex min-h-[500px] flex-col gap-3 py-1">
                        {columnTasks.length === 0 && (
                            <p className="px-3 py-2 text-sm text-gray-400">
                                No tasks yet
                            </p>
                        )}

                        {columnTasks.map((task) => (
                            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete}/>
                        ))}
                    </div>
                </SortableContext>
            </DropZone>
        </div>
    );
}


export default function TaskColumns({tasks, columns, onDragEnd, onColumnDragEnd, onEdit, onDelete}: TaskColumnsProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 
    function toggleColumnVisibility(columnId: string) {
        setHiddenColumns((current) =>
            current.includes(columnId)
                ? current.filter((id) => id !== columnId)
                : [...current, columnId]
        );
    }
    const visibleColumns = sortedColumns.filter(
        (column) => !hiddenColumns.includes(String(column.id))
    );

    function handleDragStart(event: DragStartEvent) {
        // if(event.active.data.current?.type === "column"){
        //     setActiveTask(null);
        //     return;
        // }

        const task = tasks.find(
            (item) => String(item.id) === String(event.active.id)
        );

        setActiveTask(task ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveTask(null);
        const { active, over } = event;
        if(!over) return;
        // Handle whole-column reordering separately.
        if(active.data.current?.type === "column"){
            const activeColumnId = String(
                active.data.current.columnId
            );

            const overColumnId = over.data.current?.columnId;

            if(overColumnId !== undefined){
                onColumnDragEnd(activeColumnId, String(overColumnId));
            }
            return;
        }
        const overColumnId = over.data.current?.columnId;

        if(overColumnId !== undefined){
            onDragEnd({...event, over: {
                    ...over,
                    id: String(overColumnId),
                },
            });
            return;
        }
        onDragEnd(event);
    }
    function handleDragCancel() {
        setActiveTask(null);
    }
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}>
            {/* button for showing the hidden columns and selected column reappear in the task columns */}
            {hiddenColumns.length > 0 && (
                <div className="relative mb-3 inline-block text-left">
                    {/* Dropdown Trigger Button */}
                    <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Hidden Columns</span>
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                            {hiddenColumns.length}
                        </span>
                        <ChevronDown className={`h-4 w-4 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu / Popup */}
                    {isDropdownOpen && (
                        <>
                            {/* Backdrop overlay to close dropdown when clicking outside */}
                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                            <div className="absolute left-0 mt-2 z-20 w-56  rounded-md border border-gray-200 bg-white shadow-lg ring-opacity-5 focus:outline-none dark:border-slate-700 dark:bg-slate-900">
                                <div className="py-1">
                                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500">
                                        Select column to restore
                                    </div>
                                    {sortedColumns.filter((column) => hiddenColumns.includes(String(column.id)))
                                        .map((column) => (
                                            <button key={column.id} type="button"
                                                onClick={() => {
                                                    toggleColumnVisibility(String(column.id));
                                                    // Optional: close dropdown if it was the last hidden column
                                                    if(hiddenColumns.length === 1){
                                                        setIsDropdownOpen(false);
                                                    }
                                                }}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
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

            <SortableContext items={sortedColumns.map((column) =>
                    getColumnDragId(column.id)
                )}
                strategy={horizontalListSortingStrategy}>
                <div className="flex items-start gap-3 overflow-x-auto pb-4">
                    {visibleColumns.map((column) => (
                        <SortableTaskColumn key={column.id}
                            column={column} tasks={tasks}
                            onEdit={onEdit} onDelete={onDelete}
                            onToggleVisibility={toggleColumnVisibility}
                        />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeTask ? (
                    <div className="rounded-md border border-blue-300 bg-white p-4 opacity-90 shadow-xl dark:border-slate-500 dark:bg-slate-700">
                        <p className="font-semibold text-secondary-text dark:text-white">
                            {activeTask.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-slate-300">
                            Description: {activeTask.description || "No description"}
                        </p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}