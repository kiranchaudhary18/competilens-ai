import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
  GitCompare,
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  ArrowUpRight,
  Activity,
  Award,
  AlertCircle,
  Database,
  Search,
  Download,
  ShieldCheck,
  Zap,
  DollarSign,
  Users,
  Globe,
  MessageSquare,
  FileText,
  TrendingDown,
  Maximize2,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/_app/memory")({
  head: () => ({ meta: [{ title: "Memory Intelligence Center — CompetiLens AI" }] }),
  component: MemoryPage,
});

// Rich competitor snapshot records
const competitorMemory: Record<string, {
  category: string;
  snapshots: {
    id: string;
    date: string;
    stats: {
      threatScore: number;
      traffic: string;
      revenue: string;
      employees: string;
      funding: string;
      pricing: string;
      features: number;
      reviews: string;
      pages: number;
      apiChanges: number;
    };
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  }[];
}> = {
  Linear: {
    category: "Project Management",
    snapshots: [
      {
        id: "snap-a",
        date: "Aug 12, 2026",
        stats: {
          threatScore: 84,
          traffic: "1.2M",
          revenue: "$41M",
          employees: "160",
          funding: "$45M",
          pricing: "$8/user",
          features: 42,
          reviews: "4.6/5",
          pages: 340,
          apiChanges: 3,
        },
        swot: {
          strengths: ["Opinionated clean workspace UX", "Fast keyboard navigation bindings", "Strong organic developer loyalty"],
          weaknesses: ["Shallow reporting and advanced PM analytics", "Limited native integrations outside dev tools"],
          opportunities: ["Expand into portfolio resource management", "Build first-class AI meeting transcription summary bundle"],
          threats: ["Notion aggressively adding task/PM capability", "Jira shipping lighter design system alternatives"],
        }
      },
      {
        id: "snap-b",
        date: "Nov 12, 2026",
        stats: {
          threatScore: 92,
          traffic: "1.5M",
          revenue: "$52M",
          employees: "180",
          funding: "$125M",
          pricing: "$10/user",
          features: 56,
          reviews: "4.8/5",
          pages: 420,
          apiChanges: 9,
        },
        swot: {
          strengths: ["Opinionated clean workspace UX", "Fast keyboard navigation bindings", "Strong organic developer loyalty", "High shipping velocity of ML features"],
          weaknesses: ["Shallow reporting and advanced PM analytics"],
          opportunities: ["Expand into portfolio resource management", "Build first-class AI meeting transcription summary bundle", "Enterprise billing localization expansion"],
          threats: ["Notion aggressively adding task/PM capability", "Jira shipping lighter design system alternatives", "Poaching of core ML engineering talent"],
        }
      }
    ]
  },
  Notion: {
    category: "Productivity & Workspace",
    snapshots: [
      {
        id: "snap-a",
        date: "Jul 30, 2026",
        stats: {
          threatScore: 82,
          traffic: "12.4M",
          revenue: "$420M",
          employees: "550",
          funding: "$350M",
          pricing: "$10/user",
          features: 128,
          reviews: "4.5/5",
          pages: 1800,
          apiChanges: 14,
        },
        swot: {
          strengths: ["Infinite customization databases", "Vast community template sharing network"],
          weaknesses: ["Loading latency issues on massive databases", "Relatively steep beginner user learning curves"],
          opportunities: ["Deploy offline-first cached desktop capabilities", "Roll out automatic AI meeting transcriptions"],
          threats: ["Microsoft Loop bundled directly into Office suites", "Coda capturing highly formulaic data tables usage"],
        }
      },
      {
        id: "snap-b",
        date: "Nov 09, 2026",
        stats: {
          threatScore: 87,
          traffic: "14.1M",
          revenue: "$500M",
          employees: "600",
          funding: "$350M",
          pricing: "$12/user",
          features: 141,
          reviews: "4.7/5",
          pages: 2100,
          apiChanges: 22,
        },
        swot: {
          strengths: ["Infinite customization databases", "Vast community template sharing network", "Integrated native Notion calendar app"],
          weaknesses: ["Loading latency issues on massive databases"],
          opportunities: ["Deploy offline-first cached desktop capabilities", "Roll out automatic AI meeting transcriptions", "Team database localization modules"],
          threats: ["Microsoft Loop bundled directly into Office suites", "Coda capturing highly formulaic data tables usage", "Unified markdown clones gaining momentum"],
        }
      }
    ]
  },
  Vercel: {
    category: "Developer Infrastructure",
    snapshots: [
      {
        id: "snap-a",
        date: "Aug 01, 2026",
        stats: {
          threatScore: 86,
          traffic: "8.2M",
          revenue: "$110M",
          employees: "480",
          funding: "$313M",
          pricing: "$20/user",
          features: 64,
          reviews: "4.7/5",
          pages: 980,
          apiChanges: 18,
        },
        swot: {
          strengths: ["Global edge CDN response times", "Next.js ecosystem hegemony", "Excellent developer experience DX"],
          weaknesses: ["Egress pricing model bandwidth shock issues"],
          opportunities: ["Build integrated AI code playground models v0", "Aggressively capture serverless GPU deployments"],
          threats: ["Netlify acquiring complementary database layers", "Cloudflare Pages simplifying custom SSR endpoints"],
        }
      },
      {
        id: "snap-b",
        date: "Nov 05, 2026",
        stats: {
          threatScore: 90,
          traffic: "9.6M",
          revenue: "$140M",
          employees: "520",
          funding: "$313M",
          pricing: "$20/user",
          features: 78,
          reviews: "4.8/5",
          pages: 1120,
          apiChanges: 26,
        },
        swot: {
          strengths: ["Global edge CDN response times", "Next.js ecosystem hegemony", "Excellent developer experience DX", "v0.dev AI generation adoption metrics"],
          weaknesses: ["Egress pricing model bandwidth shock issues", "Cold starts on complex edge middleware functions"],
          opportunities: ["Build integrated AI code playground models v0", "Aggressively capture serverless GPU deployments", "Edge analytics reporting packages"],
          threats: ["Netlify acquiring complementary database layers", "Cloudflare Pages simplifying custom SSR endpoints", "Local-first dev environments bypassing CDN deploy flow"],
        }
      }
    ]
  }
};

