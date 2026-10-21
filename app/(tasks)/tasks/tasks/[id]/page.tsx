import { redirect, notFound } from "next/navigation";
import { getTaskById } from "@/api/task";
import { getCurrentUser } from "@/features/auth/action";
import TaskAllDetails from "@/features/tasks/components/TaskAllDetails";

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
            <div className="p-6 text-red-600">
                Unable to load this task. Please try again.
            </div>
        );
    }

    return (
        <TaskAllDetails initialTask={task} currentUser={currentUser}
        />
    );
}