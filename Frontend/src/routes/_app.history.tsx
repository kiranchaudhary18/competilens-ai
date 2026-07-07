import { createFileRoute } from "@tanstack/react-router";
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
  Flame,
  RotateCcw,
  SlidersHorizontal,
  Briefcase,
  TrendingDown,
  BookmarkCheck,
} from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Signal History — CompetiLens AI" }] }),
  component: HistoryPage,
});

// Event type chip configuration
const eventChips = [
  { id: "all", label: "All", icon: Layers },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "feature", label: "Feature", icon: Sparkles },
  { id: "hiring", label: "Hiring", icon: Users },
  { id: "funding", label: "Funding", icon: TrendingUp },
  { id: "product", label: "Product", icon: Zap },
  { id: "review", label: "Review", icon: MessageSquare },
  { id: "news", label: "News", icon: Newspaper },
  { id: "social", label: "Social", icon: Globe },
  { id: "website", label: "Website", icon: Globe },
  { id: "patent", label: "Patent", icon: FileText },
  { id: "legal", label: "Legal", icon: Scale },
];

interface RichHistoryEvent {
  id: string;
  competitor: string;
  competitorLogo: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  date: string;
  timestamp: string;
  type: string;
  title: string;
  description: string;
  aiSummary: {
    impactScore: number;
    threatLevel: "Low" | "Medium" | "High" | "Critical";
    suggestedAction: string;
  };
  changeDetails?: {
    oldValue?: string;
    newValue?: string;
    features?: string;
    hiring?: string;
    traffic?: string;
  };
  sources: { name: string; url: string; type: string }[];
  agent: string;
  confidence: number;
}

