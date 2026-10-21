import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import Dashboard from "@/features/dashboard/components/Dashboard";

export default function DashboardPage() {
    return (
        <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950">
            <SideBar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                <div className="min-w-0 flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950">
                    <Dashboard />
                </div>
            </div>
        </div>
    );
}
