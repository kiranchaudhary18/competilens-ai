import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GlassCard, Eyebrow } from "@/components/app/ui";
import { memoryTracks } from "@/lib/mockData";
import { useState } from "react";

export const Route = createFileRoute("/memory")({
  head: () => ({ meta: [{ title: "Memory — CompetiLens AI" }] }),
  component: Memory,
});

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];
const competitors = ["All", "Acme", "Vertex", "Nova", "Pulse"];
const kinds = ["All", "Pricing", "Product", "Reviews", "Expansion", "Partnership"];

function Memory() {
  const [c, setC] = useState("All");
  const [k, setK] = useState("All");
  return (
    <AppShell crumb="MEMORY">
      <PageHeader eyebrow="Temporal Memory Map" title="Patterns across" highlight="time." subtitle="Connected historical intelligence — not just events."
        right={
          <div className="flex flex-wrap gap-2">
            <FilterRow label="Competitor" value={c} onChange={setC} options={competitors} />
            <FilterRow label="Kind" value={k} onChange={setK} options={kinds} />
          </div>
        }
      />

      <GlassCard className="p-8">
        <Eyebrow>Pattern Detected</Eyebrow>
        <p className="mt-4 font-display text-3xl italic leading-snug text-gradient">
          "Three pricing reductions preceded enterprise expansion. Watch for a fourth within 60 days."
        </p>
      </GlassCard>

      <GlassCard className="mt-6 p-8">
        <div className="relative">
          {/* Month header */}
          <div className="mb-4 grid grid-cols-7 pl-12">
            {months.map(m => (
              <div key={m} className="font-mono text-[10px] uppercase tracking-widest text-slate-500 text-center">{m}</div>
            ))}
          </div>
          {/* Track rows */}
          <div className="space-y-14">
            {memoryTracks.map(track => (
              <div key={track.code} className="relative pl-12">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-xs" style={{ color: track.tint }}>{track.code}</div>
                {/* Curve svg */}
                <svg viewBox="0 0 700 60" className="h-14 w-full overflow-visible">
                  <path d={`M 0 30 Q 175 5, 350 30 T 700 30`} fill="none" stroke={track.tint} strokeOpacity="0.25" strokeWidth="1" />
                  {track.events.map((e, i) => {
                    const x = (e.m / 6) * 700;
                    return (
                      <g key={i}>
                        <text x={x} y="18" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="Inter">{e.label}</text>
                        <circle cx={x} cy="34" r="8" fill="#0B1220" stroke={track.tint} strokeWidth="1.5" />
                        <circle cx={x} cy="34" r="3" fill={track.tint} />
                        <circle cx={x} cy="34" r="14" fill={track.tint} fillOpacity="0.08" className="animate-pulse" />
                      </g>
                    );
                  })}
                </svg>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </AppShell>
  );
}

function FilterRow({ label, value, onChange, options }: any) {
  return (
    <div className="glass flex items-center rounded-full px-2 py-1">
      <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
      {options.map((o: string) => (
        <button key={o} onClick={() => onChange(o)} className={`rounded-full px-3 py-1 text-xs transition duration-200 ${value === o ? "bg-[#38BDF8]/15 text-[#38BDF8]" : "text-slate-400 hover:text-white"}`}>{o}</button>
      ))}
    </div>
  );
}
