"use client";

import {
  CalendarDays,
  CheckSquare,
  FileText,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AppView } from "@/lib/types";

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { id: "today", label: "Today's Viewings", icon: CalendarDays, badge: 3 },
  {
    id: "pending",
    label: "Pending Approvals",
    icon: CheckSquare,
    badge: 2,
  },
  { id: "vendor-reports", label: "Vendor Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings, disabled: true },
];

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-white">
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => !item.disabled && onViewChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={
                item.badge !== undefined
                  ? `${item.label}, ${item.badge} items`
                  : item.label
              }
              className={cn(
                "flex w-full items-center gap-3 rounded-r-lg border-l-[3px] px-3 py-2.5 text-left text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#534AB7] focus-visible:ring-offset-2",
                isActive
                  ? "border-l-[#534AB7] bg-[#534AB7]/10 text-[#534AB7]"
                  : "border-l-transparent text-muted-foreground hover:border-l-[#534AB7]/30 hover:bg-muted/50 hover:text-foreground",
                item.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "h-5 min-w-5 justify-center px-1.5",
                    isActive && "bg-[#534AB7] hover:bg-[#534AB7]/90"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t px-3 py-3">
        <p className="text-[11px] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 align-middle mr-1.5" aria-hidden />
          Last sync: just now
        </p>
      </div>
    </aside>
  );
}
