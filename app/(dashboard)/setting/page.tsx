import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import AppearanceSettings from "@/features/settings/components/AppearanceSetting";

export default function SettingsPage() {
  return (
    <div className="">
        <Header/>
        <div className="flex min-h-0 flex-1">
            <SideBar/>
            <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-950">
                <div className="flex-1 p-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-blue-400">
                        Settings
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Manage your profile and personalize your workspace.
                    </p>
                    <div className="mt-8 space-y-6">
                        <AppearanceSettings />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
