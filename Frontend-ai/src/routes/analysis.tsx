import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard, GlowButton, Eyebrow } from "@/components/app/ui";
import { Sparkles, Send, Search, DollarSign, Heart, Newspaper, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/analysis")({
  head: () => ({ meta: [{ title: "Analysis — CompetiLens AI" }] }),
  component: Analysis,
});

const agents = [
  { name: "Research Agent", icon: Search, tint: "#5CA9FF" },
  { name: "Pricing Agent", icon: "#31D88A", rawIcon: DollarSign }, // Let's keep DollarSign dynamically but override color
  { name: "Sentiment Agent", icon: "#F36B73", rawIcon: Heart },
  { name: "News Agent", icon: "#B68CFF", rawIcon: Newspaper },
  { name: "Strategy Agent", icon: "#F4B84F", rawIcon: TrendingUp },
];

// Helper to resolve icon & tint for the agents array
const agentList = [
  { name: "Research Agent", icon: Search, tint: "#5CA9FF" },
  { name: "Pricing Agent", icon: DollarSign, tint: "#31D88A" },
  { name: "Sentiment Agent", icon: Heart, tint: "#F36B73" },
  { name: "News Agent", icon: Newspaper, tint: "#B68CFF" },
  { name: "Strategy Agent", icon: TrendingUp, tint: "#F4B84F" },
];

const suggested = ["Why did Nova reviews drop?", "How is Vertex positioned in EU?", "What is Acme's next likely move?"];

function Analysis() {
  const [q, setQ] = useState("Why is Acme gaining enterprise customers?");
  const [running, setRunning] = useState(false);

  const investigate = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 4000);
  };

  return (
    <AppShell crumb="ANALYSIS">
      <PageHeader eyebrow="Investigation Studio" title="State a" highlight="strategic question." subtitle="Five specialized agents will investigate in parallel." />

      <GlassCard className="p-8 bg-[#151F35]/60 border border-white/8">
        <Eyebrow>Strategic Objective</Eyebrow>
        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-3">
          <Sparkles className="h-5 w-5 shrink-0 text-[#726BFF]" />
          <input value={q} onChange={e => setQ(e.target.value)}
            className="flex-1 bg-transparent text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none" />
          <GlowButton onClick={investigate}>
            <Send className="h-4 w-4" /> {running ? "Investigating…" : "Investigate"}
          </GlowButton>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggested.map(s => (
            <button key={s} onClick={() => setQ(s)} className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400 hover:border-[#726BFF]/30 hover:text-slate-200 transition">{s}</button>
          ))}
        </div>
      </GlassCard>

      <div className="mt-10">
        <Eyebrow>Specialized Agents</Eyebrow>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          {agentList.map((a, i) => (
            <GlassCard key={a.name} className="p-5 bg-[#151F35]/60 border border-white/8">
              <div className="flex items-center gap-2">
                <a.icon className="h-4 w-4" style={{ color: a.tint }} />
                <span className="text-sm text-slate-200 font-semibold">{a.name}</span>
              </div>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate-500">{running ? "Working…" : "Idle"}</div>
              <div className="mt-2 h-1 rounded-full bg-white/[0.03] overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: running ? "100%" : "0%",
                    background: a.tint,
                    boxShadow: running ? `0 0 10px ${a.tint}` : undefined,
                    transitionDuration: `${1800 + i * 300}ms`
                  }} />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Evidence + insights */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 p-7 bg-[#151F35]/60 border border-white/8">
          <Eyebrow>Synthesized Insight</Eyebrow>
          <h3 className="mt-3 font-display text-3xl leading-tight font-bold text-slate-100">
            Acme is winning enterprise on <span className="italic text-gradient">three vectors</span>: pricing, ecosystem, and hiring.
          </h3>
          <div className="mt-6 space-y-4 text-sm text-slate-350">
            <p><span className="font-mono text-[#726BFF] font-bold mr-2">01</span> Acme's Pro plan cut of 18% removes the primary mid-market objection.</p>
            <p><span className="font-mono text-[#726BFF] font-bold mr-2">02</span> Snowflake and Databricks integrations announced within 30 days close the "our data lives elsewhere" pushback.</p>
            <p><span className="font-mono text-[#726BFF] font-bold mr-2">03</span> 22 enterprise AE reqs opened in NA, doubling their capacity vs Q1.</p>
          </div>
          <div className="mt-6 flex items-center gap-4 border-t border-white/6 pt-4 text-xs text-slate-500">
            <span className="font-mono text-[#B68CFF] font-bold">Confidence 91%</span>
            <span>· 41 evidence items · 5 agents · 12s</span>
          </div>
        </GlassCard>
        <GlassCard className="p-7 bg-[#151F35]/60 border border-white/8">
          <Eyebrow>Evidence</Eyebrow>
          <div className="mt-4 space-y-3">
            {[
              { s: "acme.io/pricing", t: "18% Pro cut confirmed" },
              { s: "acme.io/blog", t: "Snowflake alliance post" },
              { s: "linkedin/acme", t: "14 enterprise AE openings" },
              { s: "g2.com/acme", t: "Enterprise reviews +38%" },
              { s: "sec.gov", t: "Q1 revenue mix shift" },
            ].map((e, i) => (
              <div key={i} className="rounded-xl border border-white/6 bg-[#1C2840]/30 p-3">
                <div className="font-mono text-[10px] text-[#5CA9FF]">{e.s}</div>
                <div className="mt-1 text-sm text-slate-200">{e.t}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
