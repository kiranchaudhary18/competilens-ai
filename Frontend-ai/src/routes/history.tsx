import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard } from "@/components/app/ui";
import { history } from "@/lib/mockData";
import { Radio, Search, FileText, Bell, Brain, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — CompetiLens AI" }] }),
  component: History,
});

const kindMeta: Record<string, any> = {
  "SIGNAL DETECTED": { icon: Radio, tint: "#726BFF" },
  "INVESTIGATION": { icon: Search, tint: "#5CA9FF" },
  "REPORT": { icon: FileText, tint: "#B68CFF" },
  "ALERT": { icon: Bell, tint: "#F36B73" },
  "MEMORY": { icon: Brain, tint: "#F4B84F" },
  "COMPETITOR ADDED": { icon: Plus, tint: "#31D88A" },
};
const tabs = ["All", "Signal Detected", "Investigation", "Report", "Alert", "Memory", "Competitor Added"];

function History() {
  const [tab, setTab] = useState("All");
  return (
    <AppShell crumb="HISTORY">
      <PageHeader eyebrow="Intelligence Filmstrip" title="Everything that" highlight="happened."
        right={
          <div className="glass flex rounded-full p-1 bg-white/[0.02] border-white/8 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${tab === t ? "bg-[#726BFF]/15 text-[#B68CFF]" : "text-slate-400 hover:text-slate-200"}`}>{t}</button>
            ))}
          </div>
        } />

      <div className="space-y-12">
        {history.map(group => {
          const items = tab === "All" ? group.items : group.items.filter(i => i.kind.toLowerCase() === tab.toLowerCase());
          if (items.length === 0) return null;
          return (
            <div key={group.day}>
              <div className="mb-4 flex items-center justify-between">
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#726BFF] font-bold">{group.day}</div>
                <div className="font-mono text-xs text-slate-400">{items.length} events</div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {items.map((it, i) => {
                  const meta = kindMeta[it.kind] || kindMeta["SIGNAL DETECTED"];
                  const Icon = meta.icon;
                  return (
                    <GlassCard key={i} hover className="p-6 bg-[#151F35]/60 border border-white/8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: `${meta.tint}18`, color: meta.tint }}>
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: meta.tint }}>{it.kind}</span>
                        </div>
                        <span className="font-mono text-xs text-slate-500">{it.time}</span>
                      </div>
                      <h3 className="mt-4 text-base leading-snug font-bold text-slate-100">{it.title}</h3>
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed">{it.detail}</p>
                      <div className="mt-6 border-t border-white/6 pt-3 font-mono text-[11px] text-slate-500">by {it.author}</div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
