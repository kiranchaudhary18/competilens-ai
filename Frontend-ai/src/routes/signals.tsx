import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard } from "@/components/app/ui";
import { signals as mockSignals, signalColor, type SignalType } from "@/lib/mockData";
import { Filter, Radio, Grid3x3 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const Route = createFileRoute("/signals")({
  head: () => ({ meta: [{ title: "Signals — CompetiLens AI" }] }),
  component: Signals,
});

function Signals() {
  const [type, setType] = useState("All");
  const [sev, setSev] = useState("All");

  const { data: signalsData = mockSignals } = useQuery({
    queryKey: ["signals"],
    queryFn: () => api.getSignals(),
    retry: false,
  });

  const filtered = signalsData.filter((s: any) => {
    const sType = (s.type || "news").toLowerCase();
    const sSev = (s.severity || "medium").toLowerCase();
    return (
      (type === "All" || sType === type.toLowerCase()) &&
      (sev === "All" || sSev === sev.toLowerCase())
    );
  });

  return (
    <AppShell crumb="SIGNALS">
      <PageHeader eyebrow="Signal River" title="Every meaningful" highlight="move." subtitle={`${filtered.length} signals flowing · updated moments ago`}
        right={
          <div className="glass flex rounded-full p-1">
            <button className="rounded-full bg-[#00D4FF]/15 px-3 py-1.5 text-xs text-[#7DD3FC]"><Radio className="inline h-3.5 w-3.5 mr-1" />River</button>
            <button className="rounded-full px-3 py-1.5 text-xs text-slate-400"><Grid3x3 className="inline h-3.5 w-3.5 mr-1" />Compact</button>
          </div>
        } />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Filter className="h-3.5 w-3.5 text-slate-500" />
        <FilterRow label="Type" value={type} onChange={setType} options={["All", "Pricing", "Product", "Marketing", "Reviews", "Hiring", "Partnership", "News"]} />
        <FilterRow label="Severity" value={sev} onChange={setSev} options={["All", "Critical", "High", "Medium", "Low"]} />
      </div>

      <div className="space-y-4">
        {filtered.map((s: any, i: number) => {
          const sType = (s.type || "news").toLowerCase() as SignalType;
          const compName = s.competitor?.name || s.competitor || "Competitor";
          const uniqueId = s.id || Math.random().toString();
          const timeStr = s.time || new Date(s.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const dateStr = new Date(s.createdAt || Date.now()).toLocaleDateString([], { month: "numeric", day: "numeric" });
          const confidenceVal = s.confidence || 85;

          return (
            <GlassCard key={uniqueId} hover className="p-6" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start gap-5">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full animate-glow-pulse" style={{ background: signalColor(sType) || "#7DD3FC", boxShadow: `0 0 12px ${signalColor(sType) || "#7DD3FC"}` }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: signalColor(sType) || "#7DD3FC" }}>{sType}</span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{compName}</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{s.body || s.description || s.content}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-xs text-slate-500">{dateStr}, {timeStr}</div>
                  <div className="mt-2 inline-flex rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 px-2.5 py-1 font-mono text-[11px] text-[#7DD3FC]">{confidenceVal}%</div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppShell>
  );
}

function FilterRow({ label, value, onChange, options }: any) {
  return (
    <div className="glass flex items-center rounded-full px-2 py-1">
      <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
      {options.map((o: string) => (
        <button key={o} onClick={() => onChange(o)}
          className={`rounded-full px-3 py-1 text-xs ${value === o ? "bg-[#00D4FF]/15 text-[#7DD3FC]" : "text-slate-400 hover:text-white"}`}>{o}</button>
      ))}
    </div>
  );
}
