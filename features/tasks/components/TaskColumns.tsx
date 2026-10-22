"use client";
import {DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCorners,type DragEndEvent, type DragStartEvent, useDroppable,} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "@/features/tasks/type/taskType";
import { GripVertical } from "lucide-react";

interface TaskColumn { id: string | number; title: string}
interface TaskColumnsProps {
    tasks: Task[];
    columns: TaskColumn[];
    onDragEnd: (event: DragEndEvent) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}
function DropZone({id, children}: {id: string; children: React.ReactNode;}){
    const { setNodeRef, isOver } = useDroppable({ id });
    return(
        <div ref={setNodeRef} className={`min-h-[500px] rounded-md ${isOver ? "bg-blue-50 ring-2 ring-blue-400 dark:bg-slate-700" : "" }`}>
            {children}
        </div>
    );
}

export default function TaskColumns({ tasks, columns, onDragEnd, onEdit, onDelete}: TaskColumnsProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const task = tasks.find((item) => String(item.id) === String(event.active.id));
        setActiveTask(task ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveTask(null);
        onDragEnd(event);
    }
    function handleDragCancel() {
        setActiveTask(null);
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart}onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            <div className="flex items-start gap-3 overflow-x-auto pb-4">
                {columns.slice().sort((a, b) => {
                        const originalA = columns.find(
                            (item) => String(item.id) === String(a.id)
                        );
                        const originalB = columns.find(
                            (item) => String(item.id) === String(b.id)
                        );
                        return(
                            (originalA as TaskColumn & { order?: number })?.order ?? 0) - (
                            (originalB as TaskColumn & { order?: number })?.order ?? 0);
                    }).map((column) => {
                        const columnTasks = tasks.filter((task) =>
                                String(task.status) === String(column.id)
                            )
                            .sort((a, b) => a.order - b.order);

                        return (
                            <div key={column.id} className="w-80 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="mb-3 mt-1 mx-3 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-700 dark:text-white">
                                        {column.title}
                                    </h3>
                                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-slate-700 dark:text-slate-200">
                                        {columnTasks.length}
                                    </span>
                                </div>

                                {columnTasks.length === 0 && <p>No</p>}

                                <DropZone id={String(column.id)}>
                                    <SortableContext items={columnTasks.map((task) => String(task.id))}
                                        strategy={verticalListSortingStrategy}>
                                        <div className="flex min-h-[500px] flex-col gap-3 py-1">
                                            {columnTasks.map((task) => (
                                                <TaskCard key={task.id} task={task}
                                                    onEdit={onEdit} onDelete={onDelete}/>
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DropZone>
                            </div>
                        );
                    })}
            </div>
            <DragOverlay>
                {activeTask ? (
                    <div className="rounded-md border border-blue-300 bg-white p-4 opacity-90 shadow-xl dark:border-slate-500 dark:bg-slate-700">
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {activeTask.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-slate-300">
                            {activeTask.description || "No description"}
                        </p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}