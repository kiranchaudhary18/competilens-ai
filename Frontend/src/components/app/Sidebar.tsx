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
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

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
      className={`hidden lg:flex fixed inset-y-0 left-0 flex-col bg-white z-20 border-r border-[#E2E8F0] shadow-[1px_0_15px_rgba(0,0,0,0.015)] transition-all duration-300 ${
        collapsed ? "w-20" : "w-[250px]"
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-[74px] px-6 flex items-center justify-between border-b border-[#E2E8F0] shrink-0">
        <Link to="/dashboard" className="flex flex-col gap-0.5 overflow-hidden shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-md shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-sm text-[#0F172A]">CompetiLens</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/25 uppercase font-bold tracking-wider">
                  AI
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <span className="text-[9px] font-bold text-[#64748B] tracking-wider pl-1.5 uppercase mt-1">
              Enterprise AI Platform
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {nav.map((item) => {
          const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center rounded-xl text-xs.5 font-bold transition-all duration-200 h-11 ${
                collapsed ? "justify-center px-0" : "px-4 gap-3"
              } ${
                active
                  ? "text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#2563EB]/5"
              }`}
            >
              {/* Left glowing dot indicator for active state */}
              {active && !collapsed && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#FFF] shrink-0" />
              )}
              
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  active ? "text-white" : "text-[#64748B] group-hover:text-[#2563EB]"
                }`}
              />

              {!collapsed && (
                <span className="truncate">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Support Card & Version */}
      {!collapsed && (
        <div className="p-4 border-t border-[#E2E8F0] space-y-4 shrink-0">
          <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-slate-50/60 backdrop-blur-md space-y-2.5">
            <div className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Need Help?</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-[#64748B] font-semibold">
              <a href="#docs" className="hover:text-[#2563EB] transition duration-150">Documentation</a>
              <a href="#support" className="hover:text-[#2563EB] transition duration-150">Contact Support</a>
              <a href="#shortcuts" className="hover:text-[#2563EB] transition duration-150">Keyboard Shortcuts</a>
              <a href="#feedback" className="hover:text-[#2563EB] transition duration-150">Feedback</a>
            </div>
          </div>
          <div className="text-[10px] text-center font-bold text-[#64748B] tracking-wide select-none">
            v2.1 Enterprise
          </div>
        </div>
      )}

      {/* Collapse controls at bottom */}
      {setCollapsed && (
        <div className="p-4 border-t border-[#E2E8F0] flex justify-center shrink-0">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 hover:text-[#0F172A] transition flex items-center justify-center text-[#64748B] shadow-sm cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4.5 h-4.5" /> : <ChevronLeft className="w-4.5 h-4.5" />}
          </button>
        </div>
      )}
    </aside>
  );
}
