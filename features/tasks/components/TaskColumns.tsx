"use client";
import { DndContext, type DragEndEvent, useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import type { Task } from "@/features/tasks/type/taskType";

interface TaskColumn {
    id: string | number;
    title: string;
}

interface TaskColumnsProps {
    tasks: Task[];
    columns: TaskColumn[];
    onDragEnd: (event: DragEndEvent) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

function DropZone({id, children}: {id: string, children: React.ReactNode}) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return(
        <div ref={setNodeRef} className={isOver ? "rounded-md ring-2 ring-blue-400" : ""}>
            {children}
        </div>
    );
}

export default function TaskColumns({ tasks, columns, onDragEnd, onEdit, onDelete}: TaskColumnsProps) {
    return (
        <DndContext onDragEnd={onDragEnd}>
            <div className="flex items-start gap-3 overflow-x-auto pb-4">
                {columns.map((column) => {
                    const columnTasks = tasks.filter((task) =>
                                String(task.status) === String(column.id)
                        ).sort((a, b) => a.order - b.order);

                    return (
                        <div key={column.id} className="w-80 shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-700 dark:bg-slate-800"
                        >
                            <div className="mb-3 mt-1 mx-3 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-700 dark:text-white ">
                                    {column.title}
                                </h3>
                                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {columnTasks.length}
                                </span>
                            </div>

                            <DropZone id={String(column.id)}>
                                <div className="flex min-h-[500px] flex-col gap-3">
                                    {columnTasks.map((task) => (
                                        <TaskCard key={task.id} task={task}
                                            onEdit={() => onEdit(task)}
                                            onDelete={() => onDelete(String(task.id))}
                                        />
                                    ))}
                                </div>
                            </DropZone>
                        </div>
                    );
                })}
            </div>
        </DndContext>
    );
}
