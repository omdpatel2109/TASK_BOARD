// "use client";
// import { useState } from "react";
// import { MoreVertical, Edit2, Trash2, Eye, CalendarDays } from "lucide-react";
// import Link from "next/link";
// import type { Task } from "@/features/tasks/type/taskType";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// interface TaskCardProps {
//     task: Task;
//     onEdit: (task: Task) => void;
//     onDelete: (id: string) => void;
// }

// export function getPriorityStyle(priority?: string) {
//     switch(priority){
//         case "high":
//             return "priority-high";
//         case "medium":
//             return "priority-medium";
//         case "low":
//             return "priority-low";
//         default:
//             return "priority-default";
//     }
// }

// export function getDueDateStyle(dueDate: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const due = new Date(`${dueDate}T00:00:00`);
//     const differenceInDays = Math.round(
//         (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );

//     if(differenceInDays < 0){
//         return {
//             label: "Overdue",
//             style: "date-overdue",
//         };
//     }

//     if(differenceInDays === 0){
//         return {
//             label: "Due today",
//             style: "date-duetoday",
//         };
//     }
//     if(differenceInDays <= 3){
//         return {
//             label: "Due soon",
//             style: "date-duesoon",
//         };
//     }

//     return {
//         label: "",
//         style: "",
//     };
// }

// export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: String(task.id)}); //useSortable - inable the item to sortable and provide the properties to drag card, calculate the position

//     const style = {
//         transform: CSS.Transform.toString(transform), //Moves the task card to the position calculated by dnd-kit
//         transition, // card move smoothly when its position changes, such as when another task moves into its place
//     };

//     return (
//         <div ref={setNodeRef} style={style} {...listeners} {...attributes}
//             className={`mx-2 min-w-0 rounded-md border border-slate-200 bg-white text-left shadow-sm transition dark:border-slate-600 dark:bg-slate-700 cursor-grab ${isDragging ? "z-10 opacity-60 shadow-lg cursor-grabbing" : "hover:shadow-md"} hover:-translate-y-0.5`}
//         >
//             <div className="min-w-0 p-3 sm:p-4">
//                 <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
//                     <h2 className={`min-w-0 font-bold text-primary-text dark:text-white sm:text-lg ${task.status === "done" ? "line-through" : ""}`}>
//                         {task.title}
//                     </h2>

//                     <div className="flex items-center justify-between gap-2">
//                         {/* <div className="mb-2">
//                         <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${task.status === "done" 
//                         ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500" : getPriorityStyle(task.priority)
//                         }`}>
//                             {task.priority ?? ""}
//                         </span>
//                         </div> */}

//                         <div className="" >
//                             <div className="relative">
//                                 <button type="button" onPointerDown={(e) => e.stopPropagation()}
//                                 onClick={(e) => {
//                                         e.stopPropagation(); 
//                                         setIsMenuOpen(!isMenuOpen);
//                                     }}
//                                     className="flex h-7 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-600 cursor-pointer">
//                                     <MoreVertical className="h-5 w-5" />
//                                 </button>

//                                 {/* Dropdown Action Overlay Menu */}
//                                 {isMenuOpen && (
//                                     <div className="absolute right-0 top-full z-50 mt-1 flex w-fit items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">

//                                         {/* View Details */}
//                                         <Link href={`/tasks/tasks/${task.id}`}
//                                             onClick={(e) => {
//                                                 setIsMenuOpen(false);
//                                                 // e.stopPropagation();
//                                             }} onPointerDown={(e) => e.stopPropagation()}
//                                             className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
//                                         >
//                                             <Eye className="h-5 w-5" />
//                                         </Link>

//                                         {/* Edit */}
//                                         <button type="button" onClick={(e) => {
//                                                 setIsMenuOpen(false);
//                                                 onEdit(task);
//                                             }} onPointerDown={(e) => e.stopPropagation()}
//                                             className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
//                                         >
//                                             <Edit2 className="h-5 w-5" />
//                                         </button>

//                                         {/* Delete */}
//                                         <button type="button"
//                                             onClick={(e) => { e.stopPropagation();
//                                                 setIsMenuOpen(false);
//                                                 onDelete(String(task.id));
//                                             }} onPointerDown={(e) => e.stopPropagation()}
//                                             className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700 cursor-pointer"
//                                         >
//                                             <Trash2 className="h-5 w-5" />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Card Main Body Description Link */}
//                 <p className={`text-sm text-secondary-text dark:text-slate-400 ${task.status==="done" ? "line-through" : ""}`}>
//                     Description: {task.description || "No description"}
//                 </p>

