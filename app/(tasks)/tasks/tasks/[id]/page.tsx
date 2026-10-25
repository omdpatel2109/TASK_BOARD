import { redirect, notFound } from "next/navigation";
import { getTaskById } from "@/api/task";
import { getCurrentUser } from "@/features/auth/action";
import TaskAllDetails from "@/features/tasks/components/TaskAllDetails";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TaskDetailsPage({ params }: PageProps) {
    const { id } = await params;
    // Check authentication on the server.
    const currentUser = await getCurrentUser();
    if(!currentUser){
        redirect("/login");
    }
    // Fetch the initial task on the server.
    let task;

    try{
        task = await getTaskById(id);
    }catch(error){
        console.error("Failed to load task:", error);

        return (
            <div className="p-6 text-error">
                Unable to load this task. Please try again.
            </div>
        );
    }

    return (

        <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950">
            <SideBar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Header />
        
                    <div className="min-w-0 flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950">
                        <TaskAllDetails initialTask={task} currentUser={currentUser}/>
                    </div>
                </div>
            </div>
    );
}