import TaskBoard from "@/features/tasks/components/TaskBoard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DashboardPage() {
    return (
        <div className="flex w-full flex-col overflow-hidden bg-gray-100 dark:bg-slate-950">
            <Header />

            <div className="flex min-h-0 flex-1">
                <SideBar />

                <main className="min-w-0 flex-1 overflow-y-auto p-6">
                    <TaskBoard />
                </main>
            </div>
        </div>
    );
}