//                 {task.dueDate && ((() => {
//                     const dueDateInfo = getDueDateStyle(task.dueDate);
//                         return (
//                             <div className="mt-3 flex flex-wrap items-center gap-2">
//                                 <div className={`flex items-center gap-1.5 text-sm  ${task.status === "done" ? "text-slate-400 dark:text-slate-500" :
//                                     "text-secondary-text dark:text-secondary-dark-text"
//                                 }`}>
//                                     <CalendarDays className="h-4 w-4 " />
//                                     <span className={task.status === "done" ? "line-through" : ""}>
//                                         {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
//                                             undefined,
//                                             {
//                                                 day: "numeric",
//                                                 month: "short",
//                                                 year: "numeric",
//                                             }
//                                         )}
//                                     </span>
//                                 </div>

//                                 {task.status!=="done" && 
//                                     <span className={`rounded-full px-2 py-1 text-xs font-medium     ${dueDateInfo.style}`}>
//                                         {dueDateInfo.label}
//                                     </span>
//                             }
//                             </div>
//                         );
//                     })()
//                 )}
//             </div>
//         </div>
//     );
// }
// "use client";
// import { useState } from "react";
// import {MoreVertical, Edit2, Trash2, Eye, CalendarDays} from "lucide-react";
// import Link from "next/link";
// import type { Task } from "@/features/tasks/type/taskType";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// interface TaskCardProps {
//     task: Task;
//     isCompleted?: boolean;
//     onEdit: (task: Task) => void;
//     onDelete: (id: string) => void;
// }

// export function getPriorityStyle(priority?: string) {
//     switch(priority){
//         case "high":
//             return "priority-high";
//         case "medium":
//             return "priority-medium";
//         case "low":
//             return "priority-low";
//         default:
//             return "priority-default";
//     }
// }

// export function getDueDateStyle(dueDate: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const due = new Date(`${dueDate}T00:00:00`);
//     const differenceInDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

//     if(differenceInDays < 0){
//         return {
//             label: "Overdue",
//             style: "date-overdue",
//         };
//     }

//     if(differenceInDays === 0){
//         return {
//             label: "Due today",
//             style: "date-duetoday",
//         };
//     }

//     if(differenceInDays <= 3){
//         return {
//             label: "Due soon",
//             style: "date-duesoon",
//         };
//     }

//     return {
//         label: "",
//         style: "",
//     };
// }

// export default function TaskCard({task, isCompleted = false, onEdit, onDelete}: TaskCardProps){
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: String(task.id)});

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//     };

//     const dueDateInfo = task.dueDate ? getDueDateStyle(task.dueDate) : null;

//     return (
//         <div ref={setNodeRef} style={style} {...listeners} {...attributes}
//             className={`mx-2 min-w-0 rounded-md border border-slate-200 bg-white text-left shadow-sm transition dark:border-slate-600 dark:bg-slate-700 cursor-grab ${
//                 isDragging ? "z-10 opacity-60 shadow-lg cursor-grabbing" : "hover:shadow-md"
//             } hover:-translate-y-0.5`}>
//             <div className="min-w-0 p-3 sm:p-4">
//                 <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
//                     <h2 className={`min-w-0 font-bold text-primary-text dark:text-white sm:text-lg ${isCompleted ? "line-through" : "" }`}>
//                         {task.title}
//                     </h2>

//                     <div className="relative">
//                         <button type="button" onPointerDown={(event)=>event.stopPropagation()}
//                             onClick={(event) => {
//                                 event.stopPropagation();
//                                 setIsMenuOpen((current) => !current);
//                             }}
//                             className="flex h-7 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-600 cursor-pointer">
//                             <MoreVertical className="h-5 w-5" />
//                         </button>

//                         {isMenuOpen && (
//                             <div
//                                 onPointerDown={(event) => event.stopPropagation()}
//                                 className="absolute right-0 top-full z-50 mt-1 flex w-fit items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
//                                 <Link href={`/tasks/tasks/${task.id}`}
//                                     onClick={() => setIsMenuOpen(false)}
//                                     className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
//                                     <Eye className="h-5 w-5" />
//                                 </Link>

//                                 <button type="button"
//                                     onClick={(event) => {
//                                         event.stopPropagation();
//                                         setIsMenuOpen(false);
//                                         onEdit(task);
//                                     }}
//                                     className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
//                                     <Edit2 className="h-5 w-5" />
//                                 </button>

//                                 <button type="button"
//                                     onClick={(event) => {
//                                         event.stopPropagation();
//                                         setIsMenuOpen(false);
//                                         onDelete(String(task.id));
//                                     }}
//                                     className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700">
//                                     <Trash2 className="h-5 w-5" />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <p className={`text-sm text-secondary-text dark:text-slate-400 ${ isCompleted ? "line-through" : ""}`}>
//                     Description: {task.description || "No description"}
//                 </p>

