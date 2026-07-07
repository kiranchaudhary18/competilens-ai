import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
  AlertTriangle,
  ArrowLeft,
  Building2,
  Check,
  Download,
  Lightbulb,
  Newspaper,
  Share2,
  Star,
  X,
  Briefcase,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Panel } from "@/components/app/Panel";
import {
  actionPlan,
  competitors,
  featureMatrix,
  growthSeries,
  news,
  opportunities,
  pricingSeries,
  recommendations,
  reviews,
  risks,
  sentimentSeries,
  swot,
  history,
} from "@/data/mock";

export const Route = createFileRoute("/_app/reports/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} — Executive Report` }] }),
  component: ReportPage,
});

const chartColors = ["var(--success)", "var(--muted-foreground)", "var(--destructive)"];

// Custom mock for Hiring Trends
const hiringTrends = [
  { department: "Engineering", openRoles: 14, growth: "+24% YoY" },
  { department: "Sales & Marketing", openRoles: 12, growth: "+12% YoY" },
  { department: "Product & Design", openRoles: 5, growth: "+8% YoY" },
  { department: "Operations", openRoles: 3, growth: "Stable" },
];

function ReportPage() {
  const { id } = Route.useParams();
  const c = competitors.find((x) => x.id === id) ?? competitors[0];
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    alert(`Starting PDF download for ${c.name} Executive Report...`);
  };

  const tocItems = [
    { id: "summary", label: "Executive Summary" },
    { id: "swot", label: "SWOT Analysis" },
    { id: "pricing", label: "Pricing Analysis" },
    { id: "features", label: "Capability Matrix" },
    { id: "hiring", label: "Hiring Trends" },
    { id: "reviews", label: "Customer Reviews" },
    { id: "news", label: "Recent News" },
    { id: "recommendations", label: "AI recommendations" },
    { id: "timeline", label: "Event Timeline" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link to="/reports" className="inline-flex items-center gap-1 hover:text-foreground transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Reports
        </Link>
        <span>/</span>
        <span className="text-foreground">{c.name} Executive Briefinging</span>
      </div>

      {/* Notion style header card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[28px] border border-border bg-card shadow-card overflow-hidden relative"
      >
        {/* Cover Photo Gradient */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/10 relative">
          <div className="absolute inset-0 bg-grid opacity-15" />
        </div>

        {/* Logo Overlap */}
        <div className="relative px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12">
            <div className="w-20 h-20 rounded-[24px] bg-gradient-primary grid place-items-center text-3xl font-extrabold text-white shadow-card border-4 border-card relative z-10 select-none">
              {c.logo}
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-border bg-card hover:bg-accent/40 font-semibold text-xs transition cursor-pointer select-none"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "Copied URL!" : "Share Link"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 h-9 px-4.5 rounded-xl bg-gradient-primary text-white text-xs.5 font-bold shadow-glow hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition duration-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>

          {/* Heading Content */}
          <div className="mt-5 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
              Autonomous Intelligence brief · v3.0
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{c.name}</h1>
            <p className="text-sm.5 text-muted-foreground max-w-3xl leading-relaxed">{c.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Two Column layout */}
      <div className="grid lg:grid-cols-[1fr_260px] gap-8 items-start">
        
        {/* Left Side: Notion-like Document Content */}
        <div className="space-y-10">
          
          {/* Executive Summary */}
          <section id="summary" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Executive Summary
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Threat Score", value: c.score.toString(), sub: "+4 vs last check", color: "text-danger" },
                { label: "Est. ARR", value: c.arr, sub: `+${c.growth}% Growth`, color: "text-primary" },
                { label: "Sentiment", value: "62%", sub: "Net Positive", color: "text-success" },
                { label: "Indexed signals", value: "142", sub: "+28 last 30d", color: "text-secondary" },
              ].map((k) => (
                <div key={k.label} className="rounded-2xl border border-border bg-card/65 p-4.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {k.label}
                  </div>
                  <div className={`mt-2 text-2.5xl font-extrabold tracking-tight ${k.color}`}>{k.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{k.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Panel title="Market trajectory" subtitle="Competitor growth vs category median" padded={true}>
                <div className="h-56 mt-2">
                  <ResponsiveContainer>
                    <AreaChart data={growthSeries}>
                      <defs>
                        <linearGradient id="rp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                      <Area dataKey="you" name={c.name} stroke="var(--primary)" fill="url(#rp)" strokeWidth={2} />
                      <Area dataKey="market" name="Category median" stroke="var(--secondary)" fill="transparent" strokeWidth={2} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Sentiment share" subtitle="Based on 6,214 cross-channel mentions" padded={true}>
                <div className="h-56 mt-2">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={sentimentSeries} dataKey="value" innerRadius={42} outerRadius={70} paddingAngle={4}>
                        {sentimentSeries.map((_, i) => (
                          <Cell key={i} fill={chartColors[i]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          </section>

          {/* SWOT Analysis */}
          <section id="swot" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              SWOT Analysis
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Strengths", items: swot.strengths, tone: "success" },
                { title: "Weaknesses", items: swot.weaknesses, tone: "destructive" },
                { title: "Opportunities", items: swot.opportunities, tone: "primary" },
                { title: "Threats", items: swot.threats, tone: "warning" },
              ].map((s) => (
                <div key={s.title} className={`rounded-2xl border p-5 ${toneBg(s.tone)}`}>
                  <div className={`text-xs uppercase font-extrabold tracking-wider ${toneText(s.tone)}`}>
                    {s.title}
                  </div>
                  <ul className="mt-4.5 space-y-3.5 text-xs.5 leading-normal text-muted-foreground">
                    {s.items.map((it) => (
                      <li key={it} className="flex gap-2.5 items-start">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${toneDot(s.tone)}`} /> 
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Analysis */}
          <section id="pricing" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Pricing Analysis
            </h2>
            <div className="p-5 rounded-2xl border border-border bg-card/65 space-y-6">
              <p className="text-xs.5 text-muted-foreground leading-relaxed">
                Comparison of product tiers against our current pricing models (USD/month, per seat).
              </p>
              <div className="h-60">
                <ResponsiveContainer>
                  <BarChart data={pricingSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                    <XAxis dataKey="tier" stroke="var(--muted-foreground)" fontSize={10} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                    <Bar dataKey="you" name="You" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="competitor" name={c.name} fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Capability Matrix */}
          <section id="features" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Capability Matrix
            </h2>
            <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden divide-y divide-border">
              {featureMatrix.map((f) => (
                <div key={f.feature} className="grid grid-cols-3 items-center gap-4 px-5 py-3.5 text-sm">
                  <div className="font-bold text-slate-800 text-xs.5">{f.feature}</div>
                  <div className="flex items-center justify-center gap-2">
                    {f.you ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase">
                        <Check className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-danger/10 text-danger text-[10px] font-bold uppercase">
                        <X className="w-3 h-3" /> No
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {f.competitor ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase">
                        <Check className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-danger/10 text-danger text-[10px] font-bold uppercase">
                        <X className="w-3 h-3" /> No
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hiring Trends */}
          <section id="hiring" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Hiring Trends
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Panel title="Hiring Distribution" subtitle="Active job openings by business department" padded={true}>
                <div className="space-y-3.5 mt-2">
                  {hiringTrends.map((trend) => (
                    <div key={trend.department} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{trend.department}</span>
                        <span className="text-primary">{trend.openRoles} openings</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-primary rounded-full"
                          style={{ width: `${(trend.openRoles / 16) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Talent Movement Insights" subtitle="Autonomous Agent Recruitment Signal" padded={true}>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 text-xs.5 leading-relaxed text-muted-foreground">
                    <div className="flex items-center gap-2 font-bold text-warning mb-1">
                      <AlertTriangle className="w-4 h-4" /> Senior Engineering Churn
                    </div>
                    3 senior ML hires moved to competitor in the last 90 days. Aggressive salary premiums and flexible remote setups detected in recruiting campaigns.
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Department expansion: Engineering</div>
                      <div className="text-muted-foreground mt-0.5">Estimated talent acquisition growth +24% YoY.</div>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </section>

          {/* Customer Reviews */}
          <section id="reviews" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Customer Reviews
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border bg-card/65 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-0.5 text-warning">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 text-xs.5 text-muted-foreground italic leading-relaxed">
                      "{r.text}"
                    </p>
                  </div>
                  <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-3">
                    <span className="font-bold text-slate-700">{r.author}</span> · {r.role} <br />
                    <span className="text-[10px] uppercase font-semibold text-primary/80 mt-1 inline-block">{r.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent News */}
          <section id="news" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Recent News
            </h2>
            <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden divide-y divide-border">
              {news.map((n, i) => (
                <div key={i} className="flex items-start gap-4 p-4.5 hover:bg-accent/15 transition">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Newspaper className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800">{n.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {n.source} · {n.date}
                    </div>
                  </div>
                  <span
                    className={`text-[9.5px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider shrink-0 ${
                      n.sentiment === "positive"
                        ? "bg-success/10 text-success border-success/20"
                        : n.sentiment === "negative"
                          ? "bg-danger/10 text-danger border-danger/20"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {n.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* AI recommendations */}
          <section id="recommendations" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              AI Recommendations
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {recommendations.map((r) => (
                <div key={r.title} className="p-5 rounded-2xl border border-border bg-card/65 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                        {r.tag}
                      </span>
                      <Lightbulb className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <h3 className="text-sm.5 font-bold tracking-tight text-slate-800">{r.title}</h3>
                    <p className="text-xs.5 text-muted-foreground leading-relaxed">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Event Timeline */}
          <section id="timeline" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Competitor Event Timeline
            </h2>
            <div className="p-5 rounded-2xl border border-border bg-card/65 relative overflow-hidden">
              <div className="absolute left-9 top-8 bottom-8 w-[1px] bg-border" />
              <div className="space-y-6 relative z-10">
                {history.slice(0, 5).map((evt) => (
                  <div key={evt.id} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-primary shrink-0 relative z-20">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-muted-foreground">{evt.date}</div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">{evt.change}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Competitor: {evt.competitor} · ID: {evt.id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Right Side: Notion Page Metadata & Float TOC */}
        <aside className="sticky top-[96px] space-y-6 hidden lg:block">
          {/* Metadata Box */}
          <div className="p-4.5 rounded-2xl border border-border bg-card/45 space-y-3.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Document Details</div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-bold text-slate-800">{c.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HQ Location:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[120px]" title={c.hq}>{c.hq}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Founded:</span>
                <span className="font-bold text-slate-800">{c.founded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Staff size:</span>
                <span className="font-bold text-slate-800">{c.employees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-bold text-success">91% (High)</span>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="space-y-3.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>Table of Contents</span>
            </div>
            
            <nav className="space-y-1.5 text-xs.5 font-semibold text-muted-foreground border-l border-border/80">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block pl-3 py-1 hover:text-primary hover:border-l hover:border-primary -ml-[1px] transition duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

      </div>
    </div>
  );
}

function toneBg(t: string) {
  return t === "success"
    ? "border-success/20 bg-success/5"
    : t === "destructive"
      ? "border-destructive/20 bg-destructive/5"
      : t === "warning"
        ? "border-warning/20 bg-warning/5"
        : "border-primary/20 bg-primary/5";
}
function toneText(t: string) {
  return t === "success"
    ? "text-success"
    : t === "destructive"
      ? "text-destructive"
      : t === "warning"
        ? "text-warning"
        : "text-primary";
}
function toneDot(t: string) {
  return t === "success"
    ? "bg-success"
    : t === "destructive"
      ? "bg-destructive"
      : t === "warning"
        ? "bg-warning"
        : "bg-primary";
}
