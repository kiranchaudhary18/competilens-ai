import { Link, useRouterState } from "@tanstack/react-router";
import {
  Brain,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analysis", label: "Analysis", icon: Sparkles },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/history", label: "History", icon: History },
  { to: "/memory", label: "AI Memory", icon: Brain },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, setCollapsed }: SidebarProps) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside 
      className={`hidden lg:flex fixed inset-y-0 left-0 flex-col bg-sidebar z-20 border-r border-sidebar-border/80 transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-[72px] px-5 flex items-center justify-between border-b border-sidebar-border/80">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden shrink-0">
          <div className="relative w-9 h-9 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
            <Zap className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="leading-tight select-none shrink-0"
            >
              <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">
                CompetiLens
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Enterprise AI
              </div>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {nav.map((item) => {
          const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center rounded-2xl text-sm transition group h-11 ${
                collapsed ? "justify-center px-0" : "px-4 gap-3"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-[0.08] ring-1 ring-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {active && (
                <motion.span
                  layoutId="active-indicator"
                  className="absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full bg-gradient-primary shadow-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-sidebar-foreground"
                }`}
              />
              {!collapsed && (
                <span
                  className={`transition-colors truncate ${
                    active
                      ? "text-sidebar-foreground font-semibold"
                      : "text-muted-foreground group-hover:text-sidebar-foreground"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse controls at bottom */}
      {setCollapsed && (
        <div className="p-4 border-t border-sidebar-border/80 flex justify-center shrink-0">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-10 h-10 rounded-2xl border border-sidebar-border bg-sidebar-accent/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition flex items-center justify-center text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </aside>
  );
}
