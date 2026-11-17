// "use client";
// import { useCallback, useEffect, useState } from "react";
// import { X } from "lucide-react";
// import TaskForm from "./TaskForm";
// import TaskFilter from "./TaskFilter";
// import { ColumnForm } from "./ColumnForm";
// import { useTasks } from "@/features/tasks/hooks/useTasks";
// import type { Task } from "@/features/tasks/type/taskType";
// import SuccessBox from "@/components/SuccessBox";
// import ConfirmBox from "@/components/ConfirmBox";
// import { LayoutGrid, List, Plus, ChevronDown } from "lucide-react";
// import TaskColumns from "./TaskColumns";
// import TaskList from "./TaskList";

// export default function TaskBoard() {
//     const {tasks, isLoading, error, loadTasks, saveTask, removeTask,
//     columns, addColumn, handleDragEnd, handleColumnDragEnd, successMessages} = useTasks();
//     const [taskForm, setTaskForm] = useState(false);
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//     const [dragError, setDragError] = useState("");
//     const [successMessage, setSuccessMessage] = useState("");
//     const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);
//     const [columnForm, setColumnForm] = useState(false);
//     const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks);
//     const [view, setView] = useState<"columns" | "list">("columns");
//     const [openAddDropDown, setOpenAddDropDown] = useState(false);
//     const [isFilterApplied, setIsFilterApplied] = useState(false);

//     // copy the task in display task to use display task for filter
//     useEffect(() => {
//         setDisplayedTasks(tasks);
//     }, [tasks]);
//     // Prevent background scrolling while the task form is open.
//     useEffect(() => {
//         const previousOverflow = document.body.style.overflow;
//         if (taskForm) {
//             document.body.style.overflow = "hidden";
//         }
//         return () => {
//             document.body.style.overflow = previousOverflow;
//         };
//     }, [taskForm]);

//     const handleFilterChange = useCallback(
//         (filteredTasks: Task[], filterApplied: boolean) => {
//             setDisplayedTasks(filteredTasks);
//             setIsFilterApplied(filterApplied);
//         },
//         []
//     );

//     function addTask(){
//         setSelectedTask(null);
//         setTaskForm(true);
//     }

//     function editTask(task: Task){
//         setSelectedTask(task);
//         setTaskForm(true);
//     }

//     function formClose(){
//         setTaskForm(false);
//         setSelectedTask(null);
//     }

//     function handleTaskSuccess(savedTask: Task){
//         saveTask(savedTask);
//         setSuccessMessage(selectedTask ? "Task updated successfully!" : "Task added successfully!");
//         formClose();
//     }

//     function askDeleteTask(id: string){
//         const task = tasks.find(
//             (currentTask) => String(currentTask.id) === String(id)
//         );

//         if(task){
//             setConfirmDeleteTask(task);
//         }
//     }

//     async function handleConfirmDelete(){
//         if (!confirmDeleteTask) return;
//         setSuccessMessage("");
//         const success = await removeTask(confirmDeleteTask.id);
//         if(success){
//             setConfirmDeleteTask(null);
//             setSuccessMessage("Task deleted successfully!");
//         }
//     }

//     async function handleAddColumn(title: string): Promise<boolean> {
//         const success = await addColumn(title);
//         if(success){
//             setColumnForm(false);
//             setSuccessMessage("Column added successfully!");
//         }
//         return success;
//     }

//     function openColumnForm(){
//         setColumnForm(true);
//     }

//     useEffect(() => {
//         if(successMessages){
//             setSuccessMessage(successMessages);
//         }
//     }, [successMessages]);

//     if(isLoading){
//         return (
//             <div className="w-full p-6 text-primary-text">
//                 <p>Loading tasks...</p>
//             </div>
//         );
//     }
//     if(error && tasks.length === 0){
//         return (
//             <div className="w-full p-6">
//                 <p className="mb-4 text-error">{error}</p>
//                 <button type="button" onClick={loadTasks}
//                     className="rounded bg-error px-4 py-2 text-white hover:bg-hover-error">
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <>
//             {successMessage && (
//                 <SuccessBox message={successMessage} onClose={() => setSuccessMessage("")}/>
//             )}

//             {dragError && ( <p className="mb-2 px-2 text-error"> {dragError} </p>)}

