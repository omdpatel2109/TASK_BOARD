"use client";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, EyeOff } from "lucide-react";
import PriorityGroup from "./PriorityGroup";
import type {Task, TaskColumn, TaskPriority} from "@/features/tasks/type/taskType";
const getColumnDragId = (id: string | number) => `column-${id}`; // If a task and column have the same ID, this prefix keeps their IDs unique.

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

// Render the columns which are present (including newly added columns) and sort the tasks in each column.
export default function SortableTaskColumn({ column, tasks, onEdit, onDelete, onToggleVisibility}: SortableTaskColumnProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        // Make the column draggable and allow reordering.
        id: getColumnDragId(column.id),
        data: {
            type: "column", // Identify that the dragged item is a column.
            columnId: String(column.id),
        },
    });

    const columnTasks = tasks.filter((task) => String(task.status) === String(column.id))
        .sort((a, b) => a.order - b.order);

    return (
        <div ref={setNodeRef} style={{
                transform: CSS.Transform.toString(transform),//converts dnd-kit's calculated movement into CSS that the browser can apply
                transition,
                opacity: isDragging ? 0.5 : 1,
                position: "relative",
            }} className="w-80 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800">
            {/* Column Header */}
            <div className="mx-3 mb-3 mt-1 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                    <h3 className="truncate font-semibold text-gray-700 dark:text-primary-dark-text">
                        {column.title}
                    </h3>

                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-slate-700 dark:text-third-dark-text">
                        {columnTasks.length}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {columnTasks.length === 0 && (
                        <button type="button" onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => onToggleVisibility(String(column.id))}
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-slate-700 dark:hover:text-primary-dark-text">
                            <EyeOff className="h-4 w-4" />
                        </button>
                    )}

                    <button type="button" {...attributes}{...listeners}
                        className="cursor-grab rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 active:cursor-grabbing dark:hover:bg-slate-700 dark:hover:text-white">
                        <GripVertical className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Column Task Area */}
            <DropZone id={String(column.id)}>
                <div className="flex min-h-[500px] flex-col gap-2 py-1">
                    {PRIORITY_GROUPS.map((group) => {
                        const priorityTasks = columnTasks.filter((task) => task.priority === group.id);

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