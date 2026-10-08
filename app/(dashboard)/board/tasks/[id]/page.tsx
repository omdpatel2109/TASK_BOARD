import { notFound } from "next/navigation";

import { getTaskById } from "@/api/task";
import TaskDetails from "@/features/tasks/components/TaskDetails";

interface TaskDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TaskDetailsPage({
    params
}: TaskDetailsPageProps) {
    const { id } = await params;

    try {
        const task = await getTaskById(id);

        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <TaskDetails task={task} />
            </div>
        );
    } catch {
        notFound();
    }
}