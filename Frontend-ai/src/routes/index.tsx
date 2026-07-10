import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles, ArrowRight, Radio, Brain, Target, FileText, Search,
  Zap, Shield, Globe, ChevronRight, Star, Play, Check, HelpCircle,
  Terminal, ShieldCheck, Cpu, Database, Eye, TrendingUp, Layers,
  ArrowUpRight, Mail, Command
} from "lucide-react";
import { GlassCard, GlowButton, GhostButton, Eyebrow, Sparkline } from "@/components/app/ui";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CompetiLens AI — See the market before it moves" },
      { name: "description", content: "The autonomous competitive intelligence platform for enterprise strategy teams. Track competitors, detect signals, and generate strategy dossiers." },
    ]
  }),
  component: Landing,
});

// Mock Logos
const LOGOS = [
  { name: "Stripe", url: "#" },
  { name: "Vercel", url: "#" },
  { name: "Linear", url: "#" },
  { name: "Apple", url: "#" },
  { name: "Figma", url: "#" },
  { name: "Retool", url: "#" },
  { name: "Pinecone", url: "#" }
];

// Interactive Agent Data
const AGENT_SHOWCASE = [
  {
    id: "research",
    name: "Research Agent",
    description: "Monitors changes across competitor websites, changelogs, dev docs, and job boards.",
    tint: "#4F8CFF",
    logs: [
      "[10:12:04] Initializing changelog scanner for vertex.ai...",
      "[10:12:06] Detected new deployment on endpoint /changelog",
      "[10:12:07] PARSED: Added 'AI-Powered Global Workspaces' section",
      "[10:12:08] Classification: Major Product Feature Release (high impact)",
      "[10:12:10] Sent raw payload to Strategy Agent for threat synthesis."
    ]
  },
  {
    id: "pricing",
    name: "Pricing Agent",
    description: "Tracks pricing grids, billing intervals, currency shifts, and hidden credit structures.",
    tint: "#22C55E",
    logs: [
      "[14:20:11] Scraping pricing tables for acme.io...",
      "[14:20:13] ALERT: 'Pro Plan' base price changed: $49/mo -> $40/mo (-18%)",
      "[14:20:14] DETECTED: AI workflow credits are now bundled by default",
      "[14:20:15] Historical comparison: First price reduction in Acme history (18 months)",
      "[14:20:17] Broadcasted pricing event to Slack integration (#strategy-live)."
    ]
  },
  {
    id: "sentiment",
    name: "Sentiment Agent",
    description: "Analyzes customer reviews, community threads, social discussions, and G2/Capterra score trends.",
    tint: "#EF4444",
    logs: [
      "[03:41:00] Ingested 45 new review payloads for nova.dev",
      "[03:41:02] Trend Analysis: Core sentiment rating dropped by 12% over 72 hours",
      "[03:41:04] Topic Extraction: 85% of complaints link to 'broken onboarding validation'",
      "[03:41:05] Identified 12 accounts voicing high churn risk",
      "[03:41:06] Created opportunity dossier: 'Nova Onboardingregressions'."
    ]
  },
  {
    id: "news",
    name: "News Agent",
    description: "Filters signal from noise in global PR networks, regulatory filings, patent submissions, and news sites.",
    tint: "#7DD3FC",
    logs: [
      "[07:04:12] Scanning SEC databases and PR Newswire API...",
      "[07:04:13] Detected filing: Nova parent entity closed Series B funding",
      "[07:04:14] Capitalized Value: $40M, Valuation: $380M, Lead Investor: Sequoia",
      "[07:04:16] Estimated runway extension: 28 months based on headcount trends",
      "[07:04:18] Updated threat database for competitor Nova (Medium -> High)."
    ]
  },
  {
    id: "strategy",
    name: "Strategy Agent",
    description: "Synthesizes isolated events, maps strategic narratives, and drafts editorial briefings.",
    tint: "#FACC15",
    logs: [
      "[22:44:01] Processing 14 verified signals from Research & Pricing nodes",
      "[22:44:03] Mapping cluster: Acme pricing cuts overlap with Vertex's AI Search push",
      "[22:44:04] Threat Matrix: Enterprise market compression index risen to 87%",
      "[22:44:06] Generating 'Q2 Competitive Landscape Dossier' (Markdown -> PDF)",
      "[22:44:09] Executive briefing compiled. 92% confidence rating. Ready for dispatch."
    ]
  }
];

