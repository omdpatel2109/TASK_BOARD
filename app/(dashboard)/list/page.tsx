"use client";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import TaskList from "@/features/tasks/components/TaskList";
import { useTasks } from "@/features/tasks/hooks/useTasks";

export default function TaskListPage() {
    const {tasks} = useTasks();

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-950">
                <div className="flex-1">
                    <TaskList tasks={tasks} />
                </div>
        </div>
    );
}