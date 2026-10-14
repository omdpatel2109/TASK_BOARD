import TaskBoard from "@/features/tasks/components/TaskBoard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DashboardPage(){
    return (
        //kanban board design page
        <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-950">
            <Header />
        
            <div className="flex min-h-screen w-full">
                <SideBar />
        
                <div className="flex-1 p-6">
                    {/* Task board */}
                    <TaskBoard />
                </div>
            </div>
        </div>
    )
}