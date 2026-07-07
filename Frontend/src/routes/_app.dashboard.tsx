import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  Globe,
  MessageSquare,
  Newspaper,
  Plus,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Panel } from "@/components/app/Panel";
import { competitors, growthSeries, notifications, sentimentSeries, stats } from "@/data/mock";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CompetiLens AI" }] }),
  component: Dashboard,
});

const chartColors = [
  "var(--primary)",
  "var(--secondary)",
  "var(--warning)",
  "var(--success)",
  "var(--chart-5)",
];

function Dashboard() {
  const kpis = [stats[0], stats[3], stats[1]].filter(Boolean);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-card premium-card">
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
        <div className="absolute -top-16 -right-20 w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-[460px] h-[460px] rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative p-6 sm:p-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Monitoring 24 competitors · 1,284 signals this week
            </div>

            <h1 className="mt-5 page-title">Good morning, Alex</h1>
            <p className="mt-3 body-text text-muted-foreground max-w-xl">
              Your AI research team has been monitoring competitors while you were away. Here’s the
              executive-ready brief of what matters.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl glass text-[15px] font-semibold hover:bg-accent/40 transition">
                <Sparkles className="w-4 h-4 text-primary" /> Ask AI
              </button>
              <Link
                to="/analysis"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-gradient-primary text-primary-foreground text-[15px] font-semibold shadow-glow hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition"
              >
                <Plus className="w-4 h-4" /> New analysis
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl border border-border bg-card/60 hover:bg-accent/40 transition text-[15px] font-semibold"
              >
                View reports <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </motion.div>

          {/* AI illustration */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative"
          >
            <div className="rounded-[24px] glass shadow-card p-5 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold tracking-tight">AI Agents</div>
                <div className="text-xs text-muted-foreground">6 running</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { icon: Search, name: "Research", tone: "primary" },
                  { icon: Globe, name: "Website", tone: "secondary" },
                  { icon: Newspaper, name: "News", tone: "warning" },
                  { icon: MessageSquare, name: "Review", tone: "success" },
                  { icon: Brain, name: "Analysis", tone: "primary" },
                  { icon: Target, name: "Strategy", tone: "secondary" },
                ].map((a, i) => (
                  <motion.div
                    key={a.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.04 }}
                    className="rounded-2xl border border-border bg-card/70 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 grid place-items-center">
                          <a.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-sm font-medium truncate">{a.name}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${70 + i * 4}%` }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        className="h-full bg-gradient-primary"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-primary/10 blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-secondary/10 blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* 3 KPI cards only */}
      <div className="grid lg:grid-cols-3 gap-4">
        {kpis.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      {/* Market Intelligence + Threat Distribution */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <Panel
          title="Market intelligence"
          subtitle="Growth trajectory vs. category median"
          className="premium-card"
        >
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={growthSeries}>
                <defs>
                  <linearGradient id="you" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mkt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.06)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    fontSize: 12,
                  }}
                />
                <Area
                  dataKey="you"
                  name="You"
                  stroke="var(--primary)"
                  fill="url(#you)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="market"
                  name="Market"
                  stroke="var(--secondary)"
                  fill="url(#mkt)"
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Threat distribution" subtitle="Signals clustered by sentiment">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sentimentSeries}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {sentimentSeries.map((_, i) => (
                    <Cell key={i} fill={chartColors[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Latest AI Findings */}
      <Panel
        title="Latest AI findings"
        subtitle="Signals that changed your competitive position"
        padded={false}
      >
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="w-4 h-4 text-primary" />
            Live feed · curated by agents
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-primary hover:opacity-80 transition"
          >
            View timeline →
          </Link>
        </div>

        <div className="px-5 pb-5">
          <div className="space-y-3">
            {notifications.slice(0, 4).map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-3xl border border-border bg-card/70 shadow-card p-4 hover:-translate-y-0.5 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 grid place-items-center shrink-0">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold tracking-tight truncate">{n.title}</div>
                      <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Classified as <span className="text-primary font-semibold">{n.type}</span> ·
                      confidence 0.91
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground">
                        AI highlight
                      </span>
                      <span className="text-[11px] px-2 py-1 rounded-full border border-border bg-card text-muted-foreground">
                        Source-linked
                      </span>
                      <Link
                        to="/reports"
                        className="ml-auto text-xs font-semibold text-primary hover:opacity-80 transition"
                      >
                        Open report →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Tracked competitors (kept, but visually quieter) */}
      <Panel title="Tracked competitors" subtitle="Sorted by threat score" padded={false}>
        <div className="divide-y divide-border">
          {competitors.slice(0, 5).map((c) => (
            <Link
              key={c.id}
              to="/reports/$id"
              params={{ id: c.id }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-accent/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary grid place-items-center text-sm font-semibold text-primary-foreground">
                {c.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold tracking-tight truncate">{c.name}</div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {c.industry}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{c.summary}</div>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs text-muted-foreground">Threat</div>
                <div className="text-sm font-semibold">{c.score}</div>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
