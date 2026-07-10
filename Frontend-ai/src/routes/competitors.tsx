import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard, Chip, GlowButton } from "@/components/app/ui";
import { competitors, threatColor } from "@/lib/mockData";
import { Plus, Grid3x3, Orbit as OrbitIcon, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/competitors")({
  head: () => ({ meta: [{ title: "Competitors — CompetiLens AI" }] }),
  component: Competitors,
});

function Competitors() {
  const [threat, setThreat] = useState("All");
  const [region, setRegion] = useState("All");
  const [view, setView] = useState<"const" | "compact">("const");

  const filtered = competitors.filter(c =>
    (threat === "All" || c.threatLevel === threat.toLowerCase()) &&
    (region === "All" || c.region === region)
  );

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
            <GlowButton><Plus className="h-4 w-4" /> Track competitor</GlowButton>
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

      <div className={`grid gap-5 ${view === "compact" ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-4"}`}>
        {filtered.map(c => (
          <GlassCard key={c.id} hover className="p-7">
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border font-mono text-[11px]" style={{ borderColor: threatColor(c.threatLevel), color: threatColor(c.threatLevel), background: `${threatColor(c.threatLevel)}12` }}>{c.code}</div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: threatColor(c.threatLevel) }}>
                <span className="h-1.5 w-1.5 rounded-full animate-glow-pulse" style={{ background: threatColor(c.threatLevel) }} />
                {c.threatLevel}
              </span>
            </div>
            <div className="mt-6">
              <div className="font-display text-3xl">{c.name}</div>
              <div className="mt-1 font-mono text-xs text-[#7DD3FC]">{c.domain}</div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-slate-400">{c.summary}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase text-slate-500">Threat</div>
                <div className="font-mono text-2xl" style={{ color: threatColor(c.threatLevel) }}>{c.threat}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-slate-500">Activity</div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#4F8CFF] to-[#00D4FF]" style={{ width: `${c.activity}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-white/5 pt-4 text-xs">
              <span className="text-slate-500">Last: </span><span className="text-slate-300">{c.last}</span>
            </div>
          </GlassCard>
        ))}
      </div>
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