//             {taskForm && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
//                     <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl dark:bg-background dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
//                         <button type="button" onClick={formClose} className="absolute right-7 top-7 rounded-full p-1 text-primary-text hover:bg-gray-100"
//                         >
//                             <X className="h-5 w-5" />
//                         </button>
//                         <TaskForm task={selectedTask ?? undefined}
//                             columns={columns}
//                             onSuccess={handleTaskSuccess}
//                             onCancel={formClose}
//                         />
//                     </div>
//                 </div>
//             )}

//             {confirmDeleteTask && (
//                 <ConfirmBox message={`Are you sure you want to delete "${confirmDeleteTask.title}"?`}
//                     onConfirm={handleConfirmDelete}
//                     onCancel={() => setConfirmDeleteTask(null)}
//                 />
//             )}

//             {columnForm && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
//                     <div className="relative w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 shadow-2xl">
//                         <button type="button" onClick={() => setColumnForm(false) }
//                             className="absolute right-6 top-6 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
//                             <X className="h-5 w-5" />
//                         </button>
//                         <h2 className="text-xl font-bold text-primary-text mb-4">
//                             Add New Column
//                         </h2>
//                         <ColumnForm onAddColumn={handleAddColumn}/>
//                     </div>
//                 </div>
//             )}

//             <div className="w-full p-6 overflow-x-auto">                    
//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
//                     <div>    
//                         <h1 className="text-3xl font-bold tracking-tight text-primary-text dark:text-primary-dark-text">Task Board</h1>
//                         <h2 className="mb-1 mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">Manage your all task here.</h2>
//                     </div>
//                     <div className="relative inline-flex items-center rounded-md shadow-sm">
//                         <button onClick={() => setOpenAddDropDown(!openAddDropDown)} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-hover-primary focus:outline-none cursor-pointer"
//                         >
//                             <Plus className="h-4 w-4" /> 
//                         </button>

//                         {openAddDropDown && (
//                             <div className="absolute right-0 top-full mt-1.5 z-50 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-slate-700 dark:bg-slate-900"
//                             >
//                                 <div className="flex flex-col ">
//                                     <button onClick={() => { addTask(); setOpenAddDropDown(false); }} 
//                                     className="w-full text-left px-3 py-2 border-b border-slate-200 text-sm font-medium text-primary-text hover:bg-slate-100 dark:text-third-dark-text dark:hover:bg-slate-800 transition-colors cursor-pointer">
//                                         New Task
//                                     </button>
//                                     <button onClick={() => { openColumnForm(); setOpenAddDropDown(false); }} className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-primary-text hover:bg-slate-100 dark:text-third-dark-text dark:hover:bg-slate-800 cursor-pointer"
//                                     >
//                                         New Column
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                         </div>

//                 </div>
//                 <div className="flex items-center justify-between mb-2">
//                     <div className="">
//                         <TaskFilter tasks={tasks} onFilterChange={handleFilterChange}/>
//                     </div>
//                     <div className="flex items-center rounded border border-slate-400 dark:border-slate-700">
//                         <button type="button" onClick={() => setView("columns")}
//                             className={`flex items-center py-1 px-2 text-sm font-medium cursor-pointer ${ view === "columns" ? "bg-slate-300 text-primary-text" : "text-secondary-text hover:bg-gray-100 dark:text-third-dark-text dark:hover:bg-slate-800"}`}>
//                             <LayoutGrid className="h-4 w-4" />
//                         </button>

//                         <button type="button" onClick={() => setView("list")}
//                             className={`flex items-center py-1 px-2 text-sm font-medium cursor-pointer ${view === "list" ? "bg-slate-300 text-primary-text" : "text-secondary-text hover:bg-gray-100 dark:text-third-dark-text dark:hover:bg-slate-800"}`}>
//                             <List className="h-4 w-4" />
//                         </button>
//                     </div>
//                 </div>
//                 { (view === "columns") && <p className="mb-2 text-sm flex items-start justify-end text-gray-600 dark:text-secondary-dark-text">
//                     Showing {displayedTasks.length} of {tasks.length} tasks
//                 </p>}
//                 {view === "columns" ? (
//                     <TaskColumns
//                         tasks={displayedTasks}
//                         columns={columns}
//                         onDragEnd={handleDragEnd}
//                         isFilterApplied={isFilterApplied}
//                         onColumnDragEnd={handleColumnDragEnd}
//                         onEdit={editTask}
//                         onDelete={askDeleteTask}
//                     />
//                 ) : (
//                     <TaskList tasks={displayedTasks} />
//                 )}
//             </div>
//         </>
//     );
// }

