"use client"
import TaskBoard from "@/features/tasks/components/TaskBoard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import TaskList from "@/features/tasks/components/TaskList";
import { useTasks } from "@/features/tasks/hooks/useTasks";

export default function DashboardPage() {
    const {tasks} = useTasks();

    return (
        <div className="">
            <Header/>
            <div className="flex min-h-0 flex-1">
                <SideBar/>
                <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-950">
                    <div className="flex-1 p-3">
                        <TaskList tasks={tasks}/>
                    </div>
                </div>
            </div>
        </div>
    );
}



// "use client";
// import Header from "@/components/Header";
// import SideBar from "@/components/SideBar";
// import TaskList from "@/features/tasks/components/TaskList";

// export default function TaskListPage() {

//     return (
//         <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-950">
//                 <div className="flex-1">
//                     <TaskList tasks={tasks} />
//                 </div>
//         </div>
//     );
// }