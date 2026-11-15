// import Header from "@/components/Header";
// import SideBar from "@/components/SideBar";
// import Dashboard from "@/features/dashboard/components/Dashboard";

// export default function DashboardPage() {
//     return (
//         <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950">
//             <SideBar />

//             <div className="flex flex-1 flex-col overflow-hidden">
//                 <Header />

//                 <div className="min-w-0 flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950">
//                     <Dashboard />
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";

import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import Dashboard from "@/features/dashboard/components/Dashboard";

import { useWorkflows } from "@/features/workflows/hooks/useWorkflows";

export default function DashboardPage() {
    const {
        activeWorkflow,
        isLoading,
        error,
    } = useWorkflows();

    if (isLoading) {
        return <div className="p-6">Loading dashboard...</div>;
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
                        <Dashboard workflow={activeWorkflow} />
                    ) : (
                        <div className="p-6">
                            No workflow selected. Please create a workflow first.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}