import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import WorkflowPage from "@/features/workflows/components/WorkflowPage";

export default function WorkflowsPage() {
    return (
        <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950">
            <SideBar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                <div className="min-w-0  overflow-y-auto">
                    <WorkflowPage />
                </div>
            </div>
        </div>
    );
}