// "use client";
// import { useCallback, useEffect, useState } from "react";
// import { X, LayoutGrid, List, Plus } from "lucide-react";
// import { arrayMove } from "@dnd-kit/sortable";
// import TaskForm from "./TaskForm";
// import TaskFilter from "./TaskFilter";
// import TaskColumns from "./TaskColumns";
// import TaskList from "./TaskList";
// import { useTasks } from "@/features/tasks/hooks/useTasks";
// import type { Task, TaskColumn} from "@/features/tasks/type/taskType";
// import type { Workflow } from "@/features/workflows/types/workflowType";
// import SuccessBox from "@/components/SuccessBox";
// import ConfirmBox from "@/components/ConfirmBox";

// interface TaskBoardProps {
//     workflow: Workflow;
//     onWorkflowChange: (workflow: Workflow) => Promise<Workflow>;
// }

// export default function TaskBoard({workflow, onWorkflowChange}: TaskBoardProps) {

//     // Get statuses from the selected workflow.
//     const columns: TaskColumn[] = [...workflow.statuses].sort((a, b) => a.order - b.order);
//     // Fetch only tasks belonging to the selected workflow.
//     const {tasks, isLoading, error, loadTasks, saveTask, removeTask, handleDragEnd,
//         successMessages, dragError: taskDragError} = useTasks(workflow.id);
//     const [taskForm, setTaskForm] = useState(false);
//     const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//     const [dragError, setDragError] = useState("");
//     const [successMessage, setSuccessMessage] = useState("");
//     const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);
//     const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks);
//     const [view, setView] = useState<"columns" | "list">("columns");
//     const [isFilterApplied, setIsFilterApplied] = useState(false);

//     // Update displayed tasks when tasks change.
//     useEffect(() => {
//         setDisplayedTasks(tasks);
//         setIsFilterApplied(false);
//     }, [tasks]);

//     // Prevent background scrolling while the task form is open.
//     useEffect(() => {
//         const previousOverflow = document.body.style.overflow;
//         if(taskForm){
//             document.body.style.overflow = "hidden";
//         }
//         return () => {
//             document.body.style.overflow = previousOverflow;
//         };
//     }, [taskForm]);

//     // Handle filtered task results.
//     const handleFilterChange = useCallback(
//         (filteredTasks: Task[], filterApplied: boolean) => {
//             setDisplayedTasks(filteredTasks);
//             setIsFilterApplied(filterApplied);
//         }, []
//     );

//     // Open the task creation form.
//     function addTask(){
//         setSelectedTask(null);
//         setTaskForm(true);
//     }

//     // Open the task editing form.
//     function editTask(task: Task){
//         setSelectedTask(task);
//         setTaskForm(true);
//     }

//     // Close the task form.
//     function formClose(){
//         setTaskForm(false);
//         setSelectedTask(null);
//     }

//     // Handle successful task creation or update.
//     function handleTaskSuccess(savedTask: Task){
//         saveTask(savedTask);
//         setSuccessMessage(selectedTask ? "Task updated successfully!" : "Task added successfully!");
//         formClose();
//     }

//     // Find the task to delete.
//     function askDeleteTask(id: string){
//         const task = tasks.find((currentTask) => String(currentTask.id) === String(id));
//         if(task){
//             setConfirmDeleteTask(task);
//         }
//     }

//     // Delete the selected task.
//     async function handleConfirmDelete() {
//         if (!confirmDeleteTask) return;
//         setSuccessMessage("");
//         const success = await removeTask(confirmDeleteTask.id);
//         if(success){
//             setConfirmDeleteTask(null);
//             setSuccessMessage("Task deleted successfully!");
//         }
//     }

//     // Reorder statuses inside the selected workflow.
//     async function handleColumnDragEnd(activeId: string, overId: string): Promise<boolean> {
//         if (activeId === overId) return false;

//         const oldIndex = columns.findIndex((column) => String(column.id) === activeId);
//         const newIndex = columns.findIndex((column) => String(column.id) === overId);
//         if (oldIndex === -1 || newIndex === -1) return false;

//         const reorderedStatuses = arrayMove(columns, oldIndex, newIndex).map((column, index) => ({...column, order: index}));

//         try{
//             await onWorkflowChange({...workflow, statuses: reorderedStatuses,});
//             setSuccessMessage("Status order updated successfully!");
//             setDragError("");
//             return true;
//         }catch(error){
//             console.error("Failed to update status order:", error);
//             setDragError("Unable to update status order. Please try again.");
//             return false;
//         }
//     }

