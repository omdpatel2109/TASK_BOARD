// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import type { Task } from "@/features/tasks/type/taskType";
// import { useTasks } from "../hooks/useTasks";
// import { getPriorityStyle } from "./TaskCard";
// import { ArrowUpRight } from "lucide-react";

// interface TaskListProps {
//     tasks: Task[];
// }

// const TASKS_PER_PAGE = 5;

// export default function TaskList({ tasks }: TaskListProps) {
//     const router = useRouter();
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
//     // Keep the current page valid when filtering or deleting tasks.
//     useEffect(() => {
//         setCurrentPage((page) => Math.max(1, Math.min(page, totalPages || 1)));
//     }, [totalPages]);
//     const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
//     const paginatedTasks = tasks.slice(startIndex, startIndex + TASKS_PER_PAGE);
//     const { columns } = useTasks();
//     const getStatusLabel = (status: string) => {
//         const column = columns.find((column) => String(column.id) === String(status));
//         return column?.title ?? "Unknown Status";
//     };

//     return (
//         <div className="mt-4 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
//             {/* Header */}
//             <div className="flex items-center border-b border-slate-200 px-5 py-4 dark:border-slate-700">
//                 <div>
//                     <h2 className="font-semibold text-primary-text dark:text-slate-100">
//                         All Tasks
//                     </h2>
//                     <p className="mt-1 text-sm text-secondary-text dark:text-slate-400">
//                         View and manage your tasks.
//                     </p>
//                 </div>
//             </div>

//             {tasks.length === 0 ? (
//                 /* Empty state */
//                 <div className="px-5 py-12 text-center">
//                     <p className="text-lg font-medium text-primary-text dark:text-third-dark-text">
//                         No tasks found
//                     </p>
//                     <p className="mt-1 text-md text-secondary-text dark:text-secondary-dark-text">
//                         Try changing your search or status filter.
//                     </p>
//                 </div>
//             ) : (
//                 <>
//                     {/* Column headings */}
//                     <div className="grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-3 text-md text-primary-text font-semibold md:grid dark:border-slate-700 dark:bg-slate-800/40 dark:text-secondary-dark-text">
//                         <div className="col-span-6">Task</div>
//                         <div className="col-span-2">Priority</div>
//                         <div className="col-span-2">Status</div>
//                         <div className="col-span-2 text-center ">Action</div>
//                     </div>

//                     {/* Task rows */}
//                     <div className="divide-y divide-slate-100 dark:divide-slate-800">
//                         {paginatedTasks.map((task) => (
//                             <div key={task.id} className="grid grid-cols-1 gap-3 px-5 py-4 hover:bg-slate-50 sm:grid-cols-2 md:grid-cols-12 md:items-center md:gap-4 dark:hover:bg-slate-800/30">
//                                 {/* Task details */}
//                                 <div className="min-w-0 sm:col-span-2 md:col-span-6">
//                                     <h3 className="text-md font-semibold text-primary-text dark:text-primary-dark-text">
//                                         {task.title}
//                                         </h3>
//                                     <p className="mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
//                                         {task.description || "No description provided."}
//                                     </p>
//                                 </div>

//                                 {/* Priority */}
//                                 <div className=" md:col-span-2">
//                                     <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${getPriorityStyle(task.priority)}`}>
//                                         {task.priority || "Not set"}
//                                     </span>
//                                 </div>

//                                 {/* Neutral status */}
//                                 <div className=" md:col-span-2">
//                                     <span className="text-sm bg-slate-100 rounded-full px-3 py-1 text-slate-700 dark:bg-slate-700 dark:text-third-dark-text">
//                                         {getStatusLabel(task.status)}
//                                     </span>
//                                 </div>

//                                 {/* View details */}
//                                 <div className="flex items-center md:col-span-2 md:justify-end">
//                                     <button type="button" onClick={() => router.push(`/tasks/tasks/${task.id}`)}
//                                     className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-primary hover:text-primary-text dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-dark-text cursor-pointer">
//                                         View details
//                                         <ArrowUpRight size={15} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Pagination */}
//                     <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
//                         <p className="text-sm text-slate-500 dark:text-secondary-dark-text">
//                             Showing{" "}
//                             <span className="font-medium text-slate-700 dark:text-slate-200">
//                                     {Math.min(startIndex + TASKS_PER_PAGE,tasks.length)}{" "} of {tasks.length} tasks
//                             </span>                            
//                         </p>

