"use client";
import {DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, useDroppable} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy,useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import {GripVertical, Eye, EyeOff, ChevronDown, ChevronRight} from "lucide-react";
import TaskCard from "./TaskCard";
import type {Task, TaskColumn, TaskPriority} from "@/features/tasks/type/taskType";

interface TaskColumnsProps {
    tasks: Task[];
    columns: TaskColumn[];
    onDragEnd: (event: DragEndEvent) => void;
    onColumnDragEnd: (activeId: string, overId: string) => void | Promise<boolean>;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const getColumnDragId = (id: string | number) => `column-${id}`;

const PRIORITY_GROUPS: {id: TaskPriority; label: string; dot: string}[] = [
    {
        id: "high",
        label: "High Priority",
        dot: "bg-red-500",
    },
    {
        id: "medium",
        label: "Medium Priority",
        dot: "bg-amber-500",
    },
    {
        id: "low",
        label: "Low Priority",
        dot: "bg-emerald-500",
    },
];

function DropZone({id, children}: { id: string; children: React.ReactNode}) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`min-h-[500px] rounded-md ${
                isOver ? "bg-blue-50 ring-2 ring-blue-400 dark:bg-slate-700" : ""}`}>
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
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: getColumnDragId(column.id),
        data: {
            type: "column",
            columnId: String(column.id),
        },
    });

    const columnTasks = tasks.filter((task) => String(task.status) === String(column.id))
        .sort((a, b) => a.order - b.order);

    return (
        <div ref={setNodeRef} style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                position: "relative",
            }}
            className="w-80 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800">
            {/* Column Header */}
            <div className="mx-3 mb-3 mt-1 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                    <h3 className="truncate font-semibold text-gray-700 dark:text-white">
                        {column.title}
                    </h3>

                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-slate-700 dark:text-slate-200">
                        {columnTasks.length}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {columnTasks.length === 0 && (
                        <button type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => onToggleVisibility(String(column.id))}
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-slate-700 dark:hover:text-white"
                        >
                            <EyeOff className="h-4 w-4" />
                        </button>
                    )}

                    <button type="button" {...attributes}{...listeners}
                        className="touch-none cursor-grab rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 active:cursor-grabbing dark:hover:bg-slate-700 dark:hover:text-white">
                        <GripVertical className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Column Task Area */}
            <DropZone id={String(column.id)}>
                <div className="flex min-h-[500px] flex-col gap-2 py-1">
                    {PRIORITY_GROUPS.map((group) => {
                        const priorityTasks = columnTasks.filter((task) =>
                            (task.priority ?? "low") === group.id
                        );

                        return (
                            <PriorityGroup key={group.id} columnId={String(column.id)}
                                priority={group.id} label={group.label} dot={group.dot}
                                tasks={priorityTasks} onEdit={onEdit} onDelete={onDelete}/>
                        );
                    })}
                </div>
            </DropZone>
        </div>
    );
}

interface PriorityGroupProps {
    columnId: string;
    priority: TaskPriority;
    label: string;
    dot: string;
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

function PriorityGroup({ columnId, priority, label, dot,tasks, onEdit, onDelete}: PriorityGroupProps) {
    // High priority is expanded initially.
    const [isOpen, setIsOpen] = useState(priority === "high");
    const { setNodeRef, isOver } = useDroppable({
        id: `priority-${columnId}-${priority}`,
        data: {
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
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800">
                <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`}/>

                    <span className="truncate text-sm font-semibold text-gray-700 dark:text-slate-200">
                        {label}
                    </span>

                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                        {tasks.length}
                    </span>
                </div>

                {isOpen ? ( <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
                )}
            </button>

            {/* Collapsible Task Cards */}
            {isOpen && (<div className="px-1 pb-2">
                    <SortableContext items={sortedTasks.map((task) =>String(task.id))}
                        strategy={verticalListSortingStrategy}>
                        <div className="flex min-h-3 flex-col gap-3">
                            {sortedTasks.map((task) => (
                                <TaskCard key={task.id} task={task}
                                    onEdit={onEdit} onDelete={onDelete}/>
                            ))}
                        </div>
                    </SortableContext>

                    {tasks.length === 0 && (
                        <p className="px-3 py-2 text-xs text-gray-400 dark:text-slate-500">
                            No tasks in this group
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}

export default function TaskColumns({ tasks, columns, onDragEnd, onColumnDragEnd, onEdit, onDelete}: TaskColumnsProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

    function toggleColumnVisibility(columnId: string) {
        setHiddenColumns((current) => current.includes(columnId)
            ? current.filter((id) => id !== columnId)
            : [...current, columnId]
        );
    }

    const visibleColumns = sortedColumns.filter((column) => !hiddenColumns.includes(String(column.id)));

    function handleDragStart(event: DragStartEvent) {
        // Only task cards should appear in the drag overlay.
        if(event.active.data.current?.type === "column"){
            setActiveTask(null);
            return;
        }

        const task = tasks.find((item) => String(item.id) === String(event.active.id));
        setActiveTask(task ?? null);
    }

    function handleDragEnd(event: DragEndEvent){
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;
        // Handle column reordering.
        if(active.data.current?.type === "column"){
            const activeColumnId = String(active.data.current.columnId);
            const overColumnId = over.data.current?.columnId;

            if(overColumnId !== undefined){
                onColumnDragEnd(activeColumnId, String(overColumnId));
            }
            return;
        }

        // Preserve the existing column drop-zone behavior.
        const overColumnId = over.data.current?.columnId;
        if( overColumnId !== undefined && over.data.current?.type !== "priority-group"){
            onDragEnd({ ...event, over: {
                ...over,
                id: String(overColumnId),
            },
            });
            return;
        }

        // Priority-group drop handling is intentionally
        // passed to the task handler for further integration.
        onDragEnd(event);
    }

    function handleDragCancel(){
        setActiveTask(null);
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}>
            {/* Restore Hidden Columns */}
            {hiddenColumns.length > 0 && (
                <div className="relative mb-3 inline-block text-left">
                    <button type="button" onClick={() =>
                        setIsDropdownOpen((current) => !current)}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Hidden Columns</span>
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                            {hiddenColumns.length}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${ isDropdownOpen ? "rotate-180" : "" }`}/>
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}/>
                            <div className="absolute left-0 z-20 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                                <div className="py-1">
                                    <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-slate-500">
                                        Select column to restore
                                    </div>
                                    {sortedColumns.filter((column) =>
                                            hiddenColumns.includes(String(column.id))
                                        )
                                        .map((column) => (
                                            <button key={column.id} type="button"
                                                onClick={() => {
                                                    toggleColumnVisibility(String(column.id));
                                                    if(hiddenColumns.length ===1){
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

            {/* Sortable Columns */}
            <SortableContext items={sortedColumns.map((column) =>
                getColumnDragId(column.id)
            )}
            strategy={horizontalListSortingStrategy}>
                <div className="flex items-start gap-3 overflow-x-auto pb-4">
                    {visibleColumns.map((column) => (
                        <SortableTaskColumn key={column.id} column={column}
                            tasks={tasks} onEdit={onEdit} onDelete={onDelete}
                            onToggleVisibility={toggleColumnVisibility}/>
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

                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-slate-300">
                            Description:{" "}
                            {activeTask.description ||
                                "No description"}
                        </p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}