//     // Display success messages from useTasks.
//     useEffect(() => {
//         if(successMessages){
//             setSuccessMessage(successMessages);
//         }
//     }, [successMessages]);

//     // Display drag errors from useTasks.
//     useEffect(() => {
//         if(taskDragError){
//             setDragError(taskDragError);
//         }
//     }, [taskDragError]);

//     // Loading state.
//     if (isLoading) {
//         return (
//             <div className="w-full p-6 text-primary-text">
//                 <p>Loading tasks...</p>
//             </div>
//         );
//     }

//     // Error state.
//     if (error && tasks.length === 0) {
//         return (
//             <div className="w-full p-6">
//                 <p className="mb-4 text-error">{error}</p>

//                 <button type="button" onClick={loadTasks}
//                     className="rounded bg-error px-4 py-2 text-white hover:bg-hover-error">
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* Success message */}
//             {successMessage && (
//                 <SuccessBox message={successMessage} onClose={() => setSuccessMessage("")}/>
//             )}

//             {/* Drag error */}
//             {dragError && (
//                 <p className="mb-2 px-2 text-error">
//                     {dragError}
//                 </p>
//             )}

//             {/* Task form modal */}
//             {taskForm && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={formClose}>
//                     <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-background"
//                         onClick={(event) => event.stopPropagation()}>
//                         <button type="button" onClick={formClose}
//                             className="absolute right-7 top-7 rounded-full p-1 text-primary-text hover:bg-gray-100 cursor-pointer">
//                             <X className="h-5 w-5" />
//                         </button>

//                         <TaskForm task={selectedTask ?? undefined}
//                             workflowId={workflow.id} columns={columns}
//                             onSuccess={handleTaskSuccess} onCancel={formClose}/>
//                     </div>
//                 </div>
//             )}

//             {/* Delete confirmation */}
//             {confirmDeleteTask && (
//                 <ConfirmBox message={`Are you sure you want to delete "${confirmDeleteTask.title}"?`} onConfirm={handleConfirmDelete}
//                     onCancel={() => setConfirmDeleteTask(null)}/>
//             )}

//             <div className="w-full overflow-x-auto p-6">

//                 {/* Heading and Add Task. */}
//                 <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <h1 className="text-3xl font-bold tracking-tight text-primary-text dark:text-primary-dark-text">
//                             {workflow.name}
//                         </h1>

//                         <h2 className="mb-1 mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
//                             Manage your tasks in this workflow.
//                         </h2>
//                     </div>

//                     <div className="relative inline-flex items-center rounded-md shadow-sm">
//                         <button type="button" onClick={() => {addTask();}}
//                             className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-hover-primary cursor-pointer">
//                             <Plus className="h-4 w-4" />
//                             Add Task
//                         </button>
//                     </div>
//                 </div>

//                 {/* Filters and view selection */}
//                 <div className="mb-2 flex items-center justify-between gap-3">
//                     <div className="min-w-0 flex-1">
//                         <TaskFilter tasks={tasks} columns={columns}
//                             onFilterChange={handleFilterChange}/>
//                     </div>

//                     <div className="flex items-center rounded border border-slate-400 dark:border-slate-700">
//                         <button type="button" onClick={() => setView("columns")}
//                             className={`flex cursor-pointer items-center px-2 py-1 text-sm font-medium ${view === "columns" ? "bg-slate-300 text-primary-text"
//                                 : "text-secondary-text hover:bg-gray-100 dark:text-third-dark-text dark:hover:bg-slate-800"}`}>
//                             <LayoutGrid className="h-4 w-4" />
//                         </button>

//                         <button type="button" onClick={() => setView("list")}
//                             className={`flex cursor-pointer items-center px-2 py-1 text-sm font-medium ${view === "list" ? "bg-slate-300 text-primary-text"
//                                 : "text-secondary-text hover:bg-gray-100 dark:text-third-dark-text dark:hover:bg-slate-800"}`}>
//                             <List className="h-4 w-4" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Task count */}
//                 {view === "columns" && (
//                     <p className="mb-2 flex items-start justify-end text-sm text-gray-600 dark:text-secondary-dark-text">
//                         Showing {displayedTasks.length} of {tasks.length} tasks
//                     </p>
//                 )}

//                 {/* Board or list view */}
//                 {columns.length === 0 ? (
//                     <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-slate-700">
//                         <p className="font-medium text-primary-text dark:text-primary-dark-text">
//                             This workflow has no statuses yet.
//                         </p>

