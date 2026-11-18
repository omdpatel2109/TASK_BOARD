// "use client";
// import { useEffect, useState } from "react";
// import { Plus, Edit2, Trash2, Check } from "lucide-react";
// import { useWorkflows } from "../hooks/useWorkflows";
// import type { Workflow } from "../types/workflowType";
// import WorkflowForm from "./WorkflowForm";

// const ITEMS_PER_PAGE = 9;

// export default function WorkflowPage() {
//     const {workflows, activeWorkflow, isLoading, error, selectWorkflow, addWorkflow, editWorkflow, removeWorkflow} = useWorkflows();
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     // Pagination
//     const totalPages = Math.ceil(workflows.length / ITEMS_PER_PAGE);
//     const displayTotalPages = Math.max(totalPages, 1);
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const currentWorkflows = workflows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//     // Keep current page valid after deleting workflows
//     useEffect(() => {
//         if(totalPages === 0){
//             setCurrentPage(1);
//         }else if(currentPage > totalPages){
//             setCurrentPage(totalPages);
//         }
//     }, [currentPage, totalPages]);

//     // Change page
//     function goToPage(page: number){
//         if (page < 1 || page > displayTotalPages) return;
//         setCurrentPage(page);
//     }

//     // Open create form
//     function openCreateForm(){
//         setEditingWorkflow(null);
//         setIsFormOpen(true);
//     }

//     // Open edit form
//     function openEditForm(workflow: Workflow){
//         setEditingWorkflow(workflow);
//         setIsFormOpen(true);
//     }

//     // Close form
//     function closeForm(){
//         setIsFormOpen(false);
//         setEditingWorkflow(null);
//     }

//     // Called after successful save
//     function handleSaved(isNew: boolean){
//         if(isNew){
//             setCurrentPage(Math.ceil((workflows.length + 1) / ITEMS_PER_PAGE));
//         }
//     }

//     // Delete workflow
//     async function handleDelete(workflow: Workflow){
//         const confirmed = window.confirm(
//             `Delete "${workflow.name}"? Its tasks will also need to be handled.`
//         );

//         if (!confirmed) return;

//         try{
//             await removeWorkflow(workflow.id);
//         }catch{
//             console.error("Unable to delete workflow.");
//         }
//     }

//     if(isLoading){
//         return (
//             <div className="p-4 text-base text-secondary-text">
//                 Loading workflows...
//             </div>
//         );
//     }

//     return (
//         <div className="w-full p-6 sm:px-4 lg:p-6">
//             {/* Page Header */}
//             <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//                 <div>
//                     <h1 className="text-2xl font-bold tracking-tight text-primary-text dark:text-white">
//                         My Workflows
//                     </h1>
//                     <p className="mt-1 text-sm text-secondary-text">
//                         Manage your workflows and their task statuses.
//                     </p>
//                 </div>

//                 <button type="button" onClick={openCreateForm}
//                     className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-small font-medium text-white transition hover:opacity-90 cursor-pointer">
//                     <Plus className="h-4 w-4" />
//                     Create Workflow
//                 </button>
//             </div>

//             {/* Error */}
//             {error && (
//                 <p className="mb-4 text-base text-red-500">
//                     {error}
//                 </p>
//             )}

//             {/* Workflow List */}
//             {workflows.length === 0 ? (
//                 <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
//                     <h2 className="text-xl font-semibold text-primary-text dark:text-white">
//                         No workflows yet
//                     </h2>

//                     <p className="mt-2 text-base text-secondary-text">
//                         Create your first workflow to organize your tasks.
//                     </p>

