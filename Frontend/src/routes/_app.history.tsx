import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Search,
  DollarSign,
  Newspaper,
  Layers,
  ChevronDown,
  Calendar,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Zap,
  MessageSquare,
  Globe,
  FileText,
  Scale,
  Bookmark,
  Share2,
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Activity,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Signal History — CompetiLens AI" }] }),
  component: HistoryPage,
});

const eventChips = [
  { id: "all", label: "All", icon: Layers },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "hiring", label: "Hiring", icon: Users },
  { id: "product", label: "Product", icon: Zap },
  { id: "news", label: "News", icon: Newspaper },
  { id: "social", label: "Social", icon: Globe },
  { id: "website", label: "Website", icon: Globe },
];

function TimelineShimmer() {
  return (
    <div className="space-y-8 mt-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-6 items-start relative">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0" />
          <div className="flex-1 p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-4 shadow-sm animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
            <div className="h-6 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HistoryPage() {
  const { user, accessToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedComp, setSelectedComp] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const [competitors, setCompetitors] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch competitors once on load to populate dropdown
  useEffect(() => {
    if (!accessToken) return;

    const fetchCompetitors = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "x-workspace-id": user?.workspaceId || "",
        };
        const res = await fetch("http://localhost:5000/competitors", { headers });
        const json = await res.json();
        if (json.success) {
          setCompetitors(json.data.competitors);
        }
      } catch (err) {
        console.error("Failed to fetch filter competitors:", err);
      }
    };

    fetchCompetitors();
  }, [accessToken, user?.workspaceId]);

  // Fetch signals & stats when filters change
  useEffect(() => {
    if (!accessToken) return;

    const fetchTimelineData = async () => {
      try {
        setIsLoading(true);
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "x-workspace-id": user?.workspaceId || "",
        };

        // Construct query parameters
        const params = new URLSearchParams();

        if (searchQuery) {
          params.append("search", searchQuery);
        }
        if (selectedType !== "all") {
          params.append("type", selectedType.toUpperCase());
        }
        if (selectedComp !== "All") {
          params.append("competitorId", selectedComp);
        }
        if (selectedPriority !== "All") {
          params.append("severity", selectedPriority.toUpperCase());
        }

        if (selectedDate !== "All") {
          const now = new Date();
          let startDate: Date;
          if (selectedDate === "7d") startDate = new Date(now.setDate(now.getDate() - 7));
          else if (selectedDate === "30d") startDate = new Date(now.setDate(now.getDate() - 30));
          else startDate = new Date(now.setDate(now.getDate() - 90));
          params.append("startDate", startDate.toISOString());
        }

        // Fetch signals
        const sigRes = await fetch(`http://localhost:5000/signals?${params.toString()}`, { headers });
        const sigJson = await sigRes.json();
        const rawSignals = sigJson.success ? sigJson.data.signals : [];

        // Fetch statistics
        const statsRes = await fetch("http://localhost:5000/signals/statistics", { headers });
        const statsJson = await statsRes.json();
        const rawStats = statsJson.success ? statsJson.data.statistics : null;

        setSignals(rawSignals);
        setStatsData(rawStats);
      } catch (err) {
        console.error("Failed to load timeline events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchTimelineData, 300); // debounce input
    return () => clearTimeout(timer);
  }, [accessToken, user?.workspaceId, searchQuery, selectedType, selectedComp, selectedPriority, selectedDate]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedComp("All");
    setSelectedPriority("All");
    setSelectedDate("All");
    setSelectedSort("Newest");
  };

  const handleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  // Sort signals client-side based on user selection
  const sortedSignals = [...signals].sort((a, b) => {
    const timeA = new Date(a.capturedAt).getTime();
    const timeB = new Date(b.capturedAt).getTime();
    if (selectedSort === "Newest") return timeB - timeA;
    return timeA - timeB;
  });

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

  const getTimelineDotColor = (type: string, severity: string) => {
    if (severity === "CRITICAL") return "bg-[#EF4444] ring-red-100";
    if (severity === "HIGH") return "bg-[#F59E0B] ring-amber-100";
    switch (type.toLowerCase()) {
      case "product":
      case "website":
        return "bg-[#2563EB] ring-blue-100";
      case "hiring":
        return "bg-[#8B5CF6] ring-purple-100";
      default:
        return "bg-[#10B981] ring-emerald-100";
    }
  };

  const getPriorityBadgeColor = (p: string) => {
    switch (p) {
      case "CRITICAL":
        return "bg-red-50 text-[#EF4444] border-red-200/60";
      case "HIGH":
        return "bg-amber-50 text-[#F59E0B] border-amber-200/60";
      case "MEDIUM":
        return "bg-blue-50 text-[#2563EB] border-blue-200/60";
      default:
        return "bg-slate-50 text-[#64748B] border-slate-200/60";
    }
  };

  // Stats calculation
  const totalToday = statsData?.byStatus?.NEW || 0;
  const criticalCount = statsData?.bySeverity?.CRITICAL || 0;
  const totalComps = competitors.length;

  return (
    <div className="space-y-8 max-w-[1320px] mx-auto text-[#0F172A] font-sans">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2.5 max-w-2xl"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-full border border-[#2563EB]/15">
            History
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Competitive Intelligence Timeline
          </h1>
          <p className="text-sm font-semibold text-[#64748B] leading-relaxed">
            Track every AI-detected market signal, pricing update, feature launch, hiring activity, and news event in one unified, real-time timeline.
          </p>
        </motion.div>

        {/* Dynamic Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full sm:w-[360px] rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm shrink-0 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#64748B] tracking-wider">New Signals</span>
            <div className="text-3xl font-extrabold text-[#0F172A]">{totalToday}</div>
          </div>
          <div className="h-8 w-px bg-[#E2E8F0]" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#EF4444] tracking-wider">Critical</span>
            <div className="text-3xl font-extrabold text-[#EF4444]">{criticalCount}</div>
          </div>
          <div className="h-8 w-px bg-[#E2E8F0]" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#2563EB] tracking-wider">Companies</span>
            <div className="text-3xl font-extrabold text-[#2563EB]">{totalComps}</div>
          </div>
        </motion.div>
      </div>

      {/* 2. STICKY FILTER BAR */}
      <div className="sticky top-[74px] z-20">
        <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs.5 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition duration-200"
              />
            </div>

            {/* Competitor Dropdown */}
            <div className="relative">
              <select
                value={selectedComp}
                onChange={(e) => setSelectedComp(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer appearance-none min-w-[150px] transition"
              >
                <option value="All">All Competitors</option>
                {competitors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer appearance-none min-w-[120px] transition"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>

            {/* Date range dropdown */}
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer appearance-none min-w-[110px] transition"
              >
                <option value="All">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer appearance-none min-w-[110px] transition"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>

            {/* Reset Filters button */}
            <button
              onClick={handleResetFilters}
              className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. EVENT TYPE CHIPS */}
      <div className="overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-2">
          {eventChips.map((chip) => {
            const Icon = chip.icon;
            const active = selectedType === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  setSelectedType(chip.id);
                }}
                className={`flex items-center gap-2 h-9 px-4 rounded-full text-xs font-bold transition duration-200 select-none cursor-pointer border ${
                  active
                    ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border-transparent shadow-[0_3px_10px_rgba(37,99,235,0.15)]"
                    : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#2563EB]/5 hover:text-[#2563EB] hover:border-[#2563EB]/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN DUAL-COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        
        {/* LEFT COLUMN: TIMELINE FEED */}
        <div className="space-y-6 max-w-[900px] w-full">
          {isLoading ? (
            <TimelineShimmer />
          ) : sortedSignals.length > 0 ? (
            <div className="relative pl-6 sm:pl-10">
              
              {/* Central Timeline Connection Line */}
              <div className="absolute left-3 sm:left-5 top-4 bottom-4 w-[1.5px] bg-[#E2E8F0]" />

              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {sortedSignals.map((event, index) => {
                    const isBookmarked = bookmarkedIds.includes(event.id);
                    const compLogo = event.competitor?.name ? event.competitor.name.charAt(0).toUpperCase() : "?";
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        className="relative group flex gap-6 items-start"
                      >
                        {/* Timeline Dot Node */}
                        <div className="absolute -left-6 sm:-left-[29px] top-5 z-10">
                          <motion.div
                            className={`w-3.5 h-3.5 rounded-full ring-[6px] ${getTimelineDotColor(
                              event.type,
                              event.severity
                            )}`}
                          />
                        </div>

                        {/* Floating Event Card */}
                        <div className="flex-1 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.035)] hover:-translate-y-1.5 transition-all duration-300">
                          
                          {/* TOP ROW */}
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4.5">
                            <div className="flex items-center gap-2.5">
                              {/* Competitor Logo Bubble */}
                              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-xs font-extrabold text-white shadow-sm">
                                {compLogo}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs.5 font-extrabold text-[#0F172A]">{event.competitor?.name || "Unknown"}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-slate-50 text-[#64748B] font-bold">
                                  {event.competitor?.industry || "General"}
                                </span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-extrabold uppercase tracking-wide ${getPriorityBadgeColor(event.severity)}`}>
                                  {event.severity}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#64748B] font-semibold mr-1.5">
                                {getRelativeTime(event.capturedAt)}
                              </span>
                              {/* Actions */}
                              <button
                                onClick={() => handleBookmark(event.id)}
                                className={`w-8 h-8 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 flex items-center justify-center transition cursor-pointer ${
                                  isBookmarked ? "text-[#2563EB] bg-[#2563EB]/5" : "text-[#64748B]"
                                }`}
                                title="Bookmark Signal"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                              <button
                                className="w-8 h-8 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 flex items-center justify-center text-[#64748B] transition cursor-pointer"
                                title="Share Signal"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                className="w-8 h-8 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 flex items-center justify-center text-[#64748B] transition cursor-pointer"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* TITLE & DESCRIPTION */}
                          <div className="space-y-2 mb-4.5">
                            <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#2563EB] transition duration-150">
                              {event.title}
                            </h3>
                            <p className="text-xs.5 font-medium leading-relaxed text-[#64748B]">
                              {event.summary || "No description provided."}
                            </p>
                          </div>

                          {/* DYNAMIC METADATA CHIPS (IF APPLICABLE) */}
                          {event.metadata && (
                            <div className="flex flex-wrap items-center gap-3.5 mb-4.5">
                              {event.metadata.oldPrice !== undefined && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Old Price</span>
                                  <span className="text-xs.5 font-extrabold text-[#64748B] line-through">${event.metadata.oldPrice}</span>
                                </div>
                              )}
                              {event.metadata.newPrice !== undefined && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#2563EB] tracking-wider">New Price</span>
                                  <span className="text-xs.5 font-extrabold text-[#0F172A]">${event.metadata.newPrice}</span>
                                </div>
                              )}
                              {event.metadata.jobTitle && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Hiring Post</span>
                                  <span className="text-xs.5 font-extrabold text-[#2563EB]">{event.metadata.jobTitle}</span>
                                </div>
                              )}
                              {event.metadata.location && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Location</span>
                                  <span className="text-xs.5 font-extrabold text-[#06B6D4]">{event.metadata.location}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* AI SUMMARY BOX */}
                          <div className="rounded-2xl bg-[#2563EB]/5 border border-[#2563EB]/15 p-4 mb-4.5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-5">
                              <div>
                                <span className="text-[9px] uppercase font-extrabold text-[#64748B] tracking-wider">AI Impact</span>
                                <div className="text-sm font-extrabold text-[#2563EB] flex items-center gap-1">
                                  <Activity className="w-3.5 h-3.5" />
                                  <span>{event.severity === "CRITICAL" ? 95 : event.severity === "HIGH" ? 85 : event.severity === "MEDIUM" ? 60 : 30}</span>
                                </div>
                              </div>
                              <div className="h-7 w-px bg-[#E2E8F0]" />
                              <div>
                                <span className="text-[9px] uppercase font-extrabold text-[#64748B] tracking-wider">Threat Level</span>
                                <div className={`text-sm font-extrabold uppercase ${
                                  event.severity === "CRITICAL" ? "text-[#EF4444]" : "text-[#F59E0B]"
                                }`}>
                                  {event.severity}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                              <span className="text-[9px] uppercase font-extrabold text-[#64748B] tracking-wider block">Suggested Action</span>
                              <p className="text-xs font-bold text-[#0F172A] mt-0.5">
                                {event.severity === "CRITICAL"
                                  ? "Immediate strategy meeting recommended to evaluate market impact."
                                  : "Monitor competitor developments closely."}
                              </p>
                            </div>
                          </div>

                          {/* SOURCE SECTION */}
                          {event.url && (
                            <div className="flex flex-wrap items-center gap-2 mb-4.5">
                              <span className="text-[9px] uppercase font-extrabold text-[#64748B] tracking-wider mr-1">Sources:</span>
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB]/40 bg-slate-50/50 hover:bg-white text-[11px] font-semibold text-[#64748B] hover:text-[#2563EB] transition duration-150"
                              >
                                <Globe className="w-3 h-3 text-[#64748B] shrink-0" />
                                <span>{event.source || "Web Monitoring"}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            </div>
                          )}

                          {/* FOOTER */}
                          <div className="border-t border-[#E2E8F0] pt-3 flex flex-wrap justify-between items-center text-[10px] text-[#64748B] font-bold">
                            <div>
                              <span>INDEXED:</span> <span className="text-[#0F172A]">{new Date(event.capturedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-4">
                              <div>
                                <span>AGENT:</span> <span className="text-[#2563EB]">Research Agent</span>
                              </div>
                              <div>
                                <span>CONFIDENCE:</span> <span className="text-[#10B981]">95%</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

            </div>
          ) : (
            /* EMPTY STATE */
            <div className="p-16 text-center border border-dashed border-[#E2E8F0] rounded-[32px] bg-white shadow-sm space-y-5">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#64748B]">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-[#0F172A]">No activity yet</h3>
                <p className="text-xs.5 text-[#64748B] font-semibold max-w-sm mx-auto leading-relaxed">
                  Your AI agents will populate this timeline automatically once monitoring begins.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY SIDEBAR (DESKTOP ONLY) */}
        <aside className="hidden lg:block space-y-6 sticky top-[160px]">
          
          {/* AI Threat Score Card */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">AI Threat Score</h4>
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-black text-[#0F172A] tracking-tight">
                  {criticalCount > 0 ? "92" : totalToday > 0 ? "68" : "0"}
                </span>
                <span className="text-xs font-bold text-[#64748B] ml-1">/100</span>
              </div>
              <span className={`text-xs font-bold ${
                criticalCount > 0 ? "text-[#EF4444] bg-red-50" : "text-[#2563EB] bg-blue-50"
              } border border-transparent px-2.5 py-0.5 rounded-full`}>
                {criticalCount > 0 ? "High Risk" : "Stable"}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#EF4444] h-full rounded-full transition-all duration-500"
                style={{ width: criticalCount > 0 ? "92%" : totalToday > 0 ? "68%" : "0%" }}
              />
            </div>
          </div>

          {/* Activity Statistics Card */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Activity Statistics</h4>
            <div className="space-y-3 text-xs.5 font-bold">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Pricing Changes</span>
                <span className="text-[#0F172A]">{statsData?.byType?.PRICING || 0} events</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Website Monitor</span>
                <span className="text-[#0F172A]">{statsData?.byType?.WEBSITE || 0} events</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Team / Hirings</span>
                <span className="text-[#0F172A]">{statsData?.byType?.HIRING || 0} events</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">News Posts</span>
                <span className="text-[#0F172A]">{statsData?.byType?.NEWS || 0} events</span>
              </div>
            </div>
          </div>

          {/* Top Competitors list */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Top Competitors</h4>
            <div className="space-y-3.5">
              {competitors.slice(0, 5).map((comp) => (
                <div key={comp.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-[9px] font-extrabold text-white">
                      {comp.name.charAt(0)}
                    </div>
                    <span className="text-xs.5 font-bold text-[#0F172A]">{comp.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-[#64748B]">
                    <span className="text-[#2563EB] bg-[#2563EB]/10 px-1.5 py-0.2 rounded border border-[#2563EB]/25">{comp.status}</span>
                  </div>
                </div>
              ))}
              {competitors.length === 0 && (
                <p className="text-xs text-muted-foreground">No competitors added yet.</p>
              )}
            </div>
          </div>

          {/* Recent AI Actions */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Recent AI Actions</h4>
            <div className="space-y-3.5 text-xs text-[#64748B] font-semibold">
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <p>Monitored workspace signal channels</p>
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <p>Synced Neon PostgreSQL databases</p>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