//                         <p className="mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
//                             Add statuses in the workflow settings to start using this board.
//                         </p>
//                     </div>
//                 ) : view === "columns" ? (
//                     <TaskColumns tasks={displayedTasks}
//                         columns={columns} onDragEnd={handleDragEnd}
//                         isFilterApplied={isFilterApplied}
//                         onColumnDragEnd={handleColumnDragEnd}
//                         onEdit={editTask} onDelete={askDeleteTask}/>
//                 ) : (
//                     <TaskList tasks={displayedTasks}
//                         columns={columns}/>
//                 )}
//             </div>
//         </>
//     );
// }
"use client";
import TranslatedText from "@/features/i18n/components/TranslatedText";
import { useCallback, useEffect, useState } from "react";
import { X, LayoutGrid, List, Plus } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";
import TaskColumns from "./TaskColumns";
import TaskList from "./TaskList";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { Task, TaskColumn} from "@/features/tasks/type/taskType";
import type { Workflow } from "@/features/workflows/types/workflowType";
import SuccessBox from "@/components/SuccessBox";
import ConfirmBox from "@/components/ConfirmBox";
import { useTranslations } from "next-intl";

interface TaskBoardProps {
    workflow: Workflow;
    onWorkflowChange: (workflow: Workflow) => Promise<Workflow>;
}

