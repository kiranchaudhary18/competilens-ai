import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import { StatCard } from "@/components/app/StatCard";
import { Panel } from "@/components/app/Panel";
import { useAuth } from "../components/AuthContext";

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
  const { user, accessToken } = useAuth();
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "x-workspace-id": user?.workspaceId || "",
        };

        // 1. Fetch Competitors
        const compRes = await fetch("http://localhost:5000/competitors", { headers });
        const compJson = await compRes.json();
        const compList = compJson.success ? compJson.data.competitors : [];

        // 2. Fetch Signals
        const sigRes = await fetch("http://localhost:5000/signals", { headers });
        const sigJson = await sigRes.json();
        const sigList = sigJson.success ? sigJson.data.signals : [];

        // 3. Fetch Statistics
        const statsRes = await fetch("http://localhost:5000/signals/statistics", { headers });
        const statsJson = await statsRes.json();
        const statsObj = statsJson.success ? statsJson.data.statistics : null;

        setCompetitors(compList);
        setSignals(sigList);
        setStatsData(statsObj);
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [accessToken, user?.workspaceId]);

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "User";

  // KPIs calculation
  const totalCompetitorsCount = competitors.length;
  const totalSignalsCount = statsData?.total || signals.length;
  const newSignalsCount = statsData?.byStatus?.NEW || 0;

  const kpis = [
    {
      label: "Competitors tracked",
      value: String(totalCompetitorsCount),
      delta: "",
      trend: undefined,
    },
    {
      label: "Signals collected",
      value: String(totalSignalsCount),
      delta: newSignalsCount > 0 ? `+${newSignalsCount} new` : "",
      trend: newSignalsCount > 0 ? ("up" as const) : undefined,
    },
    {
      label: "Avg. threat score",
      value: totalCompetitorsCount > 0 ? "68" : "0", // Default baseline threat or 0 if none
      delta: "",
      trend: undefined,
    },
  ];

  // Helper for relative time
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "just now";
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Loading workspace insights...</p>
      </div>
    );
  }

  // Sentiment distribution from statistics
  const sentimentData = [
    { name: "Low Severity", value: statsData?.bySeverity?.LOW || 0 },
    { name: "Medium Severity", value: statsData?.bySeverity?.MEDIUM || 0 },
    { name: "High Severity", value: statsData?.bySeverity?.HIGH || 0 },
    { name: "Critical Severity", value: statsData?.bySeverity?.CRITICAL || 0 },
  ].filter((d) => d.value > 0);

  // If no severity data, fallback empty placeholder data
  const hasSentiment = sentimentData.length > 0;

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
              Monitoring {totalCompetitorsCount} competitors · {totalSignalsCount} signals this week
            </div>

            <h1 className="mt-5 page-title">Good morning, {firstName}</h1>
            <p className="mt-3 body-text text-muted-foreground max-w-xl">
              Your AI research team has been monitoring competitors while you were away. Here’s the
              executive-ready brief of what matters.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl glass text-[15px] font-semibold hover:bg-accent/40 transition">
                <Sparkles className="w-4 h-4 text-primary" /> Ask AI
              </button>
              <Link
                to="/reports"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-gradient-primary text-primary-foreground text-[15px] font-semibold shadow-glow hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition"
              >
                <Plus className="w-4 h-4" /> Add competitor
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

      {/* KPI cards */}
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
          className="premium-card animate-fade-in"
        >
          {competitors.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart
                  data={[
                    { month: "Jan", market: 30 },
                    { month: "Feb", market: 35 },
                    { month: "Mar", market: 40 },
                    { month: "Apr", market: 45 },
                  ]}
                >
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
                    dataKey="market"
                    name="Market Median"
                    stroke="var(--secondary)"
                    fill="url(#mkt)"
                    strokeWidth={2}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6">
              <Activity className="w-10 h-10 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">Not enough data to display growth</p>
              <p className="text-xs text-muted-foreground/75 mt-1">Add competitors to begin tracking market intelligence.</p>
            </div>
          )}
        </Panel>

        <Panel title="Threat distribution" subtitle="Signals clustered by severity">
          {hasSentiment ? (
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {sentimentData.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} stroke="transparent" />
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
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6">
              <Target className="w-10 h-10 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-semibold text-muted-foreground">No threats detected</p>
              <p className="text-xs text-muted-foreground/75 mt-1">Signals will be automatically classified by severity.</p>
            </div>
          )}
        </Panel>
      </div>

      {/* Latest AI Findings / Signals */}
      <Panel
        title="Latest findings"
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
          {signals.length > 0 ? (
            <div className="space-y-3">
              {signals.slice(0, 4).map((n, i) => (
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
                        <span className="text-xs text-muted-foreground shrink-0">{getRelativeTime(n.capturedAt)}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Classified as <span className="text-primary font-semibold">{n.type}</span> ·
                        severity {n.severity}
                      </div>
                      {n.summary && <div className="mt-2 text-xs text-muted-foreground/80 leading-relaxed">{n.summary}</div>}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] px-2 py-1 rounded-full border border-border bg-muted text-muted-foreground">
                          {n.source || "Web Monitor"}
                        </span>
                        {n.url && (
                          <a
                            href={n.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-xs font-semibold text-primary hover:opacity-80 transition flex items-center gap-1"
                          >
                            Open source →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-[20px] border border-border/80 my-4">
              <Bell className="w-8 h-8 text-muted-foreground/60 mb-2 animate-pulse" />
              <p className="text-sm font-semibold text-muted-foreground">No signals captured yet</p>
              <p className="text-xs text-muted-foreground/75 mt-1 max-w-sm">
                Set up competitor profiles to start capturing real-time updates and website changes.
              </p>
            </div>
          )}
        </div>
      </Panel>

      {/* Tracked competitors */}
      <Panel title="Tracked competitors" subtitle="Your workspace competitors list" padded={false}>
        {competitors.length > 0 ? (
          <div className="divide-y divide-border">
            {competitors.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to="/reports/$id"
                params={{ id: c.id }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-primary grid place-items-center text-sm font-semibold text-primary-foreground shrink-0 select-none">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold tracking-tight truncate">{c.name}</div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                      {c.industry || "General"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{c.description || c.domain}</div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-sm font-semibold text-primary">{c.status}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-[20px] border border-border/80 my-4">
            <Target className="w-8 h-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-semibold text-muted-foreground">No competitors tracked yet</p>
            <p className="text-xs text-muted-foreground/75 mt-1 max-w-sm mb-4">
              Add your first competitor profile to monitor their website, technologies, and hiring trends.
            </p>
            <Link
              to="/reports"
              className="inline-flex h-9 items-center justify-center px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
            >
              Add Competitor
            </Link>
          </div>
        )}
      </Panel>
    </div>
  );
}
