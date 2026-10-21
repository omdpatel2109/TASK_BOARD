"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Settings } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/board", icon: LayoutDashboard },
  { label: "Task Board", href: "/tasks", icon: CheckSquare }, 
  { label: "Settings", href: "/setting", icon: Settings },
];

export default function SideBar() {
  const pathName = usePathname();
  const linkBaseClass = "flex items-center px-4 py-2.5 text-lg rounded-md font-semibold cursor-pointer w-full";
  const linkActiveSubClass = "bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400";
  const linkInactiveSubClass = "text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400";

  return (
    <div className="sticky fixed top-0 flex min-h-screen w-60 flex-col border-r border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:w-64">
      <div className="p-4 flex-1 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathName === item.href;
          const Icon = item.icon;
          return(
            <Link key={item.href} href={item.href}
              className={`${linkBaseClass} ${
                isActive ? linkActiveSubClass : linkInactiveSubClass
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}