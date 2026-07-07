import { Link } from "@tanstack/react-router";
import {
  Bell,
  Command,
  Search,
  Settings,
  User,
  Zap,
  LogOut,
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
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-card/70 backdrop-blur-xl">
      <div className="h-[72px] px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Logo (visible on mobile, and on desktop if sidebar is collapsed) */}
        <div className={`flex items-center gap-3 shrink-0 ${!sidebarCollapsed ? "lg:hidden" : "lg:flex"}`}>
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Zap className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">CompetiLens</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-semibold">
              AI
            </span>
          </Link>
        </div>

        {/* Center: Global AI search */}
        <div className="flex-1 flex items-center justify-center max-w-[640px] mx-auto">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                aria-label="Global search"
                placeholder="AI Search… competitors, reports, signals"
                className="w-full h-11 pl-11 pr-20 rounded-2xl glass shadow-card text-[15px] placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border/80 bg-card/70 text-[11px] text-muted-foreground select-none">
                <Command className="w-3 h-3" /> K
              </kbd>
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[42px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-primary shadow-glow"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions (Notifications and Profile) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative w-11 h-11 grid place-items-center rounded-2xl border border-border bg-card/60 hover:bg-accent/40 hover:text-foreground transition text-muted-foreground"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>

          {/* User Menu Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="User menu"
                className="w-11 h-11 rounded-2xl border border-border bg-card/60 hover:bg-accent/40 transition flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span className="w-8.5 h-8.5 rounded-xl bg-gradient-primary grid place-items-center text-[13px] font-bold text-primary-foreground shadow-glow">
                  AK
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass shadow-card rounded-2xl p-1.5 border border-border/85">
              <DropdownMenuLabel className="px-2.5 py-2">
                <div className="text-sm font-semibold">Alex Kim</div>
                <div className="text-xs text-muted-foreground mt-0.5">alex@competilens.ai</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem className="gap-2.5 rounded-xl px-2.5 py-2 cursor-pointer hover:bg-accent/40">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 rounded-xl px-2.5 py-2 cursor-pointer hover:bg-accent/40">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem className="gap-2.5 rounded-xl px-2.5 py-2 text-danger hover:bg-danger/5 cursor-pointer">
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
