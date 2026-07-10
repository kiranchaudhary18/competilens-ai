import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard, GlowButton, GhostButton } from "@/components/app/ui";
import { alerts } from "@/lib/mockData";
import { Search, VolumeX } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — CompetiLens AI" }] }),
  component: Alerts,
});

const sev: Record<string, string> = { critical: "#F36B73", high: "#726BFF", medium: "#F4B84F", low: "#31D88A" };
const tabs = ["All", "Critical", "High", "Medium", "Low"];

function Alerts() {
  const [tab, setTab] = useState("All");
  const list = alerts.filter(a => tab === "All" || a.severity === tab.toLowerCase());
  return (
    <AppShell crumb="ALERTS">
      <PageHeader eyebrow="Priority Queue" title="What needs your" highlight="attention."
        right={
          <div className="glass flex rounded-full p-1 bg-white/[0.02] border-white/8">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${tab === t ? "bg-[#726BFF]/15 text-[#B68CFF]" : "text-slate-400 hover:text-slate-200"}`}>{t}</button>
            ))}
          </div>
        }
      />
      <div className="space-y-4">
        {list.map(a => (
          <GlassCard key={a.id} hover className="p-7 bg-[#151F35]/60 border border-white/8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full animate-glow-pulse" style={{ background: sev[a.severity], boxShadow: `0 0 14px ${sev[a.severity]}` }} />
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: sev[a.severity] }}>{a.severity}</span>
                    <span className="text-xs text-slate-500">· {a.competitor} · {a.time}</span>
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold text-slate-100">{a.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-relaxed">{a.body}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <GlowButton><Search className="h-4 w-4" /> Investigate</GlowButton>
                <GhostButton>Dismiss</GhostButton>
                <button title="Mute" className="grid h-10 w-10 place-items-center rounded-full border border-white/8 bg-white/[0.02] text-slate-400 hover:text-slate-200 transition"><VolumeX className="h-4 w-4" /></button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