//                         <div className="flex items-center gap-3">
//                             <button type="button" disabled={currentPage <= 1}
//                                 onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
//                                 className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-secondary-dark-text dark:hover:bg-slate-800 cursor-pointer">
//                                 Previous
//                             </button>

//                             <span className="whitespace-nowrap text-sm text-slate-500 dark:text-secondary-dark-text">
//                                 {currentPage} / {Math.max(totalPages, 1)}
//                             </span>

//                             <button type="button" disabled={currentPage >= totalPages}
//                                 onClick={()=>setCurrentPage((page) => Math.min(totalPages, page+1))}
//                                 className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600  hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-secondary-dark-text dark:hover:bg-slate-800 cursor-pointer">
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import type {Task, TaskColumn} from "@/features/tasks/type/taskType";
// import { getPriorityStyle } from "./TaskCard";
// import { ArrowUpRight } from "lucide-react";

// interface TaskListProps {
//     tasks: Task[];
//     columns: TaskColumn[];
// }
// const TASKS_PER_PAGE = 5;

// export default function TaskList({ tasks, columns }: TaskListProps) {
//     const router = useRouter();
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
//     useEffect(() => {
//         setCurrentPage((page) => Math.max(1, Math.min(page, totalPages || 1)));
//     }, [totalPages]);

//     const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
//     const paginatedTasks = tasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

//     const getStatusLabel = (status: string) => {
//         const column = columns.find(
//             (column) => String(column.id) === String(status)
//         );
//         return column?.title ?? "Unknown Status";
//     };

//     return (
//         <div className="mt-4 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
//             <div className="flex items-center border-b border-slate-200 px-5 py-4 dark:border-slate-700">
//                 <div>
//                     <h2 className="font-semibold text-primary-text dark:text-slate-100">
//                         All Tasks
//                     </h2>
//                     <p className="mt-1 text-sm text-secondary-text dark:text-slate-400">
//                         View and manage your tasks.
//                     </p>
//                 </div>
//             </div>

//             {tasks.length === 0 ? (
//                 <div className="px-5 py-12 text-center">
//                     <p className="text-lg font-medium text-primary-text dark:text-third-dark-text">
//                         No tasks found
//                     </p>
//                     <p className="mt-1 text-md text-secondary-text dark:text-secondary-dark-text">
//                         Try changing your search or status filter.
//                     </p>
//                 </div>
//             ) : (
//                 <>
//                     <div className="grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-3 text-md font-semibold text-primary-text md:grid dark:border-slate-700 dark:bg-slate-800/40 dark:text-secondary-dark-text">
//                         <div className="col-span-6">Task</div>
//                         <div className="col-span-2">Priority</div>
//                         <div className="col-span-2">Status</div>
//                         <div className="col-span-2 text-center">Action</div>
//                     </div>

