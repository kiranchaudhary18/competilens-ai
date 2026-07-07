import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Filter,
  Search,
  DollarSign,
  Newspaper,
  GitBranch,
  Users,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { history } from "@/data/mock";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Signal History — CompetiLens AI" }] }),
  component: HistoryPage,
});

// Event Type Metadata
const eventTypes = [
  { id: "all", label: "All Events", icon: Layers, color: "text-slate-500 border-slate-200" },
  { id: "pricing", label: "Pricing", icon: DollarSign, color: "text-warning border-warning/30 bg-warning/5" },
  { id: "news", label: "News & PR", icon: Newspaper, color: "text-success border-success/30 bg-success/5" },
  { id: "signal", label: "Feature / Signal", icon: GitBranch, color: "text-secondary border-secondary/30 bg-secondary/5" },
  { id: "update", label: "Team / Update", icon: Users, color: "text-primary border-primary/30 bg-primary/5" },
];

const dateRanges = [
  { id: "all", label: "All time" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

const competitorsList = ["All Competitors", "Linear", "Notion", "Vercel", "Stripe", "OpenAI"];

// Enhanced details mock for expansion
const eventDetails: Record<string, string> = {
  "r-014": "Linear raised $80M in Series C funding. Benchmark data indicates the runway is extended by 4+ years. Aggressive talent recruitment starting for ML planning division.",
  "r-013": "Notion released a native AI Meetings module. This includes automatic summarization, Loom-like screen shares, and database action integration. High threat to our notes module.",
  "r-012": "Vercel adjusted v0.dev enterprise pricing plans to $500 per seat. This represents a 25% pricing increase on enterprise contract models. Average contract size trending upwards.",
  "r-011": "Stripe's regulatory files under review by European commission regarding cross-border data residency. Audit resolution timeline estimated at 6-9 months.",
  "r-010": "OpenAI launched GPT-4o-mini API endpoints, lowering base generation tokens cost by 60%. Competitors transitioning pipeline integrations to utilize mini models.",
  "r-009": "Linear intelligence brief generated successfully. Threat score increased to 92 based on new features check and ARR growth indicators.",
  "r-008": "Notion COO transitioned to board role. Former product head promoted to lead enterprise strategy initiatives.",
};

function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedComp, setSelectedComp] = useState("All Competitors");
  const [selectedDate, setSelectedDate] = useState("all");
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = history.filter((h) => {
    // 1. Search Query
    const matchesSearch = h.change.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.competitor.toLowerCase().includes(searchQuery.toLowerCase());
    // 2. Event Type
    const matchesType = selectedType === "all" || h.type === selectedType;
    // 3. Competitor filter
    const matchesComp = selectedComp === "All Competitors" || h.competitor === selectedComp;
    
    return matchesSearch && matchesType && matchesComp;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs text-primary uppercase tracking-[0.16em]">History</div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Intelligence Timeline
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Historical log of every competitive signal, price change, and news alert indexed by the agents.
        </p>
      </motion.div>

      {/* Filter Options */}
      <Panel>
        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-[1.5fr_1fr_1fr] gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search event content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10.5 pl-10 pr-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>

            {/* Competitor Select */}
            <div className="relative">
              <select
                value={selectedComp}
                onChange={(e) => setSelectedComp(e.target.value)}
                className="w-full h-10.5 px-3 rounded-xl bg-background border border-border text-xs.5 font-semibold text-muted-foreground focus:outline-none cursor-pointer appearance-none"
              >
                {competitorsList.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Date range select */}
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-10.5 px-3 rounded-xl bg-background border border-border text-xs.5 font-semibold text-muted-foreground focus:outline-none cursor-pointer appearance-none"
              >
                {dateRanges.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Event type pills */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground mr-2.5">Event Type</span>
            {eventTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer select-none ${
                    selectedType === type.id
                      ? "bg-gradient-primary border-primary text-white shadow-glow"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* Timeline flow */}
      <div className="relative pl-7 md:pl-10">
        {/* Line */}
        <div className="absolute left-3.5 md:left-5 top-0 bottom-0 w-[1.5px] bg-border/80" />

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((h, i) => {
              const typeMeta = eventTypes.find((t) => t.id === h.type) || eventTypes[0];
              const Icon = typeMeta.icon;
              const isExpanded = expandedId === h.id;

              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="relative group"
                >
                  {/* Circle Node with Icon */}
                  <div className="absolute -left-7 md:-left-[29px] top-4.5 w-7 h-7 rounded-full border border-border bg-card shadow-card flex items-center justify-center text-muted-foreground relative z-10 transition duration-300 group-hover:border-primary group-hover:text-primary">
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Glass Card */}
                  <div className="rounded-[22px] border border-border bg-card hover:bg-card/90 shadow-card glass p-4.5 sm:p-5 relative transition-all duration-250">
                    <div className="flex items-start justify-between gap-4">
                      
                      {/* Brand Logo & Info */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center text-sm font-bold text-white shadow-glow select-none">
                          {h.competitor.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-800">{h.competitor}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${typeMeta.color}`}>
                              {h.type}
                            </span>
                          </div>
                          <div className="text-xs.5 text-slate-800 font-medium mt-1 leading-normal">
                            {h.change}
                          </div>
                        </div>
                      </div>

                      {/* Right Meta (Date & Expand) */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground hidden sm:inline-block font-semibold">
                          {h.date}
                        </span>
                        
                        <button
                          onClick={() => toggleExpand(h.id)}
                          className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                          aria-label="Expand event details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                    </div>

                    {/* Expandable Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-border/60 text-xs.5 text-muted-foreground leading-relaxed space-y-3">
                            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80">
                              {eventDetails[h.id] || "No detailed logs logged by the agent for this specific update."}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground/80 font-medium">CITATIONS: Public press, product logs, agent audit</span>
                              <button className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                                View full run report <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="p-12 text-center border border-dashed border-border rounded-[24px] bg-card/45">
              <Calendar className="w-7 h-7 text-muted-foreground mx-auto" />
              <h3 className="text-sm font-semibold mt-3">No signals found</h3>
              <p className="text-xs text-muted-foreground mt-1">Try relaxing your search parameters or filter pills.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
