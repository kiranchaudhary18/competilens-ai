import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowRight, Download, Share2, Eye, Filter, Calendar, Search, ShieldAlert, Check } from "lucide-react";
import { useState } from "react";
import { competitors } from "@/data/mock";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Intelligence Library — CompetiLens AI" }] }),
  component: ReportsLayout,
});

function ReportsLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isIndex = path === "/reports";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isIndex) return <Outlet />;

  // Filter list
  const filteredCompetitors = competitors.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "high-threat") return matchesSearch && c.score >= 90;
    if (selectedFilter === "new") return matchesSearch && c.status === "new";
    return matchesSearch;
  });

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCopiedId(id);
    navigator.clipboard.writeText(`${window.location.origin}/reports/${id}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Downloading PDF report for ${name}...`);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs text-primary uppercase tracking-[0.16em]">Reports</div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Intelligence Library
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Access complete, board-ready competitor briefings synthesized by your autonomous agents.
        </p>
      </motion.div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10.5 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/80 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Reports" },
            { id: "high-threat", label: "High Threat (90+)" },
            { id: "new", label: "New Alerts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`flex-1 sm:flex-initial text-nowrap px-3.5 py-1.5 rounded-lg text-xs.5 font-bold transition select-none cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of large report cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCompetitors.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group rounded-[26px] border border-border bg-card shadow-card glass hover:shadow-glow hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <Link to="/reports/$id" params={{ id: c.id }} className="p-6 block space-y-5 flex-1">
                {/* Top Row: Logo & Threat Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center text-md font-bold text-white shadow-glow select-none">
                      {c.logo}
                    </div>
                    <div>
                      <h3 className="text-md.5 font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                        {c.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border mt-1 inline-block font-semibold">
                        {c.industry}
                      </span>
                    </div>
                  </div>

                  {/* Threat Score Card */}
                  <div className="text-right">
                    <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground font-semibold">Threat Score</div>
                    <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                      <ShieldAlert className={`w-4 h-4 ${c.score >= 90 ? "text-danger" : "text-warning"}`} />
                      <span className="text-md font-extrabold tracking-tight text-slate-800">{c.score}</span>
                    </div>
                  </div>
                </div>

                {/* Description summary */}
                <p className="text-xs.5 text-muted-foreground leading-relaxed h-12 overflow-hidden line-clamp-2">
                  {c.summary}
                </p>

                {/* Metadata details */}
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-4 mt-2.5">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Run {c.lastAnalyzed}</span>
                  </div>
                  <span className="font-semibold text-primary/80 group-hover:text-primary transition-colors">
                    12 analysis fields
                  </span>
                </div>
              </Link>

              {/* Bottom Quick actions bar */}
              <div className="px-6 py-3.5 bg-muted/20 border-t border-border/80 flex items-center justify-between">
                <button
                  onClick={(e) => handleDownload(c.name, e)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Download report PDF"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>

                <button
                  onClick={(e) => handleShare(c.id, e)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Share report URL"
                >
                  {copiedId === c.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" /> Copied Link
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate({ to: "/reports/$id", params: { id: c.id } })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-primary transition cursor-pointer"
                >
                  View Report <Eye className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCompetitors.length === 0 && (
          <div className="col-span-2 p-12 text-center border border-dashed border-border rounded-[28px] bg-card/40">
            <ShieldAlert className="w-8 h-8 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-semibold mt-4">No reports found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