const richEvents: RichHistoryEvent[] = [
  {
    id: "e-001",
    competitor: "Linear",
    competitorLogo: "L",
    category: "Project Management",
    priority: "High",
    date: "Nov 12, 2026",
    timestamp: "2 hours ago",
    type: "funding",
    title: "Linear raised $80M in Series C funding led by Sequoia",
    description: "Benchmark data indicates the runway is extended by 4+ years. Aggressive talent recruitment starting for ML planning division.",
    aiSummary: {
      impactScore: 92,
      threatLevel: "High",
      suggestedAction: "Monitor hiring pipeline for ML planning roles."
    },
    changeDetails: {
      hiring: "+12",
      traffic: "+18%"
    },
    sources: [
      { name: "Official Website", url: "https://linear.app", type: "website" },
      { name: "LinkedIn", url: "https://linkedin.com", type: "linkedin" },
      { name: "TechCrunch", url: "https://techcrunch.com", type: "news" }
    ],
    agent: "Website Agent",
    confidence: 98
  },
  {
    id: "e-002",
    competitor: "Notion",
    competitorLogo: "N",
    category: "Productivity & Workspace",
    priority: "Critical",
    date: "Nov 09, 2026",
    timestamp: "1 day ago",
    type: "feature",
    title: "AI Meetings & Autocomplete Integration Released",
    description: "Notion released a native AI Meetings module. This includes automatic summarization, Loom-like screen shares, and database action integration. High threat to our notes module.",
    aiSummary: {
      impactScore: 95,
      threatLevel: "Critical",
      suggestedAction: "Initiate sprint for collaborative document summary features."
    },
    changeDetails: {
      features: "+3",
      traffic: "+4.2%"
    },
    sources: [
      { name: "Official Website", url: "https://notion.so", type: "website" },
      { name: "Twitter / X", url: "https://twitter.com", type: "twitter" }
    ],
    agent: "Website Agent",
    confidence: 99
  },
  {
    id: "e-003",
    competitor: "Vercel",
    competitorLogo: "▲",
    category: "Developer Cloud",
    priority: "High",
    date: "Nov 05, 2026",
    timestamp: "3 days ago",
    type: "pricing",
    title: "v0.dev Enterprise Pricing Tier Updated",
    description: "Vercel adjusted v0.dev enterprise pricing plans to $500 per seat. This represents a 25% pricing increase on enterprise contract models. Average contract size trending upwards.",
    aiSummary: {
      impactScore: 88,
      threatLevel: "Medium",
      suggestedAction: "Review enterprise packaging & pricing tiers."
    },
    changeDetails: {
      oldValue: "$400 / seat",
      newValue: "$500 / seat"
    },
    sources: [
      { name: "Official Website", url: "https://vercel.com", type: "website" },
      { name: "Twitter / X", url: "https://twitter.com", type: "twitter" }
    ],
    agent: "Pricing Agent",
    confidence: 97
  },
  {
    id: "e-004",
    competitor: "Stripe",
    competitorLogo: "S",
    category: "Fintech & Payments",
    priority: "Medium",
    date: "Nov 01, 2026",
    timestamp: "1 week ago",
    type: "legal",
    title: "EU Data Residency Inquiry Opened",
    description: "Stripe's regulatory files under review by European commission regarding cross-border data residency. Audit resolution timeline estimated at 6-9 months.",
    aiSummary: {
      impactScore: 74,
      threatLevel: "Medium",
      suggestedAction: "No immediate action required, track regulatory report."
    },
    sources: [
      { name: "Reuters", url: "https://reuters.com", type: "news" }
    ],
    agent: "News Agent",
    confidence: 95
  },
  {
    id: "e-005",
    competitor: "OpenAI",
    competitorLogo: "◎",
    category: "AI Infrastructure",
    priority: "Critical",
    date: "Oct 27, 2026",
    timestamp: "2 weeks ago",
    type: "product",
    title: "GPT-4o-mini API Endpoints Launched",
    description: "OpenAI launched GPT-4o-mini API endpoints, lowering base generation tokens cost by 60%. Competitors transitioning pipeline integrations to utilize mini models.",
    aiSummary: {
      impactScore: 96,
      threatLevel: "Critical",
      suggestedAction: "Update our base LLM integration to GPT-4o-mini for 60% cost reduction."
    },
    changeDetails: {
      oldValue: "$15.00 / M",
      newValue: "$6.00 / M"
    },
    sources: [
      { name: "Twitter / X", url: "https://twitter.com", type: "twitter" },
      { name: "GitHub", url: "https://github.com", type: "github" },
      { name: "Official Website", url: "https://openai.com", type: "website" }
    ],
    agent: "Analysis Agent",
    confidence: 98
  }
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedComp, setSelectedComp] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Simulation loading shimmer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedComp("All");
    setSelectedPriority("All");
    setSelectedDate("All");
    setSelectedSort("Newest");
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  // Filter items
  const filteredItems = richEvents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.competitor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || item.type === selectedType;

    const matchesComp = selectedComp === "All" || item.competitor === selectedComp;

    const matchesPriority = selectedPriority === "All" || item.priority === selectedPriority;

    return matchesSearch && matchesType && matchesComp && matchesPriority;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (selectedSort === "Newest") return 1; // already ordered newest first
    if (selectedSort === "Oldest") return -1;
    return 0;
  });

  const getTimelineDotColor = (type: string, priority: string) => {
    if (priority === "Critical") return "bg-[#EF4444] ring-red-100";
    switch (type) {
      case "feature":
      case "product":
      case "website":
        return "bg-[#2563EB] ring-blue-100";
      case "funding":
      case "social":
        return "bg-[#10B981] ring-emerald-100";
      case "pricing":
        return "bg-[#F59E0B] ring-amber-100";
      default:
        return "bg-[#8B5CF6] ring-purple-100";
    }
  };

  const getPriorityBadgeColor = (p: string) => {
    switch (p) {
      case "Critical":
        return "bg-red-50 text-[#EF4444] border-red-200/60";
      case "High":
        return "bg-amber-50 text-[#F59E0B] border-amber-200/60";
      case "Medium":
        return "bg-blue-50 text-[#2563EB] border-blue-200/60";
      default:
        return "bg-slate-50 text-[#64748B] border-slate-200/60";
    }
  };

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

        {/* Today's Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full sm:w-[360px] rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm shrink-0 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#64748B] tracking-wider">Today's Events</span>
            <div className="text-3xl font-extrabold text-[#0F172A]">18</div>
          </div>
          <div className="h-8 w-px bg-[#E2E8F0]" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#EF4444] tracking-wider">High Priority</span>
            <div className="text-3xl font-extrabold text-[#EF4444]">4</div>
          </div>
          <div className="h-8 w-px bg-[#E2E8F0]" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#2563EB] tracking-wider">Companies</span>
            <div className="text-3xl font-extrabold text-[#2563EB]">7</div>
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
                className="h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer appearance-none min-w-[130px] transition"
              >
                <option value="All">All Competitors</option>
                <option value="Linear">Linear</option>
                <option value="Notion">Notion</option>
                <option value="Vercel">Vercel</option>
                <option value="Stripe">Stripe</option>
                <option value="OpenAI">OpenAI</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 text-xs.5 font-bold text-[#64748B] hover:text-[#0F172A] focus:outline-none cursor-pointer appearance-none min-w-[110px] transition"
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
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 400);
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
          ) : sortedItems.length > 0 ? (
            <div className="relative pl-6 sm:pl-10">
              
              {/* Central Timeline Connection Line */}
              <div className="absolute left-3 sm:left-5 top-4 bottom-4 w-[1.5px] bg-[#E2E8F0]" />

              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {sortedItems.map((event, index) => {
                    const isBookmarked = bookmarkedIds.includes(event.id);
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
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 3, delay: index * 0.4 }}
                            className={`w-5 h-5 rounded-full border border-white ring-4 ${getTimelineDotColor(
                              event.type,
                              event.priority
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
                                {event.competitorLogo}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs.5 font-extrabold text-[#0F172A]">{event.competitor}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#E2E8F0] bg-slate-50 text-[#64748B] font-bold">
                                  {event.category}
                                </span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-extrabold uppercase tracking-wide ${getPriorityBadgeColor(event.priority)}`}>
                                  {event.priority}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#64748B] font-semibold mr-1.5">
                                {event.timestamp}
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
                              {event.description}
                            </p>
                          </div>

                          {/* CHANGE DETAILS CARDS (IF APPLICABLE) */}
                          {event.changeDetails && (
                            <div className="flex flex-wrap items-center gap-3.5 mb-4.5">
                              {event.changeDetails.oldValue && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Old</span>
                                  <span className="text-xs.5 font-extrabold text-[#64748B] line-through">{event.changeDetails.oldValue}</span>
                                </div>
                              )}
                              {event.changeDetails.newValue && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#2563EB] tracking-wider">New</span>
                                  <span className="text-xs.5 font-extrabold text-[#0F172A]">{event.changeDetails.newValue}</span>
                                </div>
                              )}
                              {event.changeDetails.features && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Features</span>
                                  <span className="text-xs.5 font-extrabold text-[#10B981]">{event.changeDetails.features}</span>
                                </div>
                              )}
                              {event.changeDetails.hiring && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Hiring</span>
                                  <span className="text-xs.5 font-extrabold text-[#2563EB]">{event.changeDetails.hiring}</span>
                                </div>
                              )}
                              {event.changeDetails.traffic && (
                                <div className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 flex flex-col min-w-[70px]">
                                  <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Traffic</span>
                                  <span className="text-xs.5 font-extrabold text-[#06B6D4]">{event.changeDetails.traffic}</span>
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
                                  <span>{event.aiSummary.impactScore}</span>
                                </div>
                              </div>
                              <div className="h-7 w-px bg-[#E2E8F0]" />
                              <div>
                                <span className="text-[9px] uppercase font-extrabold text-[#64748B] tracking-wider">Threat Level</span>
                                <div className={`text-sm font-extrabold uppercase ${
                                  event.aiSummary.threatLevel === "Critical" ? "text-[#EF4444]" : "text-[#F59E0B]"
                                }`}>
                                  {event.aiSummary.threatLevel}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                              <span className="text-[9px] uppercase font-extrabold text-[#64748B] tracking-wider block">Suggested Action</span>
                              <p className="text-xs font-bold text-[#0F172A] mt-0.5">{event.aiSummary.suggestedAction}</p>
                            </div>
                          </div>

                          {/* SOURCE SECTION */}
                          <div className="flex flex-wrap items-center gap-2 mb-4.5">
                            <span className="text-[9px] uppercase font-extrabold text-[#64748B] tracking-wider mr-1">Sources:</span>
                            {event.sources.map((src) => (
                              <a
                                key={src.name}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB]/40 bg-slate-50/50 hover:bg-white text-[11px] font-semibold text-[#64748B] hover:text-[#2563EB] transition duration-150"
                              >
                                <Globe className="w-3 h-3 text-[#64748B] shrink-0" />
                                <span>{src.name}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            ))}
                          </div>

                          {/* FOOTER */}
                          <div className="border-t border-[#E2E8F0] pt-3 flex flex-wrap justify-between items-center text-[10px] text-[#64748B] font-bold">
                            <div>
                              <span>INDEXED:</span> <span className="text-[#0F172A]">{event.date}</span>
                            </div>
                            <div className="flex gap-4">
                              <div>
                                <span>AGENT:</span> <span className="text-[#2563EB]">{event.agent}</span>
                              </div>
                              <div>
                                <span>CONFIDENCE:</span> <span className="text-[#10B981]">{event.confidence}%</span>
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
                  Your AI agents will populate this timeline automatically once monitoring begins. Try resetting filters to view standard mock items.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <span>Start Monitoring</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
                <span className="text-4xl font-black text-[#0F172A] tracking-tight">87</span>
                <span className="text-xs font-bold text-[#64748B] ml-1">/100</span>
              </div>
              <span className="text-xs font-bold text-[#EF4444] bg-red-50 border border-red-200/50 px-2.5 py-0.5 rounded-full">
                High Risk
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#2563EB] to-[#EF4444] h-full rounded-full" style={{ width: "87%" }} />
            </div>
          </div>

          {/* Activity Statistics Card */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Activity Statistics</h4>
            <div className="space-y-3 text-xs.5 font-bold">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Pricing Changes</span>
                <span className="text-[#0F172A]">8 events</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Feature Releases</span>
                <span className="text-[#0F172A]">14 events</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Team / Hirings</span>
                <span className="text-[#0F172A]">21 events</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Legal / Regulatory</span>
                <span className="text-[#0F172A]">2 events</span>
              </div>
            </div>
          </div>

          {/* Top Competitors list */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Top Competitors</h4>
            <div className="space-y-3.5">
              {[
                { name: "OpenAI", score: 95, arr: "$3.4B" },
                { name: "Stripe", score: 96, arr: "$14B" },
                { name: "Linear", score: 92, arr: "$52M" },
                { name: "Vercel", score: 90, arr: "$140M" },
              ].map((comp) => (
                <div key={comp.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-[9px] font-extrabold text-white">
                      {comp.name.charAt(0)}
                    </div>
                    <span className="text-xs.5 font-bold text-[#0F172A]">{comp.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-[#64748B]">
                    <span>{comp.arr}</span>
                    <span className="text-[#2563EB] bg-[#2563EB]/10 px-1.5 py-0.2 rounded border border-[#2563EB]/25">{comp.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent AI Actions */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-xs.5 font-extrabold uppercase tracking-wider text-[#64748B]">Recent AI Actions</h4>
            <div className="space-y-3.5 text-xs text-[#64748B] font-semibold">
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <p>Rescanned Linear engineering pipeline (12 open positions indexed)</p>
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <p>Monitored Notion product release logs (meetings feature mapped)</p>
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <p>Indexed Vercel public price page (v0 seats adjusted)</p>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
