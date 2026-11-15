// import TaskBoard from "@/features/tasks/components/TaskBoard";
// import Header from "@/components/Header";
// import SideBar from "@/components/SideBar";

// export default function TaskPage() {
//     return (
//         <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950">
//             <SideBar />

//             <div className="flex flex-1 flex-col overflow-hidden">
//                 <Header />
        
//                 <div className="min-w-0 flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950">
//                     <TaskBoard />
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";

import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import TaskBoard from "@/features/tasks/components/TaskBoard";

import { useWorkflows } from "@/features/workflows/hooks/useWorkflows";
import type { Workflow } from "@/features/workflows/types/workflowType";

export default function TaskPage() {
    const {
        activeWorkflow,
        isLoading,
        error,
        editWorkflow,
    } = useWorkflows();

    const handleWorkflowChange = async (
        updatedWorkflow: Workflow
    ): Promise<Workflow> => {
        return await editWorkflow(updatedWorkflow.id, {
            statuses: updatedWorkflow.statuses,
        });
    };

    if (isLoading) {
        return <div className="p-6">Loading workflows...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950">
            <SideBar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                <div className="min-w-0 flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950">
                    {activeWorkflow ? (
                        <TaskBoard
                            key={activeWorkflow.id}
                            workflow={activeWorkflow}
                            onWorkflowChange={handleWorkflowChange}
                        />
                    ) : (
                        <div className="p-6">
                            <p>No workflow selected. Please create a workflow first.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}