"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {LayoutDashboard, CheckSquare, Settings, PanelLeftClose, PanelLeftOpen} from "lucide-react";
import { useState } from "react";

const SIDEBAR_ITEMS = [
  { key: "dashboard", href: "/board", icon: LayoutDashboard },
  { key: "board", href: "/tasks", icon: CheckSquare },
  // { key: "settings", href: "/setting", icon: Settings },
] as const;

export default function SideBar() {
  const pathName = usePathname();
  const t = useTranslations("sidebar");
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`sticky top-0 flex h-screen flex-col border-r border-slate-200 bg-white duration-200 dark:border-slate-800 dark:bg-slate-950 ${isExpanded ? "w-60" : "w-16"}`}
    >
      <div className={`mb-3 mt-3 flex h-14 items-center p-2 ${ isExpanded ? "justify-between" : "justify-center"}`}>
        {isExpanded && (
          <h1 className="p-4 text-lg font-bold text-primary sm:text-2xl dark:text-blue-400">
            {t("title")}
          </h1>
        )}

        <button type="button" onClick={() => setIsExpanded((prev) => !prev)}
          className="rounded-md p-2 text-secondary-text/50 hover:text-primary-text dark:hover:bg-slate-800"
        >
          {isExpanded ? (<PanelLeftClose size={20} />) : (<PanelLeftOpen size={20} />)}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-2 px-3">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathName === item.href;

          return (
            <Link key={item.href} href={item.href}
              title={!isExpanded ? t(item.key) : undefined}
              className={`flex w-full items-center rounded-lg py-3 text-md font-medium ${
                isExpanded ? "gap-3 px-3" : "justify-center px-0"} ${
                isActive ? "bg-blue-200 text-primary dark:bg-slate-800 dark:text-blue-400"
                  : "text-primary-text hover:bg-blue-100 dark:text-slate-300 dark:hover:bg-slate-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />

              {isExpanded && <span>{t(item.key)}</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}