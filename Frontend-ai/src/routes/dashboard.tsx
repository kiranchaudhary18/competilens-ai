import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, Eyebrow, Chip, Sparkline, GlowButton } from "@/components/app/ui";
import { competitors, signals, threatColor, signalColor } from "@/lib/mockData";
import { ArrowRight, TrendingUp, Zap, Brain, Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CompetiLens AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell crumb="DASHBOARD">
      <div className="mb-3 flex items-center gap-3">
        <Eyebrow>Command · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</Eyebrow>
      </div>
      <h1 className="font-display text-4xl leading-[1.1] tracking-tight md:text-5xl">
        Good evening, <span className="italic text-gradient-cyan">Narvin</span>.
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Your market moved in <span className="font-mono text-white">7</span> meaningful ways.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {/* Orbit */}
        <GlassCard className="lg:col-span-2 p-7">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Eyebrow>Competitor Orbit</Eyebrow>
              <p className="mt-1 text-sm text-slate-400">Proximity = similarity · Ring = threat · Size = activity</p>
            </div>
            <Link to="/competitors" className="text-xs text-[#7DD3FC] hover:underline">All competitors →</Link>
          </div>
          <Orbit />
        </GlassCard>

        {/* Signal stream */}
        <GlassCard className="p-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Eyebrow>Live Signal Stream</Eyebrow>
              <p className="mt-1 text-sm text-slate-400">The market, in real time</p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D4FF] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00D4FF]" />
            </span>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {signals.slice(0, 6).map((s) => (
              <div key={s.id} className="rounded-2xl border border-white/5 p-3 hover:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: signalColor(s.type), boxShadow: `0 0 8px ${signalColor(s.type)}` }} />
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: signalColor(s.type) }}>{s.type}</span>
                    <span className="text-[10px] text-slate-500">· {s.competitor}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#7DD3FC]">{s.confidence}%</span>
                </div>
                <div className="mt-1 text-sm">{s.title}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 2 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <GlassCard className="p-7">
          <Eyebrow>Executive Brief</Eyebrow>
          <p className="mt-4 font-display text-2xl leading-snug">
            "Acme's pricing move and Vertex's AI Search shift the mid-market center of gravity — expect enterprise pressure within 30 days."
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
            <span className="font-mono text-[#7DD3FC]">92% confidence</span>
            <span>· 12 pages · 41 evidence items</span>
          </div>
          <GlowButton as={Link} {...({ to: "/reports" } as any)} className="mt-6">
            Open dossier <ArrowRight className="h-4 w-4" />
          </GlowButton>
        </GlassCard>

        <GlassCard className="p-7">
          <Eyebrow>Threat Register</Eyebrow>
          <div className="mt-4 space-y-3">
            {competitors.map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full border font-mono text-[10px]" style={{ borderColor: threatColor(c.threatLevel), color: threatColor(c.threatLevel) }}>{c.code}</span>
                  <div>
                    <div className="text-sm">{c.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{c.threatLevel}</div>
                  </div>
                </div>
                <div className="font-mono text-xl" style={{ color: threatColor(c.threatLevel) }}>{c.threat}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <Eyebrow>Signal Trend · 30d</Eyebrow>
          <div className="mt-3 font-display text-5xl">
            142 <span className="text-lg text-slate-500">signals</span>
          </div>
          <div className="mt-1 font-mono text-xs text-emerald-400">▲ 23% vs last month</div>
          <div className="mt-6">
            <Sparkline points={[8, 12, 10, 14, 11, 16, 15, 20, 18, 22, 19, 26, 24, 28, 31, 29, 34, 32, 38, 42]} color="#00D4FF" width={280} height={70} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { l: "Pricing", n: 18, c: "#EF4444" },
              { l: "Product", n: 42, c: "#4F8CFF" },
              { l: "Hiring", n: 27, c: "#22C55E" },
            ].map(x => (
              <div key={x.l} className="rounded-xl border border-white/5 p-2">
                <div className="font-mono text-lg" style={{ color: x.c }}>{x.n}</div>
                <div className="text-slate-500">{x.l}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 3 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <GlassCard className="p-7">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#7DD3FC]" />
            <Eyebrow>AI Recommendations</Eyebrow>
          </div>
          <div className="space-y-3">
            {[
              { t: "Draft a pricing response memo", w: "Acme's cut compresses your Pro tier margin. 48h window recommended." },
              { t: "Open Vertex enterprise investigation", w: "14 AE roles + AI Search signal a coordinated NA push." },
              { t: "Reach out to 12 at-risk Nova customers", w: "Sentiment decline overlaps with your ICP." },
            ].map((r, i) => (
              <div key={i} className="group flex items-start gap-3 rounded-2xl border border-white/5 p-4 hover:border-[#00D4FF]/30">
                <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#00D4FF]/15 text-[#7DD3FC]"><Zap className="h-3 w-3" /></span>
                <div className="min-w-0">
                  <div className="text-sm">{r.t}</div>
                  <div className="text-xs text-slate-500">{r.w}</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-[#00D4FF]" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#FACC15]" />
            <Eyebrow>Recent Activity</Eyebrow>
          </div>
          <div className="space-y-4">
            {[
              { t: "14:20", k: "SIGNAL", h: "Acme reduced Pro pricing by 18%" },
              { t: "13:02", k: "INVESTIGATION", h: "Why is Acme gaining enterprise?" },
              { t: "10:12", k: "SIGNAL", h: "Vertex launched AI Search" },
              { t: "09:14", k: "MEMORY", h: "Acme × Snowflake linked to enterprise pattern" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-4 border-b border-white/5 pb-3 last:border-b-0">
                <div className="font-mono text-xs text-slate-500">{a.t}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#7DD3FC]">{a.k}</div>
                  <div className="text-sm">{a.h}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}

function Orbit() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.15),transparent_70%)]">
      <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full">
        {[100, 170, 240].map((r, i) => (
          <ellipse key={i} cx="400" cy="250" rx={r * 1.4} ry={r * 0.85}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2 6" />
        ))}
        {/* You in center */}
        <g>
          <circle cx="400" cy="250" r="34" fill="#0B1220" stroke="#38BDF8" strokeWidth={1.5} />
          <text x="400" y="248" textAnchor="middle" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="9">YOU</text>
          <text x="400" y="262" textAnchor="middle" fill="#F8FAFC" fontFamily="Inter" fontSize="12" fontWeight="600">Lattice</text>
        </g>
        {competitors.map(c => {
          const cx = (c.x / 100) * 800;
          const cy = (c.y / 100) * 500;
          const r = c.size / 3;
          return (
            <g key={c.id} className="animate-float" style={{ animationDelay: `${Math.random() * 3}s` }}>
              <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={threatColor(c.threatLevel)} strokeOpacity="0.15" />
              <circle cx={cx} cy={cy} r={r} fill="#0B1220" stroke={threatColor(c.threatLevel)} strokeWidth={1.5} />
              <text x={cx} y={cy + 3} textAnchor="middle" fill={threatColor(c.threatLevel)} fontFamily="JetBrains Mono" fontSize="10" fontWeight="600">{c.code}</text>
              <text x={cx} y={cy + r + 18} textAnchor="middle" fill="#F8FAFC" fontFamily="Inter" fontSize="12">{c.name}</text>
              <text x={cx} y={cy + r + 32} textAnchor="middle" fill="#64748B" fontFamily="JetBrains Mono" fontSize="10">T·{c.threat}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