export default function TaskBoard({workflow, onWorkflowChange}: TaskBoardProps) {

    // Get statuses from the selected workflow.
    const columns: TaskColumn[] = [...workflow.statuses].sort((a, b) => a.order - b.order);
    // Fetch only tasks belonging to the selected workflow.
    const {tasks, isLoading, error, loadTasks, saveTask, removeTask, handleDragEnd,
        successMessages, dragError: taskDragError} = useTasks(workflow.id);
    const [taskForm, setTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dragError, setDragError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);
    const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks);
    const [view, setView] = useState<"columns" | "list">("columns");
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const t = useTranslations("tasks");


    // Update displayed tasks when tasks change.
    useEffect(() => {
        setDisplayedTasks(tasks);
        setIsFilterApplied(false);
    }, [tasks]);

    // Prevent background scrolling while the task form is open.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        if(taskForm){
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [taskForm]);

    // Handle filtered task results.
    const handleFilterChange = useCallback(
        (filteredTasks: Task[], filterApplied: boolean) => {
            setDisplayedTasks(filteredTasks);
            setIsFilterApplied(filterApplied);
        }, []
    );

    // Open the task creation form.
    function addTask(){
        setSelectedTask(null);
        setTaskForm(true);
    }

    // Open the task editing form.
    function editTask(task: Task){
        setSelectedTask(task);
        setTaskForm(true);
    }

    // Close the task form.
    function formClose(){
        setTaskForm(false);
        setSelectedTask(null);
    }

    // Handle successful task creation or update.
    function handleTaskSuccess(savedTask: Task){
        saveTask(savedTask);
        setSuccessMessage(selectedTask ? "Task updated successfully!" : "Task added successfully!");
        formClose();
    }

    // Find the task to delete.
    function askDeleteTask(id: string){
        const task = tasks.find((currentTask) => String(currentTask.id) === String(id));
        if(task){
            setConfirmDeleteTask(task);
        }
    }

    // Delete the selected task.
    async function handleConfirmDelete() {
        if (!confirmDeleteTask) return;
        setSuccessMessage("");
        const success = await removeTask(confirmDeleteTask.id);
        if(success){
            setConfirmDeleteTask(null);
            setSuccessMessage("Task deleted successfully!");
        }
    }

    // Reorder statuses inside the selected workflow.
    async function handleColumnDragEnd(activeId: string, overId: string): Promise<boolean> {
        if (activeId === overId) return false;

        const oldIndex = columns.findIndex((column) => String(column.id) === activeId);
        const newIndex = columns.findIndex((column) => String(column.id) === overId);
        if (oldIndex === -1 || newIndex === -1) return false;

        const reorderedStatuses = arrayMove(columns, oldIndex, newIndex).map((column, index) => ({...column, order: index}));

        try{
            await onWorkflowChange({...workflow, statuses: reorderedStatuses,});
            setSuccessMessage("Status order updated successfully!");
            setDragError("");
            return true;
        }catch(error){
            console.error("Failed to update status order:", error);
            setDragError("Unable to update status order. Please try again.");
            return false;
        }
    }

    // Display success messages from useTasks.
    useEffect(() => {
        if(successMessages){
            setSuccessMessage(successMessages);
        }
    }, [successMessages]);

    // Display drag errors from useTasks.
    useEffect(() => {
        if(taskDragError){
            setDragError(taskDragError);
        }
    }, [taskDragError]);

    // Loading state.
    if (isLoading) {
        return (
            <div className="w-full p-6 text-primary-text">
                <p>Loading tasks...</p>
            </div>
        );
    }

    // Error state.
    if (error && tasks.length === 0) {
        return (
            <div className="w-full p-6">
                <p className="mb-4 text-error">{error}</p>

                <button type="button" onClick={loadTasks}
                    className="rounded bg-error px-4 py-2 text-white hover:bg-hover-error">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Success message */}
            {successMessage && (
                <SuccessBox message={successMessage} onClose={() => setSuccessMessage("")}/>
            )}

            {/* Drag error */}
            {dragError && (
                <p className="mb-2 px-2 text-error">
                    {dragError}
                </p>
            )}

            {/* Task form modal */}
            {taskForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={formClose}>
                    <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-background"
                        onClick={(event) => event.stopPropagation()}>
                        <button type="button" onClick={formClose}
                            className="absolute right-7 top-7 rounded-full p-1 text-primary-text hover:bg-gray-100 cursor-pointer">
                            <X className="h-5 w-5" />
                        </button>

                        <TaskForm task={selectedTask ?? undefined}
                            workflowId={workflow.id} columns={columns}
                            onSuccess={handleTaskSuccess} onCancel={formClose}/>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {confirmDeleteTask && (
                <ConfirmBox message={`Are you sure you want to delete "${confirmDeleteTask.title}"?`} onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmDeleteTask(null)}/>
            )}

            <div className="w-full overflow-x-auto p-6">

                {/* Heading and Add Task. */}
                <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary-text dark:text-primary-dark-text">
                            <TranslatedText text={workflow.name} entityType="workflow" entityId={workflow.id} field="name" />
                        </h1>

                        <h2 className="mb-1 mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
                            {t("subtitle")}
                        </h2>
                    </div>

                    <div className="relative inline-flex items-center rounded-md shadow-sm">
                        <button type="button" onClick={() => {addTask();}}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-hover-primary cursor-pointer">
                            <Plus className="h-4 w-4" />
                            {t("create")}
                        </button>
                    </div>
                </div>

                {/* Filters and view selection */}
                <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <TaskFilter tasks={tasks} columns={columns}
                            onFilterChange={handleFilterChange}/>
                    </div>

                    <div className="flex items-center rounded border border-slate-400 dark:border-slate-700">
                        <button type="button" onClick={() => setView("columns")}
                            className={`flex cursor-pointer items-center px-2 py-1 text-sm font-medium ${view === "columns" ? "bg-slate-300 text-primary-text"
                                : "text-secondary-text hover:bg-gray-100 dark:text-third-dark-text dark:hover:bg-slate-800"}`}>
                            <LayoutGrid className="h-4 w-4" />
                        </button>

                        <button type="button" onClick={() => setView("list")}
                            className={`flex cursor-pointer items-center px-2 py-1 text-sm font-medium ${view === "list" ? "bg-slate-300 text-primary-text"
                                : "text-secondary-text hover:bg-gray-100 dark:text-third-dark-text dark:hover:bg-slate-800"}`}>
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Task count */}
                {view === "columns" && (
                    <p className="mb-2 flex items-start justify-end text-sm text-gray-600 dark:text-secondary-dark-text">
                        Showing {displayedTasks.length} of {tasks.length} tasks
                    </p>
                )}

                {/* Board or list view */}
                {columns.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-slate-700">
                        <p className="font-medium text-primary-text dark:text-primary-dark-text">
                            This workflow has no statuses yet.
                        </p>

                        <p className="mt-1 text-sm text-secondary-text dark:text-secondary-dark-text">
                            Add statuses in the workflow settings to start using this board.
                        </p>
                    </div>
                ) : view === "columns" ? (
                    <TaskColumns tasks={displayedTasks}
                        columns={columns} onDragEnd={handleDragEnd}
                        isFilterApplied={isFilterApplied}
                        onColumnDragEnd={handleColumnDragEnd}
                        onEdit={editTask} onDelete={askDeleteTask}/>
                ) : (
                    <TaskList tasks={displayedTasks}
                        columns={columns}/>
                )}
            </div>
        </>
    );
}
