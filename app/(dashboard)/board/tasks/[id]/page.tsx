import { getTaskById } from "@/api/task";
import TaskDetails from "@/features/tasks/components/TaskDetails";
import CommentBox from "@/features/comments/components/CommentBox";

interface TaskDetailsPageProps {params: Promise<{id: string}>;}

export default async function TaskDetailsPage({params}: TaskDetailsPageProps){
    const { id } = await params;

    const task = await getTaskById(id);
    return(
        <>
            <div className="min-h-screen w-full bg-slate-50 p-6">
                <div>
                    <TaskDetails task={task} />
                </div>
                <div className="w-full">    
                    <CommentBox />
                </div>
            </div>
        
        </>
    );

}