const changeGridCards = [
  { label: "Pricing", count: 3, confidence: 99, sources: 2, icon: DollarSign },
  { label: "Website", count: 18, confidence: 96, sources: 4, icon: Globe },
  { label: "Product", count: 7, confidence: 98, sources: 3, icon: Zap },
  { label: "Features", count: 14, confidence: 99, sources: 3, icon: Sparkles },
  { label: "Hiring", count: 12, confidence: 95, sources: 2, icon: Users },
  { label: "Funding", count: 1, confidence: 100, sources: 5, icon: TrendingUp },
  { label: "Leadership", count: 2, confidence: 97, sources: 2, icon: Users },
  { label: "Reviews", count: 42, confidence: 94, sources: 4, icon: MessageSquare },
  { label: "Security", count: 1, confidence: 99, sources: 1, icon: ShieldCheck },
  { label: "Integrations", count: 4, confidence: 98, sources: 2, icon: Zap },
  { label: "Legal", count: 1, confidence: 96, sources: 3, icon: FileText },
  { label: "Traffic", count: 6, confidence: 95, sources: 1, icon: Activity },
];

export function MemoryPage() {
  const [competitor, setCompetitor] = useState("Linear");
  const [snapDateA, setSnapDateA] = useState("Aug 12, 2026");
  const [snapDateB, setSnapDateB] = useState("Nov 12, 2026");
  const [isMemoryAvailable, setIsMemoryAvailable] = useState(true);

  const selectedCompData = competitorMemory[competitor] || competitorMemory.Linear;
  const dates = selectedCompData.snapshots.map((s) => s.date);

  const snapAObj = selectedCompData.snapshots.find((s) => s.date === snapDateA) || selectedCompData.snapshots[0];
  const snapBObj = selectedCompData.snapshots.find((s) => s.date === snapDateB) || selectedCompData.snapshots[1];

  const handleCompetitorChange = (val: string) => {
    setCompetitor(val);
    const targetCompData = competitorMemory[val] || competitorMemory.Linear;
    setSnapDateA(targetCompData.snapshots[0].date);
    setSnapDateB(targetCompData.snapshots[1].date);
  };

  const calculateChange = (prev: number | string, curr: number | string) => {
    const pVal = parseFloat(prev.toString().replace(/[^0-9.]/g, ""));
    const cVal = parseFloat(curr.toString().replace(/[^0-9.]/g, ""));
    if (isNaN(pVal) || isNaN(cVal)) return null;
    const diff = cVal - pVal;
    const pct = ((diff / pVal) * 100).toFixed(1);
    return {
      diff: diff > 0 ? `+${diff}` : diff.toString(),
      pct: diff > 0 ? `+${pct}%` : `${pct}%`,
      isPositive: diff >= 0,
    };
  };

  if (!isMemoryAvailable) {
    return (
      <div className="min-h-[550px] flex items-center justify-center p-8 bg-[#F8FAFC]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center space-y-5"
        >
          <div className="w-14 h-14 rounded-full bg-slate-50 border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#64748B]">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-[#0F172A]">No Memory Available</h3>
            <p className="text-xs.5 text-[#64748B] font-semibold leading-relaxed">
              Run your first AI analysis to generate intelligent snapshots and build competitive history profiles.
            </p>
          </div>
          <button
            onClick={() => setIsMemoryAvailable(true)}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <span>Start Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1320px] mx-auto text-[#0F172A] font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2.5 max-w-2xl"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-full border border-[#2563EB]/15">
            AI Memory
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Memory Intelligence Center
          </h1>
          <p className="text-sm font-semibold text-[#64748B] leading-relaxed">
            Compare historical AI snapshots to understand how competitors evolved over time. Analyze pricing, features, hiring, product launches, and strategic shifts from one unified intelligence system.
          </p>
        </motion.div>

        {/* Floating summary card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full sm:w-[420px] rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm grid grid-cols-2 gap-4 shrink-0"
        >
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Snapshots Compared</span>
            <div className="text-xl font-extrabold text-[#0F172A] mt-0.5">126</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Tracked Companies</span>
            <div className="text-xl font-extrabold text-[#0F172A] mt-0.5">24</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Detected Changes</span>
            <div className="text-xl font-extrabold text-[#2563EB] mt-0.5">184</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">AI Confidence</span>
            <div className="text-xl font-extrabold text-[#10B981] mt-0.5">98%</div>
          </div>
        </motion.div>
      </div>

      {/* COMPARE PANEL & HORIZONTAL TIMELINE */}
      <div className="bg-white/80 border border-[#E2E8F0] rounded-3xl p-5 shadow-sm space-y-6">
        
        <div className="grid sm:grid-cols-4 gap-4 items-end">
          {/* Selector 1 */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Select Competitor</label>
            <div className="relative">
              <GitCompare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2563EB]" />
              <select
                value={competitor}
                onChange={(e) => handleCompetitorChange(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#0F172A] focus:outline-none cursor-pointer appearance-none transition"
              >
                {Object.keys(competitorMemory).map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
          </div>

          {/* Selector 2 */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Snapshot A</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <select
                value={snapDateA}
                onChange={(e) => setSnapDateA(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#0F172A] focus:outline-none cursor-pointer appearance-none transition"
              >
                {dates.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
          </div>

          {/* Selector 3 */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Snapshot B</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <select
                value={snapDateB}
                onChange={(e) => setSnapDateB(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#0F172A] focus:outline-none cursor-pointer appearance-none transition"
              >
                {dates.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
          </div>

          {/* Compare Button */}
          <button
            onClick={() => {}}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Snapshots</span>
          </button>
        </div>

        {/* Snapshot Timeline Visual */}
        <div className="border-t border-[#E2E8F0] pt-5">
          <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider block mb-4">Memory Timeline</span>
          <div className="flex items-center justify-between max-w-xl relative pl-2">
            <div className="absolute left-4 right-4 h-0.5 bg-[#E2E8F0] top-1/2 -translate-y-1/2 z-0" />
            {[
              { label: "Snapshot A", date: snapDateA, active: true },
              { label: "Snapshot B", date: snapDateB, active: true },
              { label: "Today", date: "Present", active: false }
            ].map((node, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-4 h-4 rounded-full border border-white ring-4 ${
                  node.active ? "bg-[#2563EB] ring-blue-100" : "bg-slate-200 ring-slate-100"
                }`} />
                <span className="text-[10px] font-bold text-[#0F172A] mt-1.5">{node.label}</span>
                <span className="text-[9px] text-[#64748B] font-semibold">{node.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* DUAL COLUMN SECTION */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          
          {/* AI SUMMARY BOX */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">AI Executive Recommendation</h3>
            </div>
            
            <div className="grid sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/50 border border-[#E2E8F0]">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Overall Threat</span>
                <div className="text-xs.5 font-extrabold text-red-650 flex items-center gap-1 mt-0.5">
                  <Activity className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>High Threat</span>
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Pricing Shift</span>
                <div className="text-xs.5 font-extrabold text-amber-600 mt-0.5">Seat pricing +25%</div>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Hiring Momentum</span>
                <div className="text-xs.5 font-extrabold text-[#2563EB] mt-0.5">Growing rapidly (+12)</div>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Last Crawl</span>
                <div className="text-xs.5 font-extrabold text-[#10B981] mt-0.5">100% verified</div>
              </div>
            </div>

            <p className="text-xs.5 font-medium leading-relaxed text-[#64748B]">
              <span className="font-extrabold text-[#0F172A]">{competitor}</span> has exhibited notable ARR gains and expanded their feature surface between these snapshots. We recommend monitoring their marketing pages weekly to capture further shifts in project delivery.
            </p>
          </div>

          {/* METRIC COMPARISON CARDS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">Metric Comparison</h3>
              <span className="text-[10px] text-[#64748B] font-bold">Snapshot Diff Data</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Threat Score", key: "threatScore", sparkline: "M0 15 Q 15 5, 30 18 T 60 4", color: "stroke-[#EF4444]" },
                { label: "Monthly Web Traffic", key: "traffic", sparkline: "M0 18 Q 15 20, 30 10 T 60 6", color: "stroke-[#06B6D4]" },
                { label: "Estimated Revenue", key: "revenue", sparkline: "M0 16 Q 15 14, 30 10 T 60 5", color: "stroke-[#10B981]" },
                { label: "Employees count", key: "employees", sparkline: "M0 15 Q 15 15, 30 12 T 60 7", color: "stroke-[#2563EB]" },
                { label: "Total Funding Raised", key: "funding", sparkline: "M0 18 Q 15 18, 30 18 T 60 4", color: "stroke-[#8B5CF6]" },
                { label: "Base Seat Pricing", key: "pricing", sparkline: "M0 16 Q 15 16, 30 10 T 60 8", color: "stroke-[#F59E0B]" },
                { label: "Features Indexed", key: "features", sparkline: "M0 19 Q 15 14, 30 10 T 60 4", color: "stroke-[#10B981]" },
                { label: "Reviews Score", key: "reviews", sparkline: "M0 12 Q 15 10, 30 8 T 60 5", color: "stroke-[#06B6D4]" },
              ].map((metric) => {
                const prev = snapAObj.stats[metric.key as keyof typeof snapAObj.stats];
                const curr = snapBObj.stats[metric.key as keyof typeof snapBObj.stats];
                const change = calculateChange(prev, curr);

                return (
                  <div key={metric.label} className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_6px_rgba(0,0,0,0.01)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex justify-between items-center">
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#64748B]">{prev}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="text-sm font-extrabold text-[#0F172A]">{curr}</span>
                      </div>
                      
                      {change && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9.5px] font-bold ${
                          change.isPositive ? "bg-emerald-50 text-[#10B981]" : "bg-red-50 text-[#EF4444]"
                        }`}>
                          {change.diff} ({change.pct})
                        </span>
                      )}
                    </div>

                    {/* Sparkline Graph */}
                    <div className="w-16 h-8 flex items-center justify-center shrink-0">
                      <svg className="w-16 h-8 stroke-2 fill-none overflow-visible">
                        <path d={metric.sparkline} className={metric.color} />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI SWOT ANALYSIS */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">SWOT Intelligence Delta</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Strengths */}
              <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-[#10B981]" />
                    <h4 className="text-xs.5 font-extrabold text-[#10B981] uppercase tracking-wider">Strengths</h4>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-bold">98% Match</span>
                </div>
                <div className="space-y-2">
                  {snapBObj.swot.strengths.map((str, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-[#64748B] font-semibold leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4.5 h-4.5 text-[#EF4444]" />
                    <h4 className="text-xs.5 font-extrabold text-[#EF4444] uppercase tracking-wider">Weaknesses</h4>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-bold">95% Match</span>
                </div>
                <div className="space-y-2">
                  {snapBObj.swot.weaknesses.map((wk, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-[#64748B] font-semibold leading-relaxed">
                      <X className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5" />
                      <span>{wk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-[#06B6D4]" />
                    <h4 className="text-xs.5 font-extrabold text-[#06B6D4] uppercase tracking-wider">Opportunities</h4>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-bold">96% Match</span>
                </div>
                <div className="space-y-2">
                  {snapBObj.swot.opportunities.map((op, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-[#64748B] font-semibold leading-relaxed">
                      <Plus className="w-3.5 h-3.5 text-[#06B6D4] shrink-0 mt-0.5" />
                      <span>{op}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threats */}
              <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 text-[#F59E0B]" />
                    <h4 className="text-xs.5 font-extrabold text-[#F59E0B] uppercase tracking-wider">Threats</h4>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-bold">94% Match</span>
                </div>
                <div className="space-y-2">
                  {snapBObj.swot.threats.map((th, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-[#64748B] font-semibold leading-relaxed">
                      <Minus className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <span>{th}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* CHANGE DETECTION GRID */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">Change Detection Grid</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {changeGridCards.map((card) => {
                const CardIcon = card.icon;
                return (
                  <div key={card.label} className="rounded-3xl border border-[#E2E8F0] bg-white p-4.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-md hover:-translate-y-0.5 transition duration-150 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                          <CardIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs.5 font-extrabold text-[#0F172A]">{card.label}</span>
                      </div>
                      <span className="text-[10px] text-[#10B981] font-bold">{card.confidence}% Acc</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#64748B] font-bold pt-1">
                      <span>{card.count} Changes</span>
                      <span>{card.sources} Sources</span>
                    </div>
                    <button className="w-full py-1.5 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#2563EB]/5 text-[10px] font-extrabold text-[#64748B] hover:text-[#2563EB] transition duration-150 cursor-pointer">
                      Open Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (DESKTOP ONLY) */}
        <aside className="space-y-6 sticky top-[160px]">
          
          {/* Overall AI Score */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Overall AI Match Score</h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-[#0F172A]">98.4</span>
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-250">Excellent</span>
            </div>
            <p className="text-[11px] font-semibold text-[#64748B] leading-relaxed">
              Comparison confidence matches model threshold of 95% minimum requirement.
            </p>
          </div>

          {/* Recent Snapshots */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-3.5">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Recent Snapshots</h4>
            <div className="space-y-3">
              {[
                { label: "Linear Snapshot", date: "Nov 12, 2026" },
                { label: "Notion Snapshot", date: "Nov 09, 2026" },
                { label: "Vercel Snapshot", date: "Nov 05, 2026" },
              ].map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#0F172A]">{s.label}</span>
                  <span className="text-[#64748B] font-semibold">{s.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Changed Companies */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-3.5">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Top Changed Companies</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-[#0F172A]">Linear</span>
                <span className="text-[#64748B] font-semibold">+14 changes</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#0F172A]">Notion</span>
                <span className="text-[#64748B] font-semibold">+9 changes</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#0F172A]">Vercel</span>
                <span className="text-[#64748B] font-semibold">+6 changes</span>
              </div>
            </div>
          </div>

          {/* Export Snapshot */}
          <button className="w-full py-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] hover:border-[#2563EB]/40 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#2563EB] transition duration-200 cursor-pointer shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export Snapshot Diffs</span>
          </button>

        </aside>

      </div>

    </div>
  );
}
