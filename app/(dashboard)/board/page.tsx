import TaskBoard from "@/features/tasks/components/TaskBoard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DashboardPage(){
    return (
        //kanban board design page
        <div className="w-full min-h-screen bg-gray-100 ">
            <Header />
            <div className="flex w-full min-h-screen">
                <SideBar />
                <TaskBoard />

            </div>
        </div>
    )
}