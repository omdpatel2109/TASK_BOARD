"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard, CheckSquare, Settings, PanelLeftClose, PanelLeftOpen,} from "lucide-react";
import { useState } from "react";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/board", icon: LayoutDashboard },
  { label: "Task Board", href: "/tasks", icon: CheckSquare },
  { label: "Settings", href: "/setting", icon: Settings },
];

export default function SideBar() {
  const pathName = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className={`sticky top-0 flex h-screen flex-col border-r border-blue-200 bg-white duration-200 dark:border-slate-800 dark:bg-slate-950 ${isExpanded ? "w-60" : "w-16"}`}
    >
      {/* Sidebar Header */}
      <div className={`flex h-14 items-center p-2 mb-3 mt-3 ${ isExpanded ? "justify-between" : "justify-center"
        }`}
      >
        {isExpanded && <h1 className="text-lg font-bold text-blue-700 sm:text-2xl dark:text-blue-400 p-4 truncate">
                Task Board
        </h1>}
        <button type="button" onClick={() => setIsExpanded((prev) => !prev)}
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className="rounded-md p-2 text-blue-500 hover:bg-blue-100
            hover:text-blue-600 dark:hover:bg-slate-800"
        >
          {isExpanded ? ( <PanelLeftClose size={20} />) : (<PanelLeftOpen size={20} />)}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-2 px-3">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathName === item.href;

          return (
            <Link key={item.href} href={item.href}
              title={!isExpanded ? item.label : undefined}
              className={`flex w-full items-center rounded-lg py-3 text-md font-medium ${isExpanded ? "gap-3 px-3" : "justify-center px-0"}
                ${isActive ? "bg-blue-200 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                    : "text-blue-600 hover:bg-blue-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-900"
                }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isExpanded && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