//                     <div className="divide-y divide-slate-100 dark:divide-slate-800">
//                         {paginatedTasks.map((task) => (
//                             <div key={task.id}
//                                 className="grid grid-cols-1 gap-3 px-5 py-4 hover:bg-slate-50 sm:grid-cols-2 md:grid-cols-12 md:items-center md:gap-4 dark:hover:bg-slate-800/30">
//                                 <div className="min-w-0 sm:col-span-2 md:col-span-6">
//                                     <h3 className="text-md font-semibold text-primary-text dark:text-primary-dark-text">
//                                         {task.title}
//                                     </h3>
//                                     <p className="mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
//                                         {task.description || "No description provided."}
//                                     </p>
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${getPriorityStyle(task.priority)}`}>
//                                         {task.priority || "Not set"}
//                                     </span>
//                                 </div>

//                                 <div className="md:col-span-2">
//                                     <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-third-dark-text">
//                                         {getStatusLabel(task.status)}
//                                     </span>
//                                 </div>

//                                 <div className="flex items-center md:col-span-2 md:justify-end">
//                                     <button type="button"
//                                         onClick={() => router.push(`/tasks/tasks/${task.id}`)}
//                                         className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-primary hover:text-primary-text dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-dark-text">
//                                         View details
//                                         <ArrowUpRight size={15} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
//                         <p className="text-sm text-slate-500 dark:text-secondary-dark-text">
//                             Showing{" "}
//                             <span className="font-medium text-slate-700 dark:text-slate-200">
//                                 {Math.min(startIndex + TASKS_PER_PAGE, tasks.length)} of {tasks.length} tasks
//                             </span>
//                         </p>

//                         <div className="flex items-center gap-3">
//                             <button type="button" disabled={currentPage <= 1}
//                                 onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
//                                 className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-secondary-dark-text dark:hover:bg-slate-800">
//                                 Previous
//                             </button>

//                             <span className="whitespace-nowrap text-sm text-slate-500 dark:text-secondary-dark-text">
//                                 {currentPage} / {Math.max(totalPages, 1)}
//                             </span>

//                             <button type="button" disabled={currentPage >= totalPages}
//                                 onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
//                                 className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-secondary-dark-text dark:hover:bg-slate-800">
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }
"use client";
import TranslatedText from "@/features/translation/components/TranslatedText";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {Task, TaskColumn} from "@/features/tasks/type/taskType";
import { getPriorityStyle } from "./TaskCard";
import { ArrowUpRight } from "lucide-react";

interface TaskListProps {
    tasks: Task[];
    columns: TaskColumn[];
}
const TASKS_PER_PAGE = 5;

export default function TaskList({ tasks, columns }: TaskListProps) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
    useEffect(() => {
        setCurrentPage((page) => Math.max(1, Math.min(page, totalPages || 1)));
    }, [totalPages]);

    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    const paginatedTasks = tasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

    const getStatusLabel = (status: string) => {
        const column = columns.find(
            (column) => String(column.id) === String(status)
        );
        return column?.title ?? "Unknown Status";
    };

    return (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                <div>
                    <h2 className="font-semibold text-primary-text dark:text-slate-100">
                        All Tasks
                    </h2>
                    <p className="mt-1 text-sm text-secondary-text dark:text-slate-400">
                        View and manage your tasks.
                    </p>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="px-5 py-12 text-center">
                    <p className="text-lg font-medium text-primary-text dark:text-third-dark-text">
                        No tasks found
                    </p>
                    <p className="mt-1 text-md text-secondary-text dark:text-secondary-dark-text">
                        Try changing your search or status filter.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50/70 px-5 py-3 text-md font-semibold text-primary-text md:grid dark:border-slate-700 dark:bg-slate-800/40 dark:text-secondary-dark-text">
                        <div className="col-span-6">Task</div>
                        <div className="col-span-2">Priority</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-center">Action</div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {paginatedTasks.map((task) => (
                            <div key={task.id}
                                className="grid grid-cols-1 gap-3 px-5 py-4 hover:bg-slate-50 sm:grid-cols-2 md:grid-cols-12 md:items-center md:gap-4 dark:hover:bg-slate-800/30">
                                <div className="min-w-0 sm:col-span-2 md:col-span-6">
                                    <h3 className="text-md font-semibold text-primary-text dark:text-primary-dark-text">
                                        <TranslatedText text={task.title} sourceLanguage={task.contentLanguage || "en"} />
                                    </h3>
                                    <p className="mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
                                        <TranslatedText text={task.description || "No description provided."} sourceLanguage={task.contentLanguage || "en"} />
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${getPriorityStyle(task.priority)}`}>
                                        {task.priority || "Not set"}
                                    </span>
                                </div>

                                <div className="md:col-span-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-third-dark-text">
                                        <TranslatedText text={getStatusLabel(task.status)} sourceLanguage={columns.find((column) => String(column.id) === String(task.status))?.contentLanguage || "en"} />
                                    </span>
                                </div>

                                <div className="flex items-center md:col-span-2 md:justify-end">
                                    <button type="button"
                                        onClick={() => router.push(`/tasks/tasks/${task.id}`)}
                                        className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-primary hover:text-primary-text dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-dark-text">
                                        View details
                                        <ArrowUpRight size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-secondary-dark-text">
                            Showing{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                {Math.min(startIndex + TASKS_PER_PAGE, tasks.length)} of {tasks.length} tasks
                            </span>
                        </p>

                        <div className="flex items-center gap-3">
                            <button type="button" disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-secondary-dark-text dark:hover:bg-slate-800">
                                Previous
                            </button>

                            <span className="whitespace-nowrap text-sm text-slate-500 dark:text-secondary-dark-text">
                                {currentPage} / {Math.max(totalPages, 1)}
                            </span>

                            <button type="button" disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-secondary-dark-text dark:hover:bg-slate-800">
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
