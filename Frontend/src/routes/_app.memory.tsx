import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  Sliders,
  Calendar,
  Sparkles,
  GitCompare,
  Plus,
  Minus,
  Check,
  X,
  ArrowRightLeft,
} from "lucide-react";
import { Panel } from "@/components/app/Panel";
import { memoryComparisons, competitors } from "@/data/mock";

export const Route = createFileRoute("/_app/memory")({
  head: () => ({ meta: [{ title: "AI Memory Snapshot Diffs — CompetiLens AI" }] }),
  component: MemoryPage,
});

// Mock snapshots mapping for dates comparison
const snapshots: Record<string, any> = {
  Linear: {
    "Aug 12, 2026": {
      score: 84,
      arr: "$41M",
      featuresCount: 42,
      pricing: "$8 / user",
      swot: {
        strengths: ["Clean UI & quick key shortcuts", "Aggressive release cycles"],
        weaknesses: ["Sparse BI reports", "High pricing metrics"],
      },
      features: { "AI autocomplete": true, "Realtime collab": false, "Offline mode": false },
    },
    "Nov 12, 2026": {
      score: 92,
      arr: "$52M",
      featuresCount: 56,
      pricing: "$10 / user",
      swot: {
        strengths: ["Clean UI & quick key shortcuts", "Aggressive release cycles", "Best-in-class UX & performance"],
        weaknesses: ["Sparse BI reports"],
      },
      features: { "AI autocomplete": true, "Realtime collab": true, "Offline mode": true },
    },
  },
  Notion: {
    "Jul 30, 2026": {
      score: 82,
      arr: "$420M",
      featuresCount: 128,
      pricing: "$10 / user",
      swot: {
        strengths: ["All-in-one workspace flexibility", "Vast template ecosystem"],
        weaknesses: ["Performance lag on big tables", "Learning curve"],
      },
      features: { "AI autocomplete": true, "Realtime collab": true, "Offline mode": false },
    },
    "Nov 09, 2026": {
      score: 87,
      arr: "$500M",
      featuresCount: 141,
      pricing: "$12 / user",
      swot: {
        strengths: ["All-in-one workspace flexibility", "Vast template ecosystem", "AI-native meeting digests"],
        weaknesses: ["Performance lag on big tables"],
      },
      features: { "AI autocomplete": true, "Realtime collab": true, "Offline mode": false },
    },
  },
  Vercel: {
    "Aug 01, 2026": {
      score: 86,
      arr: "$110M",
      featuresCount: 64,
      pricing: "$20 / user",
      swot: {
        strengths: ["Fast edge deployments", "Seamless React pipelines"],
        weaknesses: ["Bandwidth costs concern"],
      },
      features: { "AI autocomplete": false, "Realtime collab": true, "Offline mode": false },
    },
    "Nov 05, 2026": {
      score: 90,
      arr: "$140M",
      featuresCount: 78,
      pricing: "$20 / user",
      swot: {
        strengths: ["Fast edge deployments", "Seamless React pipelines", "AI-generated v0 code UI models"],
        weaknesses: ["Bandwidth costs concern", "Cold starts on serverless functions"],
      },
      features: { "AI autocomplete": true, "Realtime collab": true, "Offline mode": false },
    },
  },
};

