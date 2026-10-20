import TaskBoard from "@/features/tasks/components/TaskBoard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DashboardPage() {
    return (
        <div className="">
            <Header/>
            <div className="flex min-h-0 flex-1">
                <SideBar/>
                <main className="min-w-0 flex-1 overflow-y-auto dark:bg-slate-950">
                    <TaskBoard />
                </main>
            </div>
        </div>
    );
}