//                     <button type="button" onClick={openCreateForm}
//                         className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white">
//                         Create your first workflow
//                     </button>
//                 </div>
//             ) : (
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     {currentWorkflows.map((workflow) => (
//                         <div key={workflow.id}
//                             className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
//                             {/* Card Header */}
//                             <div className="flex items-start justify-between gap-2">
//                                 <div className="min-w-0">
//                                     <h2 className="truncate text-xl font-semibold text-primary-text dark:text-white">
//                                         {workflow.name}
//                                     </h2>

//                                     <p className="mt-1 line-clamp-2 min-h-10 text-sm text-secondary-text">
//                                         {workflow.description || "No description"}
//                                     </p>
//                                 </div>

//                                 {/* Edit and Delete */}
//                                 <div className="flex shrink-0 gap-1">
//                                     <button type="button"
//                                         onClick={() => openEditForm(workflow)}
//                                         className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 cursor-pointer">
//                                         <Edit2 size={17} />
//                                     </button>

//                                     <button type="button"
//                                         onClick={() => handleDelete(workflow)}
//                                         className="rounded-md p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer">
//                                         <Trash2 size={17} />
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Statuses */}
//                             <div className="flex min-h-14 flex-wrap content-start gap-2">
//                                 {[...workflow.statuses].sort((a, b) => a.order - b.order)
//                                     .map((status) => (
//                                         <span key={status.id}
//                                             className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
//                                             {status.title}
//                                         </span>
//                                     ))}
//                             </div>

//                             {/* Open Workflow */}
//                             <button type="button"
//                                 onClick={() => selectWorkflow(workflow)}
//                                 className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${
//                                     activeWorkflow?.id === workflow.id
//                                         ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
//                                         : "bg-primary text-white hover:opacity-90"
//                                 }`}>
//                                 {activeWorkflow?.id === workflow.id && (
//                                     <Check size={16} />
//                                 )}

//                                 {activeWorkflow?.id === workflow.id
//                                     ? "Active Workflow"
//                                     : "Open Workflow"}
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Pagination - Always Visible */}
//             <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
//                 <p className="text-sm text-secondary-text">
//                     Showing{" "}
//                     {workflows.length === 0 ? 0 : startIndex + 1}
//                     -
//                     {Math.min(startIndex + ITEMS_PER_PAGE, workflows.length)}{" "} of {workflows.length} workflows
//                 </p>

//                 <div className="flex items-center gap-2">

//                     {/* Previous */}
//                     <button type="button" disabled={currentPage === 1}
//                         onClick={() => goToPage(currentPage - 1)}
//                         className="rounded-md border border-slate-200 px-3 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">
//                         Previous
//                     </button>

//                     {/* Page Numbers */}
//                     <span className="whitespace-nowrap text-sm text-slate-500 dark:text-secondary-dark-text">
//                         {currentPage} / {Math.max(totalPages, 1)}
//                     </span>

//                     {/* Next */}
//                     <button type="button" disabled={currentPage >= displayTotalPages}
//                         onClick={() => goToPage(currentPage + 1)}
//                         className="rounded-md border border-slate-200 px-3 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">
//                         Next
//                     </button>
//                 </div>
//             </div>

//             {/* Create / Edit Workflow Form */}
//             {isFormOpen && (
//                 <WorkflowForm editingWorkflow={editingWorkflow}
//                     onClose={closeForm} onCreate={addWorkflow}
//                     onUpdate={editWorkflow} onSaved={handleSaved}/>
//             )}
//         </div>
//     );
// }
"use client";
import TranslatedText from "@/features/i18n/components/TranslatedText";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Check, MoreVertical } from "lucide-react";
import { useWorkflows } from "../hooks/useWorkflows";
import type { Workflow } from "../types/workflowType";
import WorkflowForm from "./WorkflowForm";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 6;