function MemoryPage() {
  const [comp1, setComp1] = useState("Linear");
  const [comp2, setComp2] = useState("Notion");
  const [date1, setDate1] = useState("Aug 12, 2026");
  const [date2, setDate2] = useState("Nov 12, 2026");

  // Snapshots for selected competitor
  const snapshotsComp1 = snapshots[comp1] || snapshots.Linear;
  const snapshotsComp2 = snapshots[comp2] || snapshots.Notion;

  const datesComp1 = Object.keys(snapshotsComp1);
  const datesComp2 = Object.keys(snapshotsComp2);

  // Check valid selected dates
  const snap1 = snapshotsComp1[date1] || snapshotsComp1[datesComp1[0]];
  const snap2 = snapshotsComp1[date2] || snapshotsComp1[datesComp1[1] || datesComp1[0]];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs text-primary uppercase tracking-[0.16em]">AI Memory</div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Memory snapshot Diff
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a competitor and compare database snapshots over time to trace additions (+) and deletions (-).
        </p>
      </motion.div>

      {/* Selectors card */}
      <Panel>
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-4 items-center">
          
          {/* Competitor selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Competitor</label>
            <div className="relative">
              <GitCompare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <select
                value={comp1}
                onChange={(e) => {
                  setComp1(e.target.value);
                  const availableDates = Object.keys(snapshots[e.target.value]);
                  setDate1(availableDates[0]);
                  setDate2(availableDates[1] || availableDates[0]);
                }}
                className="w-full h-10.5 pl-9 pr-8 rounded-xl bg-background border border-border text-xs.5 font-semibold text-muted-foreground focus:outline-none cursor-pointer appearance-none"
              >
                {Object.keys(snapshots).map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date A Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Snapshot Date A</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full h-10.5 pl-9 pr-8 rounded-xl bg-background border border-border text-xs.5 font-semibold text-muted-foreground focus:outline-none cursor-pointer appearance-none"
              >
                {datesComp1.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date B Select */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Snapshot Date B</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full h-10.5 pl-9 pr-8 rounded-xl bg-background border border-border text-xs.5 font-semibold text-muted-foreground focus:outline-none cursor-pointer appearance-none"
              >
                {datesComp1.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </Panel>

      {/* Side-by-side Diffs */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Left Side: Summary Metrics Diffs */}
        <div className="space-y-6">
          <Panel title="Metric Diffs" subtitle="Snapshot value shifts">
            <div className="space-y-4 mt-2">
              
              {/* Threat Score delta */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card/65">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Threat Score</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{date1} vs {date2}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">{snap1.score}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-extrabold text-slate-800">{snap2.score}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${snap2.score >= snap1.score ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
                    {snap2.score >= snap1.score ? `+${snap2.score - snap1.score}` : `-${snap1.score - snap2.score}`}
                  </span>
                </div>
              </div>

              {/* ARR delta */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card/65">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Est. ARR</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{date1} vs {date2}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">{snap1.arr}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-extrabold text-slate-800">{snap2.arr}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-success/10 text-success">
                    Increase
                  </span>
                </div>
              </div>

              {/* Features count */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card/65">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Index Features count</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{date1} vs {date2}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">{snap1.featuresCount}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-extrabold text-slate-800">{snap2.featuresCount}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-success/10 text-success">
                    +{snap2.featuresCount - snap1.featuresCount}
                  </span>
                </div>
              </div>

              {/* Pricing delta */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card/65">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Base Seat Pricing</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{date1} vs {date2}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">{snap1.pricing}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-extrabold text-slate-800">{snap2.pricing}</span>
                </div>
              </div>

            </div>
          </Panel>

          {/* Feature Matrix compare */}
          <Panel title="Feature Matrix Diffs" subtitle="Head-to-head capability state changes">
            <div className="divide-y divide-border/60">
              {Object.keys(snap1.features).map((feat) => {
                const state1 = snap1.features[feat];
                const state2 = snap2.features[feat];
                const changed = state1 !== state2;

                return (
                  <div key={feat} className="flex items-center justify-between py-3.5">
                    <span className="text-xs.5 font-bold text-slate-850">{feat}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{state1 ? "Enabled" : "Disabled"}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className={`text-xs.5 font-bold ${changed ? (state2 ? "text-success font-extrabold" : "text-danger") : "text-slate-800"}`}>
                        {state2 ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* Right Side: SWOT Diff & Timeline visual */}
        <div className="space-y-6">
          <Panel title="SWOT Diffs" subtitle="Green additions (+), Red deletions (-)">
            <div className="space-y-4 mt-2">
              
              {/* Strengths Diff */}
              <div className="space-y-2">
                <div className="text-[10.5px] font-extrabold text-success uppercase tracking-wider">Strengths Diff</div>
                <div className="p-3.5 rounded-xl border border-success/20 bg-success/5 space-y-2">
                  {/* Find additions */}
                  {snap2.swot.strengths.map((str: string) => {
                    const isNew = !snap1.swot.strengths.includes(str);
                    return (
                      <div key={str} className={`flex items-start gap-2 text-xs.5 ${isNew ? "text-success font-bold" : "text-muted-foreground"}`}>
                        {isNew ? <Plus className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 ml-1 shrink-0" />}
                        <span>{str}</span>
                      </div>
                    );
                  })}
                  {/* Find deletions */}
                  {snap1.swot.strengths.map((str: string) => {
                    const isRemoved = !snap2.swot.strengths.includes(str);
                    if (!isRemoved) return null;
                    return (
                      <div key={str} className="flex items-start gap-2 text-xs.5 text-danger line-through opacity-70">
                        <Minus className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>{str}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weaknesses Diff */}
              <div className="space-y-2">
                <div className="text-[10.5px] font-extrabold text-danger uppercase tracking-wider">Weaknesses Diff</div>
                <div className="p-3.5 rounded-xl border border-danger/20 bg-danger/5 space-y-2">
                  {/* Find additions */}
                  {snap2.swot.weaknesses.map((wk: string) => {
                    const isNew = !snap1.swot.weaknesses.includes(wk);
                    return (
                      <div key={wk} className={`flex items-start gap-2 text-xs.5 ${isNew ? "text-danger font-bold" : "text-muted-foreground"}`}>
                        {isNew ? <Plus className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 ml-1 shrink-0" />}
                        <span>{wk}</span>
                      </div>
                    );
                  })}
                  {/* Find deletions */}
                  {snap1.swot.weaknesses.map((wk: string) => {
                    const isRemoved = !snap2.swot.weaknesses.includes(wk);
                    if (!isRemoved) return null;
                    return (
                      <div key={wk} className="flex items-start gap-2 text-xs.5 text-success line-through opacity-70">
                        <Minus className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>{wk}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </Panel>

          {/* Quick recommendations based on diff */}
          <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs.5 font-extrabold text-primary uppercase tracking-wider">Agent Intelligence recommendation</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {comp1} has shipped key product changes and increased ARR between these snapshots. We recommend matching their tier updates to retain middle tier customers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
