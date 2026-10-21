import TaskBoard from "@/features/tasks/components/TaskBoard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function TaskPage() {
    return (
        <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950">
            <SideBar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
        
                <div className="min-w-0 flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950">
                    <TaskBoard />
                </div>
            </div>
        </div>
    );
}