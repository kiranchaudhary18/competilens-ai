import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  RefreshCw,
  Globe,
  DollarSign,
  Briefcase as BriefcaseIcon,
} from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { useAuth } from "../components/AuthContext";

export const Route = createFileRoute("/_app/reports/$id")({
  head: ({ params }) => ({ meta: [{ title: `Competitor Briefing — Executive Report` }] }),
  component: ReportPage,
});

const chartColors = ["var(--success)", "var(--muted-foreground)", "var(--destructive)"];

function ReportPage() {
  const { id } = Route.useParams();
  const { user, accessToken } = useAuth();
  const [copied, setCopied] = useState(false);

  const [competitor, setCompetitor] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "x-workspace-id": user?.workspaceId || "",
        };

        // Fetch competitor details
        const res = await fetch(`http://localhost:5000/competitors/${id}`, { headers });
        const json = await res.json();
        if (json.success) {
          setCompetitor(json.data.competitor);
        }

        // Fetch competitor specific signals
        const sigRes = await fetch(`http://localhost:5000/signals?competitorId=${id}`, { headers });
        const sigJson = await sigRes.json();
        if (sigJson.success) {
          setSignals(sigJson.data.signals);
        }
      } catch (err) {
        console.error("Failed to fetch competitor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, accessToken, user?.workspaceId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    alert(`Starting PDF download for ${competitor?.name} Executive Report...`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Compiling competitor briefing...</p>
      </div>
    );
  }

  if (!competitor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <Building2 className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-bold text-slate-800">Competitor profile not found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The requested profile does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/reports"
          className="inline-flex h-10 items-center justify-center px-5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition"
        >
          Return to Library
        </Link>
      </div>
    );
  }

  const tocItems = [
    { id: "summary", label: "Executive Summary" },
    { id: "pricing", label: "Pricing plans" },
    { id: "techstack", label: "Technology Stack" },
    { id: "contacts", label: "Contacts & Leadership" },
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
        <span className="text-foreground">{competitor.name} Executive Briefing</span>
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
            <div className="w-20 h-20 rounded-[24px] bg-gradient-primary grid place-items-center text-3xl font-extrabold text-white shadow-card border-4 border-card relative z-10 select-none animate-fade-in">
              {competitor.name.charAt(0).toUpperCase()}
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
              Autonomous Intelligence brief · {competitor.status}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{competitor.name}</h1>
            <p className="text-sm.5 text-muted-foreground max-w-3xl leading-relaxed">
              {competitor.description || `Autonomous monitoring configuration initialized for ${competitor.domain}.`}
            </p>
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
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Industry", value: competitor.industry || "General", sub: competitor.domain, color: "text-primary" },
                { label: "Company Size", value: competitor.companySize || "Unknown", sub: "Employees headcount", color: "text-secondary" },
                { label: "Indexed signals", value: String(signals.length), sub: "Total captured events", color: "text-success" },
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
          </section>

          {/* Pricing Plans */}
          <section id="pricing" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Pricing Plans
            </h2>
            {competitor.pricingPlans && competitor.pricingPlans.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {competitor.pricingPlans.map((plan: any) => (
                  <div key={plan.id} className="p-5 rounded-2xl border border-border bg-card/65 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs uppercase font-extrabold text-primary tracking-wider">
                        {plan.planName}
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-800">${plan.price}</span>
                        <span className="text-xs font-semibold text-muted-foreground">/{plan.billingType || "mo"}</span>
                      </div>
                      {plan.description && (
                        <p className="mt-3 text-xs.5 text-muted-foreground leading-relaxed">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border rounded-2xl bg-card/40">
                <DollarSign className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-xs.5 font-semibold text-muted-foreground">No pricing tiers registered yet</p>
              </div>
            )}
          </section>

          {/* Technology Stack */}
          <section id="techstack" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Technology Stack
            </h2>
            {competitor.technologies && competitor.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {competitor.technologies.map((tech: any) => (
                  <span
                    key={tech.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-slate-800 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{tech.technology}</span>
                    {tech.category && (
                      <span className="text-[10px] text-muted-foreground font-normal">({tech.category})</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border rounded-2xl bg-card/40">
                <Layers className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-xs.5 font-semibold text-muted-foreground">No technology stack modules mapped yet</p>
              </div>
            )}
          </section>

          {/* Contacts & Leadership */}
          <section id="contacts" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Contacts & Leadership
            </h2>
            {competitor.contacts && competitor.contacts.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {competitor.contacts.map((contact: any) => (
                  <div key={contact.id} className="p-5 rounded-2xl border border-border bg-card/65 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold text-xs">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs.5 font-bold text-slate-800 truncate">{contact.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-semibold truncate">{contact.designation || "Executive"}</p>
                      </div>
                    </div>
                    <div className="border-t border-border/50 pt-2.5 text-xs text-muted-foreground space-y-1">
                      {contact.email && (
                        <div className="truncate">Email: <span className="font-bold text-slate-700">{contact.email}</span></div>
                      )}
                      {contact.linkedin && (
                        <div className="truncate">
                          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border rounded-2xl bg-card/40">
                <BriefcaseIcon className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-xs.5 font-semibold text-muted-foreground">No leadership contacts added yet</p>
              </div>
            )}
          </section>

          {/* Event Timeline */}
          <section id="timeline" className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b border-border/80 pb-2 text-slate-800">
              Competitor Event Timeline
            </h2>
            {signals.length > 0 ? (
              <div className="p-5 rounded-2xl border border-border bg-card/65 relative overflow-hidden">
                <div className="absolute left-9 top-8 bottom-8 w-[1px] bg-border" />
                <div className="space-y-6 relative z-10">
                  {signals.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-primary shrink-0 relative z-20">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-muted-foreground">{new Date(evt.capturedAt).toLocaleDateString()}</div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">{evt.title}</div>
                        {evt.summary && <div className="text-xs text-muted-foreground mt-0.5">{evt.summary}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border rounded-2xl bg-card/40">
                <Calendar className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2 animate-pulse" />
                <p className="text-xs.5 font-semibold text-muted-foreground">No signals captured for this competitor profile yet</p>
              </div>
            )}
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
                <span className="font-bold text-slate-800">{competitor.domain}</span>
              </div>
              <div className="flex justify-between flex-wrap gap-1">
                <span className="text-muted-foreground">HQ Location:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[120px]" title={competitor.headquarters}>{competitor.headquarters || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-bold text-slate-800 uppercase text-xs">{competitor.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Website:</span>
                {competitor.website ? (
                  <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline truncate max-w-[120px]">
                    {competitor.website.replace(/https?:\/\//, "")}
                  </a>
                ) : (
                  <span className="font-bold text-slate-800">None</span>
                )}
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