// Interactive Live Signals Data
const LIVE_SIGNALS = [
  { id: "s1", category: "pricing", competitor: "Acme", title: "Pro plan price cut by 18% with bundled AI credits", time: "2m ago", impact: "Critical", tint: "#EF4444" },
  { id: "s2", category: "product", competitor: "Vertex", title: "Released AI semantic search inside shared workspaces", time: "14m ago", impact: "High", tint: "#4F8CFF" },
  { id: "s3", category: "reviews", competitor: "Nova", title: "Review sentiment dropped 12% citing onboarding bugs", time: "1h ago", impact: "Medium", tint: "#FACC15" },
  { id: "s4", category: "marketing", competitor: "Pulse", title: "Expanded marketing campaigns & localized site to LATAM", time: "4h ago", impact: "Low", tint: "#22C55E" },
  { id: "s5", category: "hiring", competitor: "Vertex", title: "Opened 14 enterprise Account Executive roles in US", time: "6h ago", impact: "High", tint: "#00D4FF" },
  { id: "s6", category: "partnership", competitor: "Acme", title: "Announced strategic data cloud partnership with Snowflake", time: "8h ago", impact: "High", tint: "#EF4444" },
  { id: "s7", category: "news", competitor: "Nova", title: "Secured $40M Series B funding led by Sequoia Capital", time: "1d ago", impact: "High", tint: "#7DD3FC" },
  { id: "s8", category: "product", competitor: "Pulse", title: "Deprecated legacy analytics boards forcing migrations", time: "2d ago", impact: "Low", tint: "#22C55E" }
];

function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#060A12]/70 backdrop-blur-xl px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#22D3EE] shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-white/10">
            <Sparkles className="h-4.5 w-4.5 text-[#060A12]" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">CompetiLens</span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-slate-400 md:flex">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#agents" className="hover:text-white transition-colors">AI Agents</a>
          <a href="#signals" className="hover:text-white transition-colors">Live Signals</a>
          <a href="#dossiers" className="hover:text-white transition-colors">Reports</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign in</Link>
          <GlowButton as={Link} {...({ to: "/signup" } as any)}>
            Start Free Trial
          </GlowButton>
        </div>
      </div>
    </header>
  );
}

