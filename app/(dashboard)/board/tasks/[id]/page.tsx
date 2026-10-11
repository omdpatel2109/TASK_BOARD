import { getTaskById } from "@/api/task";
import TaskDetails from "@/features/tasks/components/TaskDetails";
import CommentBox from "@/features/comments/components/CommentBox";
import CommentList from "@/features/comments/components/CommentList";

interface TaskDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function TaskDetailsPage({
    params,
}: TaskDetailsPageProps) {
    const { id } = await params;
    const task = await getTaskById(id);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <TaskDetails task={task} />

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">
                        Comments
                    </h2>

                    {/* <CommentBox /> */}

                    <div className="mt-5 border-t border-slate-100">
                        <CommentList taskId={String(task.id)} />
                    </div>
                </section>
            </div>
        </main>
    );
}