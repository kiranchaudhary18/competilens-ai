import { Link } from "@tanstack/react-router";
import { useAuth } from "../AuthContext";
import {
  Bell,
  Command,
  Search,
  Settings,
  User,
  Zap,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  sidebarCollapsed?: boolean;
}

export function Topbar({ sidebarCollapsed = false }: TopbarProps) {
  const { user, logout } = useAuth();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "US";

  const roleLabel = user?.role === "OWNER" ? "Owner" : user?.role === "ADMIN" ? "Admin" : "Member";
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="h-[74px] px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand logo toggle (visible on mobile / tablet or collapsed sidebar state) */}
        <div className={`flex items-center gap-3.5 shrink-0 ${!sidebarCollapsed ? "lg:hidden" : "lg:flex"}`}>
          {/* Mobile menu trigger */}
          <button className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] transition cursor-pointer">
            <Menu className="w-4.5 h-4.5" />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2 select-none">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-md shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-sm text-[#0F172A] hidden sm:inline-block">CompetiLens</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/25 uppercase font-bold tracking-wider hidden sm:inline-block">
              AI
            </span>
          </Link>
        </div>

        {/* Center: Global AI search bar */}
        <div className="flex-1 flex items-center justify-start max-w-[560px] relative">
          <div className="w-full relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            
            <input
              type="text"
              aria-label="Global search"
              placeholder="Search competitors, reports, signals..."
              className="w-full h-10 pl-10 pr-16 rounded-full border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs.5 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition duration-200 placeholder:text-[#64748B]/70 shadow-sm"
            />
            
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 rounded border border-[#E2E8F0] bg-white text-[9px] font-bold text-[#64748B] select-none shadow-sm">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>

            {/* Glowing Search indicator */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[38px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_6px_#2563EB] pointer-events-none"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Notifications bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
            className="relative w-9.5 h-9.5 flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] transition duration-200 cursor-pointer shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#10B981] border border-white animate-pulse" />
          </motion.button>

          {/* User profile dropdown trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="User menu"
                className="group flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 transition duration-200 shrink-0 cursor-pointer shadow-sm"
              >
                <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-xs font-extrabold text-white shadow-sm shrink-0">
                  {initials}
                </div>
                <div className="hidden md:flex flex-col items-start leading-none">
                  <span className="text-xs font-bold text-[#0F172A]">{user?.fullName || "User"}</span>
                  <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">{roleLabel}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0F172A] transition" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-1.5 border border-[#E2E8F0]">
              <DropdownMenuLabel className="px-2.5 py-2">
                <div className="text-xs.5 font-bold text-[#0F172A]">{user?.fullName || "User"}</div>
                <div className="text-[10px] font-semibold text-[#64748B] mt-0.5">{user?.email || ""}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#E2E8F0]" />
              <DropdownMenuItem asChild className="gap-2 rounded-xl px-2.5 py-2 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer hover:bg-slate-50">
                <Link to="/settings" className="flex items-center gap-2 w-full">
                  <User className="w-4 h-4 text-[#64748B]" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2 rounded-xl px-2.5 py-2 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer hover:bg-slate-50">
                <Link to="/settings" className="flex items-center gap-2 w-full">
                  <Settings className="w-4 h-4 text-[#64748B]" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#E2E8F0]" />
              <DropdownMenuItem
                onClick={logout}
                className="gap-2 rounded-xl px-2.5 py-2 text-xs.5 font-bold text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

      </div>
    </header>
  );
}