// 3D Dashboard Mouse Tracking Component
function InteractiveDashboard3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Calculate rotation (-12 to 12 degrees max)
    const rotateY = ((x - xc) / xc) * 12;
    const rotateX = -((y - yc) / yc) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/3] rounded-3xl cursor-pointer"
      style={{ perspective: "1200px" }}
    >
      {/* Glow Effect behind */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#4F8CFF]/15 to-[#00D4FF]/20 blur-[60px] opacity-80 rounded-3xl -z-10" />

      {/* Main Card */}
      <div
        className="w-full h-full glass-strong rounded-3xl p-5 border border-white/10 transition-transform duration-300 ease-out shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Decorative Grid backdrop */}
        <div className="absolute inset-0 -z-10 bg-grid-fade opacity-30 pointer-events-none" />

        {/* Dashboard Shell Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-3 font-mono text-[10px] tracking-widest text-slate-500">MARKET COMMAND CONSOLE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
              <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest">LIVE SYNC</span>
            </div>
          </div>
        </div>

        {/* Inner Content Grid */}
        <div className="grid grid-cols-3 gap-4 h-[calc(100%-48px)]">
          {/* Proximity / Orbit Panel */}
          <div className="col-span-2 glass rounded-2xl p-4 border border-white/5 flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
            <div>
              <div className="flex items-center justify-between">
                <Eyebrow>Competitor Orbit</Eyebrow>
                <span className="text-[10px] text-slate-400">Threat Matrix</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Real-time proximity, size & activity coordinates</p>
            </div>

            {/* SVG Orbit Visualizer */}
            <div className="relative aspect-[16/10] w-full flex items-center justify-center">
              <svg viewBox="0 0 400 220" className="w-full h-full">
                {[50, 90, 130].map((r, i) => (
                  <ellipse
                    key={i}
                    cx="200"
                    cy="110"
                    rx={r * 1.3}
                    ry={r * 0.75}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="2 4"
                  />
                ))}
                {/* Center - Lattice (You) */}
                <g>
                  <circle cx="200" cy="110" r="18" fill="#0E1628" stroke="#00D4FF" strokeWidth="1.5" />
                  <text x="200" y="113" textAnchor="middle" fill="#00D4FF" fontFamily="Inter" fontSize="8" fontWeight="700">LTC</text>
                </g>
                {/* Competitors */}
                {[
                  { cx: 100, cy: 60, r: 12, label: "AC", color: "#EF4444", status: "Critical" },
                  { cx: 310, cy: 80, r: 10, label: "VX", color: "#00D4FF", status: "High" },
                  { cx: 280, cy: 160, r: 8, label: "NV", color: "#FACC15", status: "Med" },
                  { cx: 90, cy: 150, r: 7, label: "PL", color: "#22C55E", status: "Low" }
                ].map((c) => (
                  <g key={c.label} className="animate-float" style={{ animationDelay: `${c.r * 0.5}s` }}>
                    <circle cx={c.cx} cy={c.cy} r={c.r + 4} fill="none" stroke={c.color} strokeOpacity="0.15" />
                    <circle cx={c.cx} cy={c.cy} r={c.r} fill="#0E1628" stroke={c.color} strokeWidth="1.2" />
                    <text x={c.cx} y={c.cy + 3} textAnchor="middle" fill={c.color} fontFamily="JetBrains Mono" fontSize="7" fontWeight="600">{c.label}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { name: "Acme", threat: "87", level: "critical", color: "#EF4444" },
                { name: "Vertex", threat: "71", level: "high", color: "#00D4FF" },
                { name: "Nova", threat: "54", level: "medium", color: "#FACC15" }
              ].map(x => (
                <div key={x.name} className="glass rounded-xl p-2 border border-white/5 text-center">
                  <div className="text-[9px] text-slate-500">{x.name}</div>
                  <div className="font-mono text-xs font-semibold mt-0.5" style={{ color: x.color }}>T·{x.threat}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right stream panel */}
          <div className="glass rounded-2xl p-4 border border-white/5 flex flex-col justify-between" style={{ transform: "translateZ(45px)" }}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <Eyebrow>Signal River</Eyebrow>
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
              </div>

              <div className="space-y-2 max-h-[170px] overflow-y-hidden">
                {[
                  { id: "1", type: "pricing", c: "Acme", desc: "Pro plan pricing cut 18%", tint: "#EF4444" },
                  { id: "2", type: "product", c: "Vertex", desc: "Launched native AI Search", tint: "#00D4FF" },
                  { id: "3", type: "reviews", c: "Nova", desc: "Sentiment score down 12%", tint: "#FACC15" }
                ].map((s) => (
                  <div key={s.id} className="rounded-xl border border-white/5 bg-white/[0.01] p-2 hover:border-white/10 transition">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.tint }} />
                      <span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: s.tint }}>{s.type}</span>
                      <span className="text-[8px] text-slate-500">· {s.c}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-1 line-clamp-1">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neural Net connection card */}
            <div className="glass-strong rounded-xl p-3 border border-white/10 mt-2 bg-gradient-to-br from-[#4F8CFF]/5 to-transparent">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-[#00D4FF]" />
                <div className="font-mono text-[9px] tracking-wider text-slate-300">AGENTS DEPLOYED</div>
              </div>
              <div className="mt-2 flex gap-1.5 justify-center">
                {["#4F8CFF", "#22C55E", "#EF4444", "#7DD3FC", "#FACC15"].map((color, i) => (
                  <span key={i} className="h-2 w-2 rounded-full animate-glow-pulse" style={{ backgroundColor: color, animationDelay: `${i * 0.3}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Strategic Brief Card overlay */}
        <div
          className="absolute bottom-6 right-6 glass-strong rounded-2xl p-4 border border-[#00D4FF]/30 shadow-2xl max-w-[200px]"
          style={{ transform: "translateZ(65px)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#00D4FF]/20"><FileText className="h-3 w-3 text-[#7DD3FC]" /></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#7DD3FC] font-semibold">STRATEGY BRIEF</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-white">Q2 Competitive Dossier</div>
          <div className="text-[9px] text-slate-400 mt-1 line-clamp-2">Competitive landscape changes and mid-market response memo.</div>
          <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-emerald-400">
            <span>92% Confidence</span>
            <span>· 12p</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative px-4 pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 bg-[radial-gradient(ellipse_600px_400px_at_center,rgba(0,212,255,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-fade opacity-30" />

      <div className="mx-auto max-w-7xl grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Side: CTAs & Text */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left">
          {/* Badge */}
          <div className="mb-6 self-start inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/5 px-3 py-1.5 text-xs text-[#7DD3FC] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono uppercase tracking-widest text-[10px] font-semibold">V2 Release · Live Agent Workflows</span>
          </div>

          <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl font-extrabold text-white">
            Know Your Competitors <br />
            <span className="italic text-gradient-cyan">Before They Know You.</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-400 leading-relaxed max-w-xl">
            AI-powered competitive intelligence platform that continuously monitors competitors, detects market movements, generates executive insights, and helps teams stay ahead.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <GlowButton as={Link} {...({ to: "/signup" } as any)} className="px-7 py-3.5 text-base">
              Start Free Trial <ArrowRight className="h-4.5 w-4.5" />
            </GlowButton>
            <GhostButton as={Link} {...({ to: "/dashboard" } as any)} className="px-7 py-3.5 text-base">
              <Play className="h-4 w-4 fill-current mr-1 text-[#00D4FF]" /> Watch Live Demo
            </GhostButton>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> No credit card</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> 14-day trial</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Enterprise ready</span>
          </div>
        </div>

        {/* Right Side: Interactive 3D Dashboard */}
        <div className="lg:col-span-7 w-full">
          <InteractiveDashboard3D />
        </div>
      </div>
    </section>
  );
}

// Trusted Companies Section
function TrustedLogos() {
  return (
    <section className="border-y border-white/5 bg-white/[0.01] py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-6">
          TRUSTED BY MODERN STRATEGY TEAMS AT WORLD-CLASS COMPANIES
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 opacity-40 grayscale hover:opacity-60 transition duration-300">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-white select-none">
              <Command className="h-4.5 w-4.5 text-[#00D4FF]" />
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
const FEATURES_LIST = [
  { icon: Target, title: "Competitor Orbit Matrix", body: "Map every tracked competitor dynamically on an interactive gravitational field based on relative threat index, strategic proximity, and product overlap." },
  { icon: Radio, title: "Autopilot Signal River", body: "Surfaces pricing fluctuations, hiring sprees, review sentiment dips, and feature rollouts in a synchronized real-time feed with smart filtering." },
  { icon: Brain, title: "Neural Temporal Memory", body: "Stores every historical datapoint and maps complex, non-obvious timeline correlation chains (e.g. price drops preceding enterprise sales hiring)." },
  { icon: FileText, title: "Editorial Strategy Dossiers", body: "Instantly compile detailed swot matrixes, pricing reports, or executive-grade competitive landscape dossiers formatted for leadership meetings." },
  { icon: Search, title: "Multi-Agent Investigations", body: "Propose a direct competitive question. Deploy five specialized, parallel AI agent nodes to search endpoints, code changes, and financials." },
  { icon: ShieldCheck, title: "Security Core Compliance", body: "Enterprise security frameworks by default. Role-based control, SCIM syncing, custom API pipelines, and zero training of AI models on user data." }
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 md:py-32 relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 bg-[radial-gradient(ellipse_600px_400px_at_center,rgba(79,140,255,0.08),transparent_60%)]" />

      <div className="mb-16 text-center max-w-2xl mx-auto">
        <Eyebrow>The Core System</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          Competitive Intelligence, <span className="italic text-gradient-cyan">fully autonomous</span>.
        </h2>
        <p className="mt-4 text-slate-400 text-sm md:text-base">
          A premium suite of tools engineered to synthesize raw noise into strategic actions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES_LIST.map(({ icon: Icon, title, body }) => (
          <GlassCard key={title} hover className="p-8 border border-white/5 hover:border-[#00D4FF]/25">
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#4F8CFF]/15 to-[#00D4FF]/10 text-[#7DD3FC] border border-[#00D4FF]/20 shadow-[0_0_15px_rgba(0,212,255,0.15)]">
              <Icon className="h-5.5 w-5.5" strokeWidth={1.6} />
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">{body}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// AI Agents Section (Interactive)
function AIAgents() {
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const activeAgent = AGENT_SHOWCASE[activeAgentIndex];

  return (
    <section id="agents" className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative">
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/3 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.06),transparent_70%)]" />

      <div className="mb-16 text-center max-w-2xl mx-auto">
        <Eyebrow>Multi-Agent Network</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          Five Minds. <span className="italic text-gradient-cyan">One Dashboard.</span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm md:text-base">
          Deploy specialized AI agents that query target nodes, filter variables, and synthesize intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Agent Selectors (5 columns on large screen) */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
          {AGENT_SHOWCASE.map((agent, index) => {
            const isActive = index === activeAgentIndex;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgentIndex(index)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${isActive
                    ? "glass-strong border-[#00D4FF]/30 shadow-[0_0_20px_rgba(0,212,255,0.1)] translate-x-2"
                    : "glass border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${isActive ? "animate-glow-pulse" : ""}`}
                  style={{
                    backgroundColor: agent.tint,
                    boxShadow: isActive ? `0 0 10px ${agent.tint}` : "none"
                  }}
                />
                <div>
                  <div className="text-sm font-semibold text-white font-mono">{agent.name}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{agent.description}</div>
                </div>
                <ChevronRight className={`ml-auto h-4 w-4 text-slate-600 transition-transform ${isActive ? "translate-x-1 text-[#00D4FF]" : ""}`} />
              </button>
            );
          })}
        </div>

        {/* Live Terminal Output (7 columns on large screen) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="glass-strong border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-white/[0.02] border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#00D4FF]" />
                <span className="font-mono text-xs text-slate-300">Terminal — {activeAgent.name.toLowerCase().replace(" ", "_")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
                <span className="font-mono text-[9px] text-emerald-400 tracking-wider">LISTENING</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs text-slate-400 space-y-3 bg-[#060A12]/80 flex-1 overflow-y-auto min-h-[250px]">
              <div className="text-slate-500">// Deploying agent intelligence subroutines...</div>
              <div className="text-slate-300 font-semibold">{activeAgent.name.toUpperCase()} (ID: {activeAgent.id}_node_main)</div>
              <p className="text-slate-400 italic font-sans">{activeAgent.description}</p>
              <div className="h-px bg-white/5 my-2" />

              {activeAgent.logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 animate-fade-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <span className="text-[#00D4FF] select-none">➜</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Live Signals Section
function LiveSignals() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const filteredSignals = selectedFilter === "all"
    ? LIVE_SIGNALS
    : LIVE_SIGNALS.filter(s => s.category === selectedFilter);

  const filters = [
    { label: "All Events", value: "all" },
    { label: "Pricing", value: "pricing" },
    { label: "Product Features", value: "product" },
    { label: "Market sentiment", value: "reviews" },
    { label: "Strategic filings", value: "news" }
  ];

  return (
    <section id="signals" className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 bg-[radial-gradient(ellipse_600px_400px_at_center,rgba(0,212,255,0.06),transparent_60%)]" />

      <div className="mb-14 text-center max-w-2xl mx-auto">
        <Eyebrow>Autonomous Feed</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          Live Market Signals. <span className="italic text-gradient-cyan">Parsed & Scored.</span>
        </h2>
        <p className="mt-4 text-slate-400 text-sm md:text-base">
          Our system processes millions of raw changes to surface events that demand action, complete with automatic threat classifications.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedFilter(f.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold font-mono tracking-wider transition-all duration-300 ${selectedFilter === f.value
                ? "bg-[#00D4FF]/15 text-[#7DD3FC] border border-[#00D4FF]/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                : "border border-white/5 text-slate-400 hover:text-white hover:border-white/10 bg-white/[0.01]"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Signals List Container */}
      <div className="glass rounded-3xl p-5 border border-white/5 max-w-4xl mx-auto">
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredSignals.map((s) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.01] p-4 hover:border-white/10 hover:bg-white/[0.02] transition duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: s.tint, boxShadow: `0 0 10px ${s.tint}` }} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[9px] uppercase tracking-widest font-semibold" style={{ color: s.tint }}>{s.category}</span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-xs text-slate-400 font-mono font-semibold">{s.competitor}</span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-[10px] text-slate-500 font-mono">{s.time}</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">{s.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="font-mono text-[10px] text-slate-500">Impact Score</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-widest ${s.impact === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    s.impact === "High" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      s.impact === "Medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                        "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}>
                  {s.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Full Dashboard Interactive Preview Section
function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"orbit" | "river" | "trends">("orbit");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 bg-[radial-gradient(ellipse_600px_400px_at_center,rgba(0,212,255,0.06),transparent_60%)]" />

      <div className="mb-14 text-center max-w-2xl mx-auto">
        <Eyebrow>Product Preview</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          The Strategy Command Console.
        </h2>
        <p className="mt-4 text-slate-400 text-sm md:text-base">
          A workspace crafted with detail. Control signal feeds, edit custom dashboards, and trace automated SWOT correlations.
        </p>
      </div>

      <div className="glass-strong rounded-3xl p-2 border border-white/10 max-w-6xl mx-auto shadow-2xl overflow-hidden">
        {/* Mock Top Console Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-2 px-4 py-3 gap-4 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="h-4 w-px bg-white/10" />
            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { label: "Competitor Orbit", value: "orbit" },
                { label: "Signal Feed", value: "river" },
                { label: "Signal Trends (30d)", value: "trends" }
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setActiveTab(t.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wider transition ${activeTab === t.value
                      ? "bg-white/5 text-[#7DD3FC]"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-slate-500">Workspace / Lattice</span>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 bg-[#060A12]/60 min-h-[350px]">
          {activeTab === "orbit" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="relative aspect-[16/10] w-full rounded-2xl border border-white/5 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.15),transparent_70%)] flex items-center justify-center">
                  <svg viewBox="0 0 500 300" className="w-full h-full max-w-[450px]">
                    {[60, 110, 160].map((r, i) => (
                      <ellipse key={i} cx="250" cy="150" rx={r * 1.4} ry={r * 0.8} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" />
                    ))}
                    <g>
                      <circle cx="250" cy="150" r="24" fill="#0B1220" stroke="#38BDF8" strokeWidth={1.5} />
                      <text x="250" y="146" textAnchor="middle" fill="#94A3B8" fontFamily="JetBrains Mono" fontSize="7">YOU</text>
                      <text x="250" y="157" textAnchor="middle" fill="#F8FAFC" fontFamily="Inter" fontSize="10" fontWeight="600">Lattice</text>
                    </g>
                    {[
                      { id: "ac", cx: 160, cy: 90, r: 16, code: "AC", name: "Acme", color: "#F43F5E", status: "Critical" },
                      { id: "vx", cx: 340, cy: 110, r: 14, code: "VX", name: "Vertex", color: "#22D3EE", status: "High" },
                      { id: "nv", cx: 320, cy: 210, r: 12, code: "NV", name: "Nova", color: "#F59E0B", status: "Med" },
                      { id: "pl", cx: 130, cy: 200, r: 10, code: "PL", name: "Pulse", color: "#22C55E", status: "Low" }
                    ].map(c => (
                      <g key={c.id}>
                        <circle cx={c.cx} cy={c.cy} r={c.r + 6} fill="none" stroke={c.color} strokeOpacity="0.12" />
                        <circle cx={c.cx} cy={c.cy} r={c.r} fill="#0B1220" stroke={c.color} strokeWidth={1.5} />
                        <text x={c.cx} y={c.cy + 3} textAnchor="middle" fill={c.color} fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">{c.code}</text>
                        <text x={c.cx} y={c.cy + c.r + 14} textAnchor="middle" fill="#F8FAFC" fontFamily="Inter" fontSize="10">{c.name}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
              <div className="md:col-span-5 space-y-4">
                <Eyebrow>COMPETITOR ORBIT</Eyebrow>
                <h3 className="font-display text-3xl font-semibold">Proximity and threat coordinates.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Competitors are dynamically clustered based on product similarities and market segment overlapping. The closer a company lies to the center (YOU), the higher its competitive urgency.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-slate-300 font-mono">Red: Critical threat. Proximity under 20%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="h-2 w-2 rounded-full bg-[#00D4FF]" />
                    <span className="text-slate-300 font-mono">Cyan: High threat. Accelerating activities</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "river" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="space-y-3 max-h-[300px] overflow-y-auto border border-white/5 p-4 rounded-xl bg-white/[0.01]">
                  {[
                    { c: "Acme", t: "pricing", desc: "Pro plan cut 18% with bundled credits", time: "14:20 PM", color: "#EF4444" },
                    { c: "Vertex", t: "product", desc: "AI Search integration launched", time: "13:02 PM", color: "#00D4FF" },
                    { c: "Nova", t: "reviews", desc: "Customer sentiment decline overrides 12%", time: "10:12 AM", color: "#FACC15" },
                    { c: "Pulse", t: "marketing", desc: "Acquired new domain pulse.latam for campaign", time: "09:14 AM", color: "#22C55E" }
                  ].map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center rounded-xl p-3 border border-white/5 bg-[#060A12]/40">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] uppercase tracking-widest font-semibold" style={{ color: s.color }}>{s.t}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{s.c}</span>
                          </div>
                          <div className="text-xs text-slate-300 mt-0.5">{s.desc}</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-5 space-y-4">
                <Eyebrow>LIVE SIGNAL RIVER</Eyebrow>
                <h3 className="font-display text-3xl font-semibold">Continuous market telemetry.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every public code change, pricing grid adjustment, recruitment wave, and forum review is ingested, deduped, and classification scored within seconds.
                </p>
                <Link to="/signup" className="text-xs text-[#00D4FF] hover:underline font-mono inline-flex items-center gap-1">
                  Explore integrations API <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="border border-white/5 p-6 rounded-xl bg-white/[0.01]">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <div className="text-slate-500 font-mono text-[10px] uppercase">AGGREGATE ACTIVITY INDEX</div>
                      <div className="text-3xl font-bold font-mono text-white mt-1">142 Signals</div>
                    </div>
                    <div className="text-emerald-400 font-mono text-xs">▲ 23% vs last 30d</div>
                  </div>
                  <div className="h-28 flex items-end">
                    <Sparkline points={[14, 18, 16, 22, 19, 25, 22, 28, 30, 27, 34, 32, 42, 38, 45, 41, 48]} color="#00D4FF" width={400} height={100} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    {[
                      { l: "Product Moves", n: "42", c: "#00D4FF" },
                      { l: "Pricing Adjustments", n: "18", c: "#EF4444" },
                      { l: "Hiring Activities", n: "27", c: "#22C55E" }
                    ].map(x => (
                      <div key={x.l} className="glass p-2 rounded-lg border border-white/5">
                        <div className="text-lg font-mono font-semibold" style={{ color: x.c }}>{x.n}</div>
                        <div className="text-[9px] text-slate-500">{x.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 space-y-4">
                <Eyebrow>SIGNAL ANALYSIS</Eyebrow>
                <h3 className="font-display text-3xl font-semibold">Track vectors, identify signals.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Map aggregate competitor behaviors to reveal hidden shifts in product priorities, hiring gaps, and target segments before they publish formal announcements.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Strategy Dossiers / Reports Section
const REPORT_DOSSIERS = [
  { id: "r1", type: "Executive Dossier", title: "Q2 Competitive Landscape Briefing", period: "APR — JUN 2026", details: "SWOT maps, competitor positioning vectors, and mid-market compression briefing.", confidence: 92, pages: 12, ready: true },
  { id: "r2", type: "Pricing Briefing", title: "Acme Pricing Elasticity Doctrine", period: "JUL 2026", details: "Review of Acme's 18% pricing cuts and bundled credit elasticity model.", confidence: 88, pages: 8, ready: true },
  { id: "r3", type: "Product SWOT", title: "SWOT — Lattice vs Vertex AI Search", period: "JUN 2026", details: "Deep feature audits, semantic search coverage gaps, and market responses.", confidence: 85, pages: 14, ready: true },
  { id: "r4", type: "Market mapping", title: "Nova Onboarding & Sentiment Drops", period: "JUN 2026", details: "Topic modeling analysis on customer onboarding failures and churn signals.", confidence: 81, pages: 6, ready: true }
];

function Dossiers() {
  return (
    <section id="dossiers" className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 bg-[radial-gradient(ellipse_600px_400px_at_center,rgba(0,212,255,0.06),transparent_60%)]" />

      <div className="mb-14 text-center max-w-2xl mx-auto">
        <Eyebrow>Editorial Dossiers</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          Editorial-Grade Strategy Briefs.
        </h2>
        <p className="mt-4 text-slate-400 text-sm md:text-base">
          Our agents compile raw event telemetry into long-form, analytical strategy briefs formatted directly for executive reviews.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {REPORT_DOSSIERS.map((d) => (
          <GlassCard key={d.id} hover className="p-7 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#7DD3FC] font-semibold">{d.type}</span>
                <span className="font-mono text-[9px] text-slate-500">{d.period}</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mt-3 leading-snug">{d.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{d.details}</p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex gap-4 text-[10px] font-mono text-slate-500">
                <span className="text-[#00D4FF] font-semibold">{d.confidence}% Confidence</span>
                <span>·</span>
                <span>{d.pages} pages</span>
              </div>
              <Link
                to="/signup"
                className="text-xs font-mono font-semibold text-white hover:text-[#00D4FF] transition-colors flex items-center gap-1 group"
              >
                Open Briefing <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// Testimonials Section
const TESTIMONIALS_LIST = [
  { quote: "CompetiLens is the first tool that genuinely automates competitor telemetry. Our executive strategy meetings shifted from mapping to action overnight.", author: "Elena Marsh", role: "VP Corporate Strategy", company: "Northwind" },
  { quote: "It operates like Perplexity combined with a Bloomberg terminal for SaaS. The UI details and real-time signal river are absolutely spectacular.", author: "Ravi Kapoor", role: "Head of Product Planning", company: "Arclight" },
  { quote: "We replaced three separate monitoring platforms within a week of deploying CompetiLens. The autonomous dossiers compile strategy in seconds.", author: "Marta Chen", role: "Chief Operating Officer", company: "Halo Labs" }
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative">
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <Eyebrow>Operator Feedback</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          Trusted at the <span className="italic text-gradient-cyan">edge of strategy</span>.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS_LIST.map((t) => (
          <GlassCard key={t.author} className="p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex gap-0.5 text-[#FACC15] mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-current" />
                ))}
              </div>
              <p className="font-display text-xl leading-relaxed text-slate-200">"{t.quote}"</p>
            </div>

            <div className="mt-8 border-t border-white/5 pt-4">
              <div className="text-sm font-semibold text-white">{t.author}</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">{t.role} · {t.company}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

// Pricing Section (Interactive)
function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const tiers = [
    {
      name: "Explorer",
      price: { monthly: 0, annual: 0 },
      note: "For strategy developers testing the system.",
      features: ["3 Tracked Competitors", "100 Signals Per Month", "Weekly Email Briefing", "Standard Support SLA"],
      cta: "Choose Explorer",
      featured: false
    },
    {
      name: "Operator",
      price: { monthly: 79, annual: 63 },
      note: "For corporate strategy and product teams.",
      features: ["25 Tracked Competitors", "Unlimited Signals & Ingestion", "Daily Autonomous Briefings", "Multi-Agent Investigation Studio", "Integrations API & Webhooks"],
      cta: "Start Free Trial",
      featured: true
    },
    {
      name: "Enterprise",
      price: { monthly: "Custom", annual: "Custom" },
      note: "For global scale market intelligence networks.",
      features: ["Unlimited Competitors", "Role-Based SCIM & SSO", "Region-Pinned Storage Controls", "No AI Training Guarantee", "Dedicated Strategy Success Partner"],
      cta: "Contact Sales",
      featured: false
    }
  ];

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 bg-[radial-gradient(ellipse_600px_400px_at_center,rgba(79,140,255,0.06),transparent_60%)]" />

      <div className="mb-10 text-center max-w-2xl mx-auto">
        <Eyebrow>Pricing Tiers</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          Priced for <span className="italic text-gradient-cyan">outcomes</span>.
        </h2>

        {/* Toggle Switch */}
        <div className="mt-8 inline-flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-full p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition ${billingCycle === "monthly" ? "bg-white/5 text-white" : "text-slate-400 hover:text-white"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`rounded-full px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition flex items-center gap-1.5 ${billingCycle === "annual" ? "bg-[#00D4FF]/15 text-[#7DD3FC] border border-[#00D4FF]/20" : "text-slate-400 hover:text-white"
              }`}
          >
            Annual <span>(-20%)</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-stretch max-w-5xl mx-auto">
        {tiers.map((t) => {
          const isCustom = typeof t.price[billingCycle] === "string";
          const displayPrice = isCustom
            ? t.price[billingCycle]
            : `$${t.price[billingCycle]}`;

          return (
            <GlassCard
              key={t.name}
              hover
              className={`p-8 border flex flex-col justify-between ${t.featured
                  ? "border-[#00D4FF]/40 shadow-[0_0_50px_rgba(0,212,255,0.25)]"
                  : "border-white/5"
                }`}
            >
              <div>
                {t.featured && (
                  <div className="mb-2 font-mono text-[9px] uppercase tracking-widest text-[#7DD3FC] font-semibold">
                    RECOMMENDED TIER
                  </div>
                )}
                <div className="font-display text-2xl font-bold text-white">{t.name}</div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-extrabold text-white">{displayPrice}</span>
                  {!isCustom && t.price[billingCycle] > 0 && (
                    <span className="text-xs text-slate-500 font-mono">/user/mo</span>
                  )}
                </div>

                <div className="mt-2 text-xs text-slate-500 leading-normal">{t.note}</div>
                <div className="h-px bg-white/5 my-6" />

                <ul className="space-y-3.5 text-xs text-slate-300">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 leading-tight">
                      <Check className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                {t.featured ? (
                  <GlowButton as={Link} {...({ to: "/signup" } as any)} className="w-full py-3">
                    {t.cta}
                  </GlowButton>
                ) : (
                  <GhostButton as={Link} {...({ to: "/signup" } as any)} className="w-full py-3">
                    {t.cta}
                  </GhostButton>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

// FAQ Section (Interactive)
const FAQ_LIST = [
  { q: "How do your autonomous intelligence agents source data?", a: "Our agents securely scrape and compile open-source web telemetries including competitor pricing tables, client changelogs, patent application databases, recruitment boards, G2 forums, and global PR channels." },
  { q: "Is my business data used to train the general AI models?", a: "No. Security is a core foundation of CompetiLens. All workspace data is isolated, region-pinned, and never used to train or refine models for external customers. We are SOC 2 certified." },
  { q: "How fast does the system identify a competitive adjustment?", a: "Our scraping nodes query target networks continuously. Most changes (like price cuts or product launches) are parsed, scored, and delivered to your Signal River within 5 to 15 minutes." },
  { q: "Can we export generated strategy briefs and data?", a: "Yes. All dossiers are exportable as print-ready PDF reports, markdown tables, or directly synced to tools like Notion, Slack, and Salesforce. We also provide a complete REST API." }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 md:py-28 relative">
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
          System Details.
        </h2>
      </div>

      <div className="space-y-3">
        {FAQ_LIST.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="glass rounded-2xl p-5 border border-white/5 transition duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between text-left text-sm md:text-base font-semibold text-white focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`h-4 w-4 text-[#00D4FF] transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[200px] mt-4 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Footer Section
function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-16 relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 bg-[radial-gradient(ellipse_600px_400px_at_bottom,rgba(0,212,255,0.06),transparent_60%)]" />

      {/* Call to action card */}
      <GlassCard className="p-8 md:p-12 text-center max-w-5xl mx-auto border border-[#38BDF8]/20 shadow-[0_0_45px_rgba(56,189,248,0.1)] mb-16 bg-gradient-to-tr from-[#060A12] to-[#101827]/30">
        <Eyebrow>Start Intelligence Run</Eyebrow>
        <h3 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-white leading-tight">
          See what your competitors <br />
          <span className="italic text-gradient-cyan">just launched.</span>
        </h3>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm md:text-base">
          Join strategy teams driving modern SaaS categories. Set up your workspace in 3 minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <GlowButton as={Link} {...({ to: "/signup" } as any)} className="px-7 py-3">
            Start Free Trial <ArrowRight className="h-4.5 w-4.5" />
          </GlowButton>
          <GhostButton as={Link} {...({ to: "/dashboard" } as any)} className="px-7 py-3">
            Open Interactive Console
          </GhostButton>
        </div>
      </GlassCard>

      {/* Footer Navigation Columns */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8 border-b border-white/5 pb-12 mb-10 text-xs">
        <div className="col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#22D3EE] shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Sparkles className="h-4 text-[#060A12]" />
            </span>
            <span className="font-display text-lg font-bold">CompetiLens</span>
          </Link>
          <p className="text-slate-500 leading-relaxed pr-6">
            Autonomous competitive intelligence platforms for enterprise planning. Tracking SaaS telemetry in real-time.
          </p>
          <div className="flex gap-2">
            <div className="glass px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[#22C55E]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
              <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest">All Systems Operational</span>
            </div>
          </div>
        </div>

        <div>
          <div className="font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">Product</div>
          <ul className="space-y-2.5 text-slate-500">
            <li><a href="#features" className="hover:text-white transition">Features</a></li>
            <li><a href="#agents" className="hover:text-white transition">AI Agents</a></li>
            <li><a href="#signals" className="hover:text-white transition">Telemetry Stream</a></li>
            <li><a href="#pricing" className="hover:text-white transition">Pricing Grid</a></li>
          </ul>
        </div>

        <div>
          <div className="font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">Resources</div>
          <ul className="space-y-2.5 text-slate-500">
            <li><a href="#" className="hover:text-white transition">System API Docs</a></li>
            <li><a href="#" className="hover:text-white transition">SWOT Examples</a></li>
            <li><a href="#" className="hover:text-white transition">Security Matrix</a></li>
            <li><a href="#" className="hover:text-white transition">Customer Cases</a></li>
          </ul>
        </div>

        <div>
          <div className="font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">Legal</div>
          <ul className="space-y-2.5 text-slate-500">
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition">SOC 2 Report</a></li>
            <li><a href="#" className="hover:text-white transition">GDPR Compliance</a></li>
          </ul>
        </div>

        <div>
          <div className="font-mono font-semibold uppercase tracking-wider text-slate-400 mb-4">Connect</div>
          <ul className="space-y-2.5 text-slate-500">
            <li><a href="#" className="hover:text-white transition">Twitter / X</a></li>
            <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
            <li><a href="#" className="hover:text-white transition">GitHub Repo</a></li>
            <li><a href="#" className="hover:text-white transition">System Support</a></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-xs">
        <div>© 2026 CompetiLens Labs Inc. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition">Security Core</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-400 transition">Privacy Preferences</a>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-[#060A12] text-white selection:bg-[#38BDF8]/30 selection:text-white relative overflow-hidden">
      <Nav />
      <Hero />
      <TrustedLogos />
      <Features />
      <AIAgents />
      <LiveSignals />
      <DashboardPreview />
      <Dossiers />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
