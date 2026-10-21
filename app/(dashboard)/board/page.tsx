// import Dashboard from "@/features/dashboard/components/Dashboard";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DashboardPage() {
    return (
        <div className="">
            <Header/>
            <div className="flex min-h-0 flex-1">
                <SideBar/>
                <div className=" flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950">
                    {/* <Dashboard /> */}
                </div>
            </div>
        </div>
    );
}

// import Dashboard from "@/features/dashboard/components/Dashboard";

// export default function DashboardPage() {
//   return <Dashboard />;
// }