export default function WorkflowPage() {
    const {workflows, activeWorkflow, isLoading, error, selectWorkflow, addWorkflow, editWorkflow, removeWorkflow} = useWorkflows();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Pagination
    const totalPages = Math.ceil(workflows.length / ITEMS_PER_PAGE);
    const displayTotalPages = Math.max(totalPages, 1);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentWorkflows = workflows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const t = useTranslations("workflows");

    // Keep current page valid after deleting workflows
    useEffect(() => {
        if(totalPages === 0){
            setCurrentPage(1);
        }else if(currentPage > totalPages){
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // Change page
    function goToPage(page: number){
        if (page < 1 || page > displayTotalPages) return;
        setCurrentPage(page);
    }

    // Open create form
    function openCreateForm(){
        setEditingWorkflow(null);
        setIsFormOpen(true);
    }

    // Open edit form
    function openEditForm(workflow: Workflow){
        setEditingWorkflow(workflow);
        setIsFormOpen(true);
    }

    // Close form
    function closeForm(){
        setIsFormOpen(false);
        setEditingWorkflow(null);
    }

    // Called after successful save
    function handleSaved(isNew: boolean){
        if(isNew){
            setCurrentPage(Math.ceil((workflows.length + 1) / ITEMS_PER_PAGE));
        }
    }

    // Delete workflow
    async function handleDelete(workflow: Workflow){
        const confirmed = window.confirm(
            `Delete "${workflow.name}"? Its tasks will also need to be handled.`
        );

        if (!confirmed) return;

        try{
            await removeWorkflow(workflow.id);
        }catch{
            console.error("Unable to delete workflow.");
        }
    }

    if(isLoading){
        return (
            <div className="p-4 text-base text-secondary-text">
                Loading workflows...
            </div>
        );
    }

    return (
        <div className="w-full p-6 sm:px-4 lg:p-6">
            {/* Page Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary-text dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="mt-1 text-sm text-secondary-text">
                        Manage your workflows and their task statuses.
                    </p>
                </div>

                <button type="button" onClick={openCreateForm}
                    className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-small font-medium text-white transition hover:opacity-90 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    {t("createWorkflow")}
                </button>
            </div>

            {/* Error */}
            {error && (
                <p className="mb-4 text-base text-red-500">
                    {error}
                </p>
            )}

            {/* Workflow List */}
            {workflows.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-primary-text dark:text-white">
                        No workflows yet
                    </h2>

                    <p className="mt-2 text-base text-secondary-text">
                        Create your first workflow to organize your tasks.
                    </p>

                    <button type="button" onClick={openCreateForm}
                        className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white">
                        Create your first workflow
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {currentWorkflows.map((workflow) => (
                        <div key={workflow.id}
                            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <h2 className="truncate text-xl font-semibold text-primary-text dark:text-white">
                                        <TranslatedText text={workflow.name} entityType="workflow" entityId={workflow.id} field="name" />
                                    </h2>

                                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-secondary-text">
                                        <TranslatedText text={workflow.description || "No description"} entityType="workflow" entityId={workflow.id} field="description" />
                                    </p>
                                </div>

                                {/* Edit and Delete */}
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
                                    <div onPointerDown={(event) => event.stopPropagation()}
                                        className="absolute right-0 top-full z-50 mt-1 flex w-fit items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                                        <button type="button" onClick={(event)=> {
                                            openEditForm(workflow);
                                            event.stopPropagation();
                                            setIsMenuOpen(false);
                                        }}
                                            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 cursor-pointer">
                                            <Edit2 size={17} />
                                        </button>
                                        <button type="button" onClick={(event) => {
                                            event.stopPropagation();
                                            setIsMenuOpen(false);
                                            handleDelete(workflow);

                                        }}
                                            className="rounded-md p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer">
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* Statuses */}
                            <div className="flex min-h-14 flex-wrap content-start gap-2">
                                {[...workflow.statuses].sort((a, b) => a.order - b.order)
                                    .map((status) => (
                                        <span key={status.id}
                                            className="rounded-md bg-slate-100 px-2 py-1.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300 mb-2">
                                            <TranslatedText text={status.title} entityType="workflowStatus" entityId={`${workflow.id}_${status.id}`} field="title" />
                                        </span>
                                    ))}
                            </div>

                            {/* Open Workflow */}
                            <button type="button"
                                onClick={() => selectWorkflow(workflow)}
                                className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${
                                    activeWorkflow?.id === workflow.id
                                        ? "bg-slate-200 text-slate-800 dark:bg-blue-950 dark:text-blue-400"
                                        : "bg-slate-800 text-white hover:opacity-90"
                                }`}>
                                {activeWorkflow?.id === workflow.id && (
                                    <Check size={16} />
                                )}
                                {activeWorkflow?.id === workflow.id
                                    ? t("activeWorkflow")
                                    : t("openWorkflow")
                                }
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination - Always Visible */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                <p className="text-sm text-secondary-text">
                    Showing{" "}
                    {workflows.length === 0 ? 0 : startIndex + 1}
                    -
                    {Math.min(startIndex + ITEMS_PER_PAGE, workflows.length)}{" "} of {workflows.length} workflows
                </p>

                <div className="flex items-center gap-2">

                    {/* Previous */}
                    <button type="button" disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <span className="whitespace-nowrap text-sm text-slate-500 dark:text-secondary-dark-text">
                        {currentPage} / {Math.max(totalPages, 1)}
                    </span>

                    {/* Next */}
                    <button type="button" disabled={currentPage >= displayTotalPages}
                        onClick={() => goToPage(currentPage + 1)}
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700">
                        Next
                    </button>
                </div>
            </div>

            {/* Create / Edit Workflow Form */}
            {isFormOpen && (
                <WorkflowForm editingWorkflow={editingWorkflow}
                    onClose={closeForm} onCreate={addWorkflow}
                    onUpdate={editWorkflow} onSaved={handleSaved}/>
            )}
        </div>
    );
}