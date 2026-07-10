import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Sparkles, LayoutGrid, Target, Radio, Search, FileText, Brain,
  History as HistoryIcon, Bell, Settings, User,
} from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/competitors", label: "Competitors", icon: Target },
  { to: "/signals", label: "Signals", icon: Radio },
  { to: "/analysis", label: "Analysis", icon: Search },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/memory", label: "Memory", icon: Brain },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ crumb, children }: { crumb: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-screen bg-[#060A12] text-white">
      {/* Ambient background gradients (Top-Right: Blue glow, Bottom-Left: Purple glow) */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(79,124,255,0.12),transparent_70%),radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.12),transparent_70%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-fade opacity-30" />

      {/* Sidebar - Floating, Glass, Rounded 32px */}
      <aside className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <div className="glass flex flex-col items-center gap-1 rounded-[32px] px-2.5 py-5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] border border-white/5 bg-slate-950/40 backdrop-blur-xl">
          <Link to="/dashboard" className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#22D3EE] shadow-[0_0_25px_-5px_rgba(56,189,248,0.5)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300">
            <Sparkles className="h-5 w-5 text-[#060A12]" strokeWidth={2.5} />
          </Link>
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link key={to} to={to} title={label}
                className={`group relative grid h-11 w-11 place-items-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${active ? "text-[#38BDF8]" : "text-slate-400 hover:text-white"}`}>
                {active && (
                  <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.22),transparent_70%)]" />
                )}
                <Icon className="relative h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" strokeWidth={active ? 1.8 : 1.5} />
                {active && <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-2 rounded-full bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]" />}
              </Link>
            );
          })}
          <div className="mx-2 my-2 h-px w-6 bg-white/5" />
          <div className="group relative">
            <button className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-300 border border-emerald-500/20 hover:border-[#22C55E]/40 hover:scale-105 active:scale-95 transition-all duration-300">
              <span className="font-mono text-xs font-semibold">N</span>
            </button>
            {/* Hover logout popup */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
              <div className="glass-strong rounded-2xl p-1.5 shadow-2xl border border-white/10 min-w-[120px] bg-[#0B1220]/95 backdrop-blur-2xl">
                <div className="px-2 py-1 border-b border-white/5 mb-1 select-none">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Narvin</div>
                </div>
                <Link to="/login" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Top bar - Floating, Glass, Thin border */}
      <header className="sticky top-0 z-30 px-4 pt-4 md:pl-28 md:pr-8">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4">
          <Link to="/" className="flex items-center gap-2 select-none">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#22D3EE] shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-white/10">
              <Sparkles className="h-4.5 w-4.5 text-[#060A12]" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base font-bold tracking-tight text-white">CompetiLens</span>
          </Link>

          <div className="ml-auto flex flex-1 items-center justify-center">
            {/* Search bar with glowing focus ring */}
            <div className="glass flex w-full max-w-xl items-center gap-3 rounded-full px-4 py-2.5 bg-slate-950/20 border border-white/5 focus-within:ring-2 focus-within:ring-[#38BDF8]/20 focus-within:border-[#38BDF8]/40 transition-all duration-300">
              <Search className="h-4 w-4 text-slate-400 focus-within:text-[#38BDF8] transition-colors" />
              <input placeholder="Search competitors, signals, evidence…" className="flex-1 bg-transparent text-sm placeholder:text-slate-500 focus:outline-none text-white" />
              <kbd className="hidden font-mono text-[9px] text-slate-500 sm:inline border border-white/15 rounded px-1.5 py-0.5 bg-white/5">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="glass hidden items-center gap-2 rounded-full px-3 py-2 sm:flex border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#22C55E] font-bold">Live</span>
            </div>

            {/* Notification bell with bounce effect */}
            <Link to="/alerts" className="glass relative grid h-10 w-10 place-items-center rounded-full border border-white/5 hover:border-[#38BDF8]/30 hover:text-[#38BDF8] transition-all duration-300 hover:scale-105 active:scale-95">
              <Bell className="h-4 w-4 text-slate-300 hover:animate-bounce" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
            </Link>

            {/* Profile Avatar with premium ring */}
            <div className="group relative">
              <button className="glass grid h-10 w-10 place-items-center rounded-full border border-white/5 hover:border-[#38BDF8]/40 hover:text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all duration-300 hover:scale-105 active:scale-95">
                <User className="h-4 w-4 text-slate-300" />
              </button>
              {/* Hover logout popup */}
              <div className="absolute right-0 top-12 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                <div className="glass-strong rounded-2xl p-1.5 shadow-2xl border border-white/10 min-w-[120px] bg-[#0B1220]/95 backdrop-blur-2xl">
                  <div className="px-2 py-1 border-b border-white/5 mb-1 select-none">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Narvin</div>
                  </div>
                  <Link to="/login" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors">
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pb-24 pt-8 md:pl-28 md:pr-8">
        <div className="mx-auto max-w-[1500px] animate-fade-up">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, highlight, subtitle, right }: { eyebrow: string; title: string; highlight?: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500">{eyebrow}</div>
        <h1 className="font-display text-4xl leading-[1.1] tracking-tight md:text-5xl">
          {title}{" "}
          {highlight && <span className="font-display italic text-gradient-cyan">{highlight}</span>}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-slate-400">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
