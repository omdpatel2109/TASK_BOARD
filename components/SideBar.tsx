"use client"
import {useRouter} from "next/navigation";
import useAuth from "@/features/auth/hooks/useAuth";

export default function SideBar() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="md:w-64 sm:w-60 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 sticky top-0 h-screen flex flex-col">
      <div className="p-4">
        {/* Dashboard */}
        <div 
          onClick={() => router.push('/board')} 
          className="flex items-center px-4 py-2.5 text-lg text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold cursor-pointer"
        >
          <span className="mr-3 text-gray-500 dark:text-gray-400"></span>
          Dashboard
        </div>

        {/* Tasks */}
        <div 
          onClick={() => router.push(`/list`)} 
          className="flex items-center px-4 py-2.5 mt-1 text-lg text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold cursor-pointer"
        >
          <span className="mr-3 text-gray-500 dark:text-gray-400"></span>
          Tasks
        </div>

        {/* Settings */}
        <div 
          onClick={() => router.push(`/setting`)} 
          className="flex items-center px-4 py-2.5 mt-1 text-lg text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold cursor-pointer"
        >
          <span className="mr-3 text-gray-500 dark:text-gray-400"></span>
          Settings
        </div>
      </div>

      {/* Logout */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-slate-800">
        <button 
          className="w-full py-2.5 px-4 text-lg font-medium text-white border bg-red-500 border-gray-200 dark:border-slate-800 rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition-colors" 
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
