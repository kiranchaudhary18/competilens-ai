import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard, GhostButton } from "@/components/app/ui";
import { reports } from "@/lib/mockData";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — CompetiLens AI" }] }),
  component: Reports,
});

const tabs = ["all", "Executive", "SWOT", "Pricing", "Market", "Competitor"];

import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const tabs = ["all", "Executive", "SWOT", "Pricing", "Market", "Competitor"];

function Reports() {
  const [tab, setTab] = useState("all");

  const { data: reportsData = reports } = useQuery({
    queryKey: ["reports"],
    queryFn: () => api.getReports(),
    retry: false,
  });

  const featured = reportsData.find((r: any) => r.tag === "featured") || reportsData[0] || reports[0];
  const list = reportsData.filter((r: any) => r.id !== featured.id && (tab === "all" || r.kind === tab));

  return (
    <AppShell crumb="REPORTS">
      <PageHeader eyebrow="Intelligence Dossiers" title="The" highlight="Archive." subtitle="Editorial-grade briefings, produced by your intelligence system."
        right={
          <div className="glass flex rounded-full p-1 bg-white/[0.02] border-white/8 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-xs capitalize font-semibold transition ${tab === t ? "bg-[#726BFF]/15 text-[#B68CFF]" : "text-slate-400 hover:text-slate-200"}`}>{t}</button>
            ))}
          </div>
        } />

      {/* Featured */}
      {featured && (
        <GlassCard className="p-10 md:p-14 bg-[#151F35]/60 border border-white/8" hover>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_top_right,rgba(114,107,255,0.12),transparent_70%)]" />
          <div className="relative">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#726BFF] font-bold">
              FEATURED · {(featured.kind || "Executive").toUpperCase()} · {featured.period || "JUL 2026"}
            </div>
            <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] md:text-6xl font-bold text-slate-100">{featured.title}</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-400 leading-relaxed">{featured.subtitle}</p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <div>
                <div className="font-mono text-[10px] uppercase text-slate-500 font-semibold">Confidence</div>
                <div className="mt-1 font-mono text-2xl text-[#B68CFF] font-bold">{featured.confidence || 85}%</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase text-slate-500 font-semibold">Covers</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(featured.covers || ["Acme"]).map((c: string) => <span key={c} className="font-mono text-xs text-slate-350">{c.toUpperCase()}</span>).reduce((prev: any, curr: any, i: number) => i === 0 ? [curr] : [...(prev as any), <span key={`d${i}`} className="text-slate-600">·</span>, curr], [] as any)}
                </div>
              </div>
              <div className="ml-auto">
                <GhostButton className="border-[#726BFF]/40 text-[#B68CFF] hover:bg-[#726BFF]/10">Open dossier <ArrowRight className="h-4 w-4" /></GhostButton>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r: any) => (
          <GlassCard key={r.id} hover className="p-8 bg-[#151F35]/60 border border-white/8">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#726BFF] font-bold">
              {(r.kind || "Pricing").toUpperCase()} · {r.period || "JUL 2026"}
            </div>
            <h3 className="mt-6 font-display text-3xl leading-tight font-bold text-slate-100">{r.title}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{r.subtitle}</p>
            <div className="mt-16 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full animate-glow-pulse`} style={{ background: r.status === "ready" ? "#31D88A" : "#F4B84F" }} />
                <span className="font-mono uppercase font-bold" style={{ color: r.status === "ready" ? "#31D88A" : "#F4B84F" }}>{r.status || "ready"}</span>
              </span>
              <span className="font-mono text-[#5CA9FF] font-bold">{r.confidence || 80}% conf</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
