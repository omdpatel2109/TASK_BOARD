import type { Task } from "@/features/tasks/type/taskType";
import Link from 'next/link';
import { useRouter } from "next/navigation";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({task, onEdit, onDelete}: TaskCardProps) {

    const theme = {
        todo: {
            border: "border-blue-400",
            title: "text-blue-600",
            status: "bg-blue-100 text-blue-700",
            hover: "hover:bg-blue-50"
        },

        in_progress: {
            border: "border-amber-400",
            title: "text-amber-600",
            status: "bg-amber-100 text-amber-700",
            hover: "hover:bg-amber-50"
        },

        done: {
            border: "border-green-400",
            title: "text-green-600",
            status: "bg-green-100 text-green-700",
            hover: "hover:bg-green-50"
        }
    };

    //it get the task.status=todo/inprogress/done value when it calls in TaskBoard(taskboard have the value of status then it provide the style according to status)
    const currentTheme = theme[task.status];

    const router = useRouter();

    return (
        // <Link href={'/board/${title}'}>
            <div className={`mx-4 my-4 rounded-md border-2 bg-gray-100 text-left shadow-lg
                    transition duration-300 hover:-translate-y-1
                    ${currentTheme.border} ${currentTheme.hover}
                `} draggable
                onClick={() => router.push(`/board/tasks/${task.id}`)}
            >
                <div className="p-4">
                    <h2 className={`mb-2 text-lg font-bold ${currentTheme.title}`}>
                        {task.title}
                    </h2>

                    <p className="text-sm leading-6 text-gray-700">
                        Description: {task.description}
                    </p>

                    <div className="mt-4 flex gap-2">
                        <button type="button" onClick={(event) => {
                                event.stopPropagation();
                                onEdit(task)}}
                            className="rounded-md bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-200 hover:bg-blue-200 hover:border-blue-300 transition-colors">
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete(task.id)}}
                            className="rounded-md bg-red-100 px-4 py-1.5 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-200 hover:border-red-300 transition-colors"
                        >
                            Delete
                        </button>

                    </div>
                </div>
            </div>
        // </Link>
    );
}