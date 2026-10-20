import TaskBoard from "@/features/tasks/components/TaskBoard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DashboardPage() {
    return (
        <div className="">

            {/* <div className="flex min-h-0 flex-1"> */}

                <main className="min-w-0 flex-1 overflow-y-auto">
                    <TaskBoard />
                </main>
            {/* </div> */}
        </div>
    );
}