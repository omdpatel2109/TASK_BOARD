import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
// import EditProfile from "@/features/settings/components/EditProfile";

export default function TaskPage() {
    return (
        <div className="">
            <Header/>
            <div className="flex min-h-0 flex-1">
                <SideBar/>
                <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950 p-6">
                    {/* <h1 className="text-2xl font-bold text-slate-900 dark:text-blue-400">
                        Settings
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Manage your profile and personalize your workspace.
                    </p> */}
                    {/* <div className="mt-3 space-y-6"> */}
                        {/* <EditProfile /> */}
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}