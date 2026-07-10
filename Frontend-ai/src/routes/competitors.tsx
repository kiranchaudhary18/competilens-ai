import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard, Chip, GlowButton, GhostButton } from "@/components/app/ui";
import { competitors as mockCompetitors, threatColor } from "@/lib/mockData";
import { Plus, Grid3x3, Orbit as OrbitIcon, Filter, X, Check } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/competitors")({
  head: () => ({ meta: [{ title: "Competitors — CompetiLens AI" }] }),
  component: Competitors,
});

function Competitors() {
  const [threat, setThreat] = useState("All");
  const [region, setRegion] = useState("All");
  const [view, setView] = useState<"const" | "compact">("const");

  // Track Competitor Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compName, setCompName] = useState("");
  const [compWebsite, setCompWebsite] = useState("");
  const [compDomain, setCompDomain] = useState("");
  const [compThreat, setCompThreat] = useState("medium");
  const [compRegion, setCompRegion] = useState("North America");
  const [submitting, setSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { data: competitorsData = mockCompetitors, refetch } = useQuery({
    queryKey: ["competitors"],
    queryFn: () => api.getCompetitors(),
    retry: false,
  });

  const handleTrackCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName || !compWebsite) {
      toast.error("Please provide name and website");
      return;
    }

    setSubmitting(true);
    const domainName = compDomain || compWebsite.replace(/https?:\/\/(www\.)?/, "").split("/")[0];

    try {
      await api.createCompetitor({
        name: compName,
        website: compWebsite,
        domain: domainName,
        industry: "Software",
        threatLevel: compThreat,
        region: compRegion,
      });

      toast.success(`${compName} is now tracked!`);
      setIsModalOpen(false);
      // Reset form
      setCompName("");
      setCompWebsite("");
      setCompDomain("");
      setCompThreat("medium");
      setCompRegion("North America");
      // Refetch
      queryClient.invalidateQueries({ queryKey: ["competitors"] });
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to save to database. Added to session sandbox.");
      // Fallback: Simulate adding locally
      competitorsData.push({
        id: Math.random().toString(),
        name: compName,
        domain: domainName,
        code: compName.slice(0, 2).toUpperCase(),
        threatLevel: compThreat as any,
        threat: compThreat === "critical" ? 85 : compThreat === "high" ? 70 : compThreat === "medium" ? 50 : 25,
        activity: 40,
        region: compRegion,
        summary: `Strategic briefing covering ${compName}'s software assets.`,
        last: "Track initialized",
      });
      setIsModalOpen(false);
      setCompName("");
      setCompWebsite("");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = competitorsData.filter((c: any) => {
    const level = c.threatLevel || (c.threat > 75 ? "critical" : c.threat > 50 ? "high" : c.threat > 25 ? "medium" : "low");
    const reg = c.region || "North America";
    return (
      (threat === "All" || level === threat.toLowerCase()) &&
      (region === "All" || reg === region)
    );
  });

  return (
    <AppShell crumb="COMPETITORS">
      <PageHeader
        eyebrow="Constellation Board"
        title="Tracked"
        highlight="competitors"
        subtitle={`${filtered.length} entities in your intelligence field`}
        right={
          <div className="flex items-center gap-2">
            <div className="glass flex rounded-full p-1">
              <button onClick={() => setView("const")} className={`rounded-full px-3 py-1.5 text-xs ${view === "const" ? "bg-[#00D4FF]/15 text-[#7DD3FC]" : "text-slate-400"}`}>
                <OrbitIcon className="inline h-3.5 w-3.5 mr-1" />Constellation
              </button>
              <button onClick={() => setView("compact")} className={`rounded-full px-3 py-1.5 text-xs ${view === "compact" ? "bg-[#00D4FF]/15 text-[#7DD3FC]" : "text-slate-400"}`}>
                <Grid3x3 className="inline h-3.5 w-3.5 mr-1" />Compact
              </button>
            </div>
            <GlowButton onClick={() => setIsModalOpen(true)}><Plus className="h-4 w-4" /> Track competitor</GlowButton>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Filters</span>
        </div>
        <FilterGroup label="Threat" value={threat} onChange={setThreat} options={["All", "Critical", "High", "Medium", "Low"]} />
        <FilterGroup label="Region" value={region} onChange={setRegion} options={["All", "North America", "Europe", "APAC"]} />
      </div>

      <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-4`}>
        {filtered.map((c: any) => {
          const code = c.code || c.name?.slice(0, 2).toUpperCase() || "CP";
          const threatLevelStr = c.threatLevel || (c.threat > 75 ? "critical" : c.threat > 50 ? "high" : c.threat > 25 ? "medium" : "low");
          const threatVal = c.threat ?? 50;
          const activityVal = c.activity ?? 30;
          const lastEvent = c.last || "No recent updates detected";
          const uniqueId = c.id || Math.random().toString();
          return (
            <GlassCard key={uniqueId} hover className="p-7">
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border font-mono text-[11px]" style={{ borderColor: threatColor(threatLevelStr), color: threatColor(threatLevelStr), background: `${threatColor(threatLevelStr)}12` }}>{code}</div>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: threatColor(threatLevelStr) }}>
                  <span className="h-1.5 w-1.5 rounded-full animate-glow-pulse" style={{ background: threatColor(threatLevelStr) }} />
                  {threatLevelStr}
                </span>
              </div>
              <div className="mt-6">
                <div className="font-display text-3xl">{c.name}</div>
                <div className="mt-1 font-mono text-xs text-[#7DD3FC]">{c.domain || c.website}</div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-slate-400">{c.summary || c.description || "Intelligence telemetry is compiling for this asset node. Initializing background crawler..."}</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase text-slate-500">Threat</div>
                  <div className="font-mono text-2xl" style={{ color: threatColor(threatLevelStr) }}>{threatVal}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase text-slate-500">Activity</div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#00D4FF]" style={{ width: `${activityVal}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-white/5 pt-4 text-xs">
                <span className="text-slate-500">Last: </span><span className="text-slate-300">{lastEvent}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Track Competitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <GlassCard className="w-full max-w-lg border border-white/10 p-8 shadow-2xl bg-gradient-to-b from-[#151F35] to-[#0E1628]">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-2xl text-white">Track New Competitor</h3>
                <p className="text-xs text-slate-400">Deploy AI crawler to index marketing rate sheets, blogs, and code changes.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full border border-white/5 p-1.5 text-slate-400 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTrackCompetitor} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-450 font-bold">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Linear"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-2.5 text-sm text-white placeholder-slate-550 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-455 font-bold">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://linear.app"
                    value={compWebsite}
                    onChange={(e) => setCompWebsite(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-2.5 text-sm text-white placeholder-slate-550 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-455 font-bold">Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="linear.app"
                    value={compDomain}
                    onChange={(e) => setCompDomain(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-2.5 text-sm text-white placeholder-slate-550 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-455 font-bold">Threat Level</label>
                  <select
                    value={compThreat}
                    onChange={(e) => setCompThreat(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-2.5 text-sm text-white focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-455 font-bold">Region</label>
                  <select
                    value={compRegion}
                    onChange={(e) => setCompRegion(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-2.5 text-sm text-white focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                  >
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="APAC">APAC</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-white/5 pt-6">
                <GhostButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</GhostButton>
                <GlowButton type="submit" disabled={submitting}>
                  {submitting ? "Initializing Crawl..." : "Start Tracking Node"}
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </AppShell>
  );
}

function FilterGroup({ label, value, onChange, options }: any) {
  return (
    <div className="flex items-center gap-2 glass rounded-full px-2 py-1">
      <span className="pl-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
      <div className="flex">
        {options.map((o: string) => (
          <button key={o} onClick={() => onChange(o)}
            className={`rounded-full px-3 py-1 text-xs transition ${value === o ? "bg-[#00D4FF]/15 text-[#7DD3FC]" : "text-slate-400 hover:text-white"}`}>{o}</button>
        ))}
      </div>
    </div>
  );
}