//                 {task.dueDate && (
//                     <div className="mt-3 flex flex-wrap items-center gap-2">
//                         <div className={`flex items-center gap-1.5 text-sm ${ isCompleted
//                             ? "text-slate-400 dark:text-slate-500" : "text-secondary-text dark:text-secondary-dark-text"}`}>
//                             <CalendarDays className="h-4 w-4" />
//                             <span className={isCompleted ? "line-through" : ""}>
//                                 {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(undefined, {
//                                     day: "numeric",
//                                     month: "short",
//                                     year: "numeric",
//                                 })}
//                             </span>
//                         </div>

//                         {!isCompleted && dueDateInfo?.label && (
//                             <span className={`rounded-full px-2 py-1 text-xs font-medium ${dueDateInfo.style}`}>
//                                 {dueDateInfo.label}
//                             </span>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
"use client";
import TranslatedText from "@/features/i18n/components/TranslatedText";
import { useState } from "react";
import {MoreVertical, Edit2, Trash2, Eye, CalendarDays} from "lucide-react";
import Link from "next/link";
import type { Task } from "@/features/tasks/type/taskType";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";
interface TaskCardProps {
    task: Task;
    isCompleted?: boolean;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export function getPriorityStyle(priority?: string) {
    switch(priority){
        case "high":
            return "priority-high";
        case "medium":
            return "priority-medium";
        case "low":
            return "priority-low";
        default:
            return "priority-default";
    }
}

export function getDueDateStyle(
    dueDate: string,
    t: (key: string) => string
) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(`${dueDate}T00:00:00`);

    const differenceInDays = Math.round(
        (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays < 0) {
        return {
            label: t("overdue"),
            style: "date-overdue",
        };
    }

    if (differenceInDays === 0) {
        return {
            label: t("duetoday"),
            style: "date-duetoday",
        };
    }

    if (differenceInDays <= 3) {
        return {
            label: t("duesoon"),
            style: "date-duesoon",
        };
    }

    return {
        label: "",
        style: "",
    };
}

export default function TaskCard({task, isCompleted = false, onEdit, onDelete}: TaskCardProps){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: String(task.id)});
    const t = useTranslations("tasks");


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const dueDateInfo = task.dueDate ? getDueDateStyle(task.dueDate, t) : null;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className={`mx-2 min-w-0 rounded-md border border-slate-200 bg-white text-left shadow-sm transition dark:border-slate-600 dark:bg-slate-700 cursor-grab ${
                isDragging ? "z-10 opacity-60 shadow-lg cursor-grabbing" : "hover:shadow-md"
            } hover:-translate-y-0.5`}>
            <div className="min-w-0 p-3 sm:p-4">
                <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                    <h2 className={`min-w-0 font-bold text-primary-text dark:text-white sm:text-lg ${isCompleted ? "line-through" : "" }`}>
                        <TranslatedText text={task.title} entityType="task" entityId={task.id} field="title" />
                    </h2>

                    <div className="relative">
                        <button type="button" onPointerDown={(event)=>event.stopPropagation()}
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsMenuOpen((current) => !current);
                            }}
                            className="flex h-7 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                            <MoreVertical className="h-5 w-5" />
                        </button>

                        {isMenuOpen && (
                            <div
                                onPointerDown={(event) => event.stopPropagation()}
                                className="absolute right-0 top-full z-50 mt-1 flex w-fit items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                                <Link href={`/tasks/tasks/${task.id}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                                    <Eye className="h-5 w-5" />
                                </Link>

                                <button type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsMenuOpen(false);
                                        onEdit(task);
                                    }}
                                    className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer">
                                    <Edit2 className="h-5 w-5 cursor-pointer"/>
                                </button>

                                <button type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setIsMenuOpen(false);
                                        onDelete(String(task.id));
                                    }}
                                    className="flex h-10 w-10 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700 cursor-pointer">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className={`text-sm text-secondary-text dark:text-slate-400 ${ isCompleted ? "line-through" : ""}`}>
                    {t("description")}: <TranslatedText text={task.description || "No description"} entityType="task" entityId={task.id} field="description" />
                </p>

                {task.dueDate && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <div className={`flex items-center gap-1.5 text-sm ${ isCompleted
                            ? "text-slate-400 dark:text-slate-500" : "text-secondary-text dark:text-secondary-dark-text"}`}>
                            <CalendarDays className="h-4 w-4" />
                            <span className={isCompleted ? "line-through" : ""}>
                                {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(undefined, {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        {!isCompleted && dueDateInfo?.label && (
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${dueDateInfo.style}`}>
                                {dueDateInfo.label}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
