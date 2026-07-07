import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Globe,
  Newspaper,
  MessageSquare,
  Brain,
  Target,
  Sparkles,
  ArrowRightLeft,
  X,
  Github,
  Linkedin,
  Twitter,
  Plus,
  Minus,
  TrendingUp,
  HelpCircle,
  ShieldCheck,
  Slack,
  FileText,
  Activity,
  Layers,
  ArrowUpRight,
  Code,
  Lock,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CompetiLens AI — Autonomous Competitive Intelligence Platform" },
      {
        name: "description",
        content:
          "Know every competitor move before the market does. CompetiLens AI deploys a network of autonomous agents to track, synthesize, and deliver competitive strategy briefs.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#2563EB]/10 overflow-x-hidden relative">
      {/* CSS animations injected directly */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes floatReverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .animate-float-slow {
          animation: float 7s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: floatReverse 8s ease-in-out infinite;
        }
        .mesh-gradient {
          background: radial-gradient(circle at 10% 15%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.07) 0%, transparent 45%),
                      radial-gradient(circle at 50% 40%, rgba(20, 184, 166, 0.05) 0%, transparent 35%);
        }
        .text-gradient {
          background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .card-glow:hover {
          box-shadow: 0 15px 40px -10px rgba(37, 99, 235, 0.08);
          border-color: rgba(37, 99, 235, 0.2);
        }
      `}</style>

      <Navbar />
      <Hero />
      <TrustedCompanies />
      <WorkflowSection />
      <HowItWorks />
      <AgentsSection />
      <ProductShowcase />
      <BeforeAfterSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

// 1. Navbar: Floating, Glass, Pill-shaped
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 transition-all duration-300 py-6">
      <motion.header
        className={`w-full max-w-7xl flex items-center justify-between transition-all duration-300 rounded-[24px] border ${
          scrolled
            ? "bg-white/75 backdrop-blur-xl border-[#E5E7EB] py-3.5 px-6 shadow-sm"
            : "bg-transparent border-transparent py-4 px-8"
        }`}
      >
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-sm text-[#0F172A]">CompetiLens</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 uppercase font-bold tracking-wider">
            AI
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-[#64748B] tracking-tight">
          <a href="#workflow" className="hover:text-[#0F172A] transition duration-200">AI Workflow</a>
          <a href="#how-it-works" className="hover:text-[#0F172A] transition duration-200">How it Works</a>
          <a href="#agents" className="hover:text-[#0F172A] transition duration-200">AI Agents</a>
          <a href="#showcase" className="hover:text-[#0F172A] transition duration-200">Showcase</a>
          <a href="#pricing" className="hover:text-[#0F172A] transition duration-200">Pricing</a>
          <a href="#faq" className="hover:text-[#0F172A] transition duration-200">FAQ</a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/signin"
            className="text-[13px] font-bold text-[#64748B] hover:text-[#0F172A] px-4 py-2 transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 h-9.5 px-4.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-[13px] font-bold shadow-md hover:opacity-95 transition"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.header>
    </div>
  );
}

// 2. Hero Section: Height, Mesh, Glowing Circles
function Hero() {
  return (
    <section className="relative min-h-[92vh] pt-40 pb-24 md:pt-48 md:pb-28 overflow-hidden mesh-gradient flex flex-col items-center justify-center">
      {/* Decorative floating mesh particles */}
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-[#2563EB]/5 blur-[90px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-[#06B6D4]/5 blur-[100px] animate-float-reverse pointer-events-none" />

      {/* Background grid */}
      <div 
        className="absolute inset-0 bg-grid opacity-[0.15] pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 text-center z-10 flex flex-col items-center">
        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E5E7EB] bg-white/70 backdrop-blur-md text-[11px] font-semibold text-[#64748B] shadow-sm select-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
          Autonomous Competitive Strategy Console
        </motion.div>

        {/* Large Typography Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] max-w-4xl text-[#0F172A]"
        >
          Know every competitor move <br className="hidden sm:inline" />
          before the <span className="text-gradient">market does.</span>
        </motion.h1>

        {/* Confident Professional Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-base sm:text-lg text-[#64748B] max-w-2xl leading-relaxed font-medium"
        >
          Continuous competitor intelligence, automated.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2.5 h-12.5 px-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-sm font-bold shadow-lg hover:opacity-95 hover:-translate-y-0.5 transition duration-200"
          >
            Start Free <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2.5 h-12.5 px-6 rounded-xl border border-[#E5E7EB] bg-white/70 backdrop-blur-md text-sm font-bold hover:bg-slate-50 hover:-translate-y-0.5 transition duration-200 text-[#0F172A]"
          >
            <Play className="w-3.5 h-3.5 fill-[#0F172A] stroke-none" /> Watch Demo
          </a>
        </motion.div>

        {/* Interactive Visual Preview */}
        <HeroVisualPreview />
      </div>
    </section>
  );
}

// 3. Hero Visual Widget Stack
function HeroVisualPreview() {
  const [runningAgent, setRunningAgent] = useState("Research Agent");

  useEffect(() => {
    const agentsList = ["Research Agent", "Website Agent", "News Agent", "Review Agent", "Analysis Agent", "Strategy Agent"];
    const interval = setInterval(() => {
      setRunningAgent((prev) => {
        const idx = agentsList.indexOf(prev);
        return agentsList[(idx + 1) % agentsList.length];
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-20 w-full max-w-4.5xl relative px-4"
    >
      {/* SVG Connecting Paths with Moving Dot */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
        <path id="path1" d="M 450,220 C 350,180 200,120 180,110" fill="none" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="2" strokeDasharray="5,5" />
        <path id="path2" d="M 450,220 C 550,180 700,120 720,110" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="2" strokeDasharray="5,5" />
        <path id="path3" d="M 450,220 C 350,240 200,320 180,330" fill="none" stroke="rgba(20, 184, 166, 0.08)" strokeWidth="2" strokeDasharray="5,5" />
        <path id="path4" d="M 450,220 C 550,240 700,320 720,330" fill="none" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="2" strokeDasharray="5,5" />
      </svg>

      {/* Main Container */}
      <div className="rounded-[28px] border border-[#E5E7EB] bg-white/80 backdrop-blur-xl shadow-2xl p-5 sm:p-7 relative z-10 grid md:grid-cols-[1.2fr_1fr] gap-6 text-left min-h-[380px]">
        {/* Left Side: Mock Workspace Console */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-extrabold text-sm select-none shadow-md">
              C
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#0F172A]">CompetiLens Console</h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">Workspace: Stripe competitor matrix</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-[#10B981] tracking-wider">Live tracking</span>
            </div>
          </div>

          {/* Threat score panel */}
          <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#64748B]">Threat Index Chart</span>
              <span className="text-[#2563EB] font-bold">+12% vs last Q</span>
            </div>
            <div className="h-24 flex items-end gap-1.5 pt-2">
              {[40, 52, 45, 68, 60, 72, 85, 78, 92].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`w-full rounded-t-lg bg-gradient-to-t ${
                      i === 8 ? "from-[#2563EB] to-[#06B6D4]" : "from-slate-200 to-slate-300"
                    }`}
                  />
                  <span className="text-[9px] text-[#64748B] font-bold">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Running agent prompt simulation */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-[#E5E7EB] bg-slate-50/50">
            <Activity className="w-4.5 h-4.5 text-[#2563EB] animate-spin" />
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider">Active Process</div>
              <div className="text-xs text-[#0F172A] font-semibold mt-0.5 truncate">
                {runningAgent === "Research Agent" && "Research Agent: indexing SEC filings & patent logs..."}
                {runningAgent === "Website Agent" && "Website Agent: diffing pricing tables & product features..."}
                {runningAgent === "News Agent" && "News Agent: scanning 8,000+ blogs & tech PR..."}
                {runningAgent === "Review Agent" && "Review Agent: mapping sentiment score tags..."}
                {runningAgent === "Analysis Agent" && "Analysis Agent: building strategic SWOT correlations..."}
                {runningAgent === "Strategy Agent" && "Strategy Agent: formulating 6-week release plan..."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Floating widget cards stacking */}
        <div className="flex flex-col gap-3 justify-center relative">
          
          {/* Threat widget */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white/95 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                <Target className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748B]">LINEAR THREAT SCORE</div>
                <div className="text-xs font-extrabold text-[#0F172A] mt-0.5">92 · High Threat</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-danger/10 text-danger">+4 vs Aug</span>
          </motion.div>

          {/* Pricing Update widget */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white/95 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4]">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#64748B]">NOTION PRICING CHANGE</div>
                <div className="text-xs font-extrabold text-[#0F172A] mt-0.5">Starter plan raised $10 → $12</div>
              </div>
            </div>
            <span className="text-[9.5px] font-bold text-[#64748B]">2h ago</span>
          </motion.div>

          {/* Review Sentiment widget */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white/95 shadow-md space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-warning">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-[10px] uppercase font-bold text-[#10B981] tracking-wider">Product sentiment</span>
            </div>
            <p className="text-[11px] text-[#64748B] italic leading-normal">
              "The new Linear calendar is exactly what we needed to deprecate Notion..."
            </p>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}

// 4. Trusted Companies Section: Grayscale with Color transition on Hover
function TrustedCompanies() {
  const brands = [
    { name: "OpenAI", color: "hover:text-[#10A37F]" },
    { name: "Stripe", color: "hover:text-[#635BFF]" },
    { name: "Linear", color: "hover:text-[#5E6AD2]" },
    { name: "GitHub", color: "hover:text-[#24292E]" },
    { name: "Vercel", color: "hover:text-[#000000]" },
    { name: "Figma", color: "hover:text-[#F24E1E]" },
    { name: "Notion", color: "hover:text-[#000000]" },
  ];

  return (
    <section className="py-12 border-y border-[#E5E7EB] bg-white/40">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[10.5px] font-extrabold uppercase tracking-[0.25em] text-[#64748B] mb-8">
          Trusted by top strategy and product teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {brands.map((b) => (
            <div
              key={b.name}
              className={`text-md sm:text-lg font-extrabold text-[#64748B]/40 tracking-tight transition-all duration-300 select-none cursor-default ${b.color} hover:scale-105`}
            >
              {b.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 5. Workflow Section: Animated Horizontal Pipeline
function WorkflowSection() {
  const steps = [
    { id: "user", label: "User input", desc: "Competitor domain", icon: Globe },
    { id: "research", label: "Research Agent", desc: " crawls databases", icon: Search },
    { id: "website", label: "Website Agent", desc: "screens pricing", icon: Layers },
    { id: "news", label: "News Agent", desc: "scrapes PR & news", icon: Newspaper },
    { id: "review", label: "Review Agent", desc: "compiles reviews", icon: MessageSquare },
    { id: "analysis", label: "Analysis Agent", desc: "maps SWOT indexes", icon: Brain },
    { id: "strategy", label: "Strategy Agent", desc: "drafts counterplans", icon: Target },
    { id: "report", label: "Executive Report", desc: "synthesizes PDF Brief", icon: FileText },
    { id: "memory", label: "AI Memory", desc: "calculates timeline diff", icon: ShieldCheck },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="workflow" className="py-28 border-b border-[#E5E7EB] bg-white/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <div className="max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2563EB]">AI Pipeline</span>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-[#0F172A]">The CascadeFlow Engine</h2>
          <p className="text-sm.5 text-[#64748B] leading-relaxed">
            Watch competitive intelligence flow sequentially from initial query to board-ready strategic summaries.
          </p>
        </div>

        {/* Animated Horizontal Timeline */}
        <div className="relative overflow-x-auto pb-8 scrollbar-none px-4">
          <div className="flex items-center gap-4 min-w-[1050px] justify-between relative py-6">
            
            {/* SVG Connecting flowing path */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-200 pointer-events-none z-0">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#14B8A6]"
                style={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {steps.map((st, idx) => {
              const isActive = idx === activeIdx;
              const isPast = idx < activeIdx;
              const Icon = st.icon;

              return (
                <div key={st.id} className="relative z-10 flex-1 flex flex-col items-center">
                  <motion.div
                    animate={
                      isActive
                        ? { scale: 1.1, y: -4 }
                        : { scale: 1, y: 0 }
                    }
                    className={`w-12.5 h-12.5 rounded-2xl border flex items-center justify-center shadow-sm transition-all duration-300 relative ${
                      isActive
                        ? "border-[#2563EB] bg-white text-[#2563EB] shadow-glow"
                        : isPast
                          ? "border-[#2563EB]/40 bg-white text-[#2563EB]"
                          : "border-[#E5E7EB] bg-white text-[#64748B]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-ping" />
                    )}
                  </motion.div>

                  <div className="text-center mt-3 max-w-[110px]">
                    <div className={`text-[11.5px] font-bold ${isActive ? "text-[#0F172A]" : "text-[#64748B]"}`}>
                      {st.label}
                    </div>
                    <div className="text-[9.5px] text-[#64748B]/80 mt-0.5 leading-tight truncate">
                      {st.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

// 6. How It Works: Timeline with illustration components
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Enter Company",
      desc: "Drop in competitor name or URL. CompetiLens automatically identifies tech stack, HQ, and industry segments.",
      element: (
        <div className="h-44 rounded-2xl border border-[#E5E7EB] bg-white/70 p-4.5 flex flex-col justify-center space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              readOnly
              value="linear.app"
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-slate-50 text-xs font-semibold text-[#0F172A] focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["linear.app", "notion.so"].map((s, idx) => (
              <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#2563EB]/5 text-[#2563EB] border border-[#2563EB]/15 select-none">
                {s}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "02",
      title: "Agents Collect Data",
      desc: "Concurrent crawlers pull pricing models, changelogs, sentiment indexes, patent logs, and PR articles.",
      element: (
        <div className="h-44 rounded-2xl border border-[#E5E7EB] bg-white/70 p-4.5 flex flex-col justify-center space-y-3 relative overflow-hidden">
          <div className="space-y-2">
            {[
              { label: "Pricing Table Diff", status: "Crawling..." },
              { label: "Changelog Indexing", status: "Scraping..." },
              { label: "Sentiment mapping", status: "Clustering..." },
            ].map((crawler, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" /> {crawler.label}
                </span>
                <span className="text-[10px] text-[#2563EB] font-bold animate-pulse">{crawler.status}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "AI Generates Strategy",
      desc: "Analysis and strategy engines structure SWOT metrics and outline action recommendations.",
      element: (
        <div className="h-44 rounded-2xl border border-[#E5E7EB] bg-white/70 p-4 flex flex-col justify-center gap-2">
          <div className="p-2.5 rounded-xl border border-success/20 bg-success/5 text-[10.5px] leading-relaxed text-muted-foreground">
            <span className="font-bold text-success">STRENGTH (+):</span> Best-in-class keyboard shortcuts & DX tools.
          </div>
          <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-[10.5px] leading-relaxed text-muted-foreground">
            <span className="font-bold text-primary">RECOMMENDATION:</span> Ship annual commit discounts within 30d.
          </div>
        </div>
      ),
    },
    {
      num: "04",
      title: "Export Executive Briefing",
      desc: "Download complete PDF reports, push alerts into Slack workspace, and log historical changes.",
      element: (
        <div className="h-44 rounded-2xl border border-[#E5E7EB] bg-white/70 p-4.5 flex flex-col justify-center space-y-3">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-[#E5E7EB]">
            <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
              <Slack className="w-4 h-4 text-warning" /> Slack Alert
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <button className="w-full h-10 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md">
            <FileText className="w-3.5 h-3.5" /> Download PDF report
          </button>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-28 border-b border-[#E5E7EB] max-w-7xl mx-auto px-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-20">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2563EB]">Timeline</span>
        <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-[#0F172A]">How it Works</h2>
        <p className="text-sm.5 text-[#64748B]">
          Deploying competitor intelligence pipelines is simplified into four steps.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((st, idx) => (
          <div key={st.num} className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-5xl font-extrabold text-slate-200 select-none">{st.num}</div>
              <h3 className="text-md.5 font-bold tracking-tight text-[#0F172A]">{st.title}</h3>
              <p className="text-xs.5 text-[#64748B] leading-relaxed">
                {st.desc}
              </p>
            </div>
            <div>
              {st.element}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 7. AI Agents Section: Floating premium cards
function AgentsSection() {
  const items = [
    {
      icon: Search,
      title: "Research Agent",
      desc: "Crawl databases, trademark documents, patent filings and corporate registries to track new competitive footprints.",
      status: "Online",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Globe,
      title: "Website Agent",
      desc: "Screens product pricing models, custom seat calculators, feature lists, and tracks micro-changes on websites.",
      status: "Idle",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Newspaper,
      title: "News Agent",
      desc: "Monitors 10,000+ blogs, PR releases, tech journals, newsletters, and global announcements in real time.",
      status: "Online",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: MessageSquare,
      title: "Review Agent",
      desc: "Aggregates customer sentiment across G2, Trustpilot, Reddit, and Twitter to detect complaints and praise trends.",
      status: "Online",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Brain,
      title: "Analysis Agent",
      desc: "Processes scraped datasets, filters noise, maps correlations, and populates swot summaries automatically.",
      status: "Online",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Target,
      title: "Strategy Agent",
      desc: "Synthesizes intelligence points into executive briefs and prioritizes 6-week counterplan recommendations.",
      status: "Offline",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section id="agents" className="py-28 border-b border-[#E5E7EB] bg-[#F8FAFC]/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2563EB]">AI Agents</span>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-[#0F172A]">MEET THE RESEARCH STAFF</h2>
          <p className="text-sm.5 text-[#64748B]">
            Six specialized AI agent cores collaborating to keep your market strategy updated.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((a, idx) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.title}
                whileHover={{ y: -6 }}
                className="p-6.5 rounded-[24px] border border-[#E5E7EB] bg-white shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Top row with status badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${a.color} flex items-center justify-center text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        a.status === "Online" ? "bg-[#10B981]" : a.status === "Idle" ? "bg-amber-400" : "bg-slate-300"
                      }`} />
                      <span className="text-[9.5px] uppercase font-bold text-[#64748B]">{a.status}</span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-[15px] font-bold text-[#0F172A]">{a.title}</h3>
                  <p className="mt-2 text-xs.5 leading-relaxed text-[#64748B]">
                    {a.desc}
                  </p>
                </div>

                <div className="border-t border-slate-100 mt-5 pt-3.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]/80">Cascade mode</span>
                  <span className="text-[10px] text-[#64748B]/60">Check check interval: 6h</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// 8. Product Showcase: Large Mockup with Browser Frame
function ProductShowcase() {
  return (
    <section id="showcase" className="py-28 border-b border-[#E5E7EB] bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <div className="max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2563EB]">Product Showcase</span>
          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-[#0F172A]">THE INTEGRATED CONSOLE</h2>
          <p className="text-sm.5 text-[#64748B]">
            One workspace housing dashboard analytics, report logs, memory diffs, and Slack alerts.
          </p>
        </div>

        {/* Browser Mockup */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[28px] border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden text-left relative"
        >
          {/* Header */}
          <div className="h-11 px-4.5 border-b border-[#E5E7EB] bg-slate-50/80 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/75" />
            <span className="ml-4 text-[10.5px] font-semibold text-[#64748B]">competilens.ai/workspace/dashboard</span>
          </div>

          {/* Body */}
          <div className="p-6 grid md:grid-cols-[1fr_2fr] gap-8">
            {/* Sidebar list mock */}
            <div className="space-y-4 border-r border-[#E5E7EB] pr-6 hidden md:block">
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">WORKSPACE SECTIONS</div>
              <div className="space-y-1">
                {[
                  { label: "Dashboard Overview", active: true },
                  { label: "Executive Reports Library", active: false },
                  { label: "Competitive Timeline Diffs", active: false },
                  { label: "AI Memory Snapshots", active: false },
                  { label: "Integrations & Alerts", active: false },
                ].map((sec, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                      sec.active ? "bg-[#2563EB]/10 text-[#2563EB]" : "text-[#64748B] hover:bg-slate-50"
                    }`}
                  >
                    {sec.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h4 className="text-md font-bold text-[#0F172A]">Workspace Activity</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Tracking 5 core competitor portfolios</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25">
                  128 signals checked today
                </span>
              </div>

              {/* KPI cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "COMPETITORS", value: "5 Tracked", color: "text-[#2563EB]" },
                  { label: "AVG THREAT SCORE", value: "78 / 100", color: "text-[#06B6D4]" },
                  { label: "REPORTS", value: "148 generated", color: "text-[#14B8A6]" },
                ].map((kpi, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50">
                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">{kpi.label}</div>
                    <div className={`mt-1.5 text-sm font-extrabold ${kpi.color}`}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Mini signal timeline list */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Latest Alerts</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB]">
                    <span className="font-semibold text-[#0F172A]">Vercel adjusted base seat pricing to $20</span>
                    <span className="text-[10px] text-[#64748B]">1h ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E7EB]">
                    <span className="font-semibold text-[#0F172A]">Notion shipped AI native meetings workspace</span>
                    <span className="text-[10px] text-[#64748B]">4h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 9. Before/After Section: Animated Comparison Cards
function BeforeAfterSection() {
  const beforeList = [
    "Manual competitor checks daily",
    "Outdated copy-paste spreadsheets",
    "Missing critical feature launches",
    "Hours spent synthesizing SWOT reports",
  ];

  const afterList = [
    "Autonomous agent crawlers 24/7",
    "Real-time alerts via Slack & Email",
    "Continuous AI memory diff timelines",
    "Board-ready briefs compiled in seconds",
  ];

  return (
    <section className="py-28 border-b border-[#E5E7EB] max-w-5xl mx-auto px-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2563EB]">The Shift</span>
        <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-[#0F172A]">MANUAL VS AUTONOMOUS</h2>
        <p className="text-sm.5 text-[#64748B]">
          Upgrade from slow ad-hoc tracking to continuous market intelligence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Before Card */}
        <div className="p-6.5 sm:p-8 rounded-[26px] border border-[#E5E7EB] bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
              <X className="w-5 h-5" />
            </div>
            <h3 className="text-md.5 font-bold text-[#0F172A]">BEFORE COMPETILENS</h3>
          </div>

          <ul className="space-y-4">
            {beforeList.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start text-xs.5 text-[#64748B]">
                <Minus className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* After Card */}
        <div className="p-6.5 sm:p-8 rounded-[26px] border border-[#2563EB] bg-[#2563EB]/5 shadow-glow space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2563EB]/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="text-md.5 font-bold text-[#0F172A]">AFTER COMPETILENS</h3>
          </div>

          <ul className="space-y-4">
            {afterList.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start text-xs.5 text-[#0F172A] font-semibold">
                <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// 10. Pricing Section: Premium Glass Cards with Month/Year Toggle
function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Free Sandbox",
      price: "$0",
      desc: "Evaluate autonomous monitoring capabilities.",
      features: [
        "Track up to 2 competitors",
        "Weekly email brief",
        "Daily website pricing checks",
        "Standard SWOT outlines",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Scale Pro",
      price: billingCycle === "yearly" ? "$79" : "$99",
      desc: "For fast-moving tech startups looking to defend market share.",
      features: [
        "Track up to 10 competitors",
        "Real-time alerts (Slack & Webhooks)",
        "6 concurrent agent pipelines",
        "AI Memory comparison diffs",
        "Interactive PDF export support",
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For corporate strategy teams needing bespoke agent pipelines.",
      features: [
        "Unlimited competitor check domains",
        "Bring your own API keys",
        "Dedicated agent cloud clusters",
        "Hourly update checks SLA",
        "Premium support & custom logs",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-28 max-w-7xl mx-auto px-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2563EB]">PRICING PLANS</span>
        <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-[#0F172A]">Flexible pricing for operators</h2>
        <p className="text-sm.5 text-[#64748B]">
          Choose the speed and depth of competitor tracking that suits your pipeline.
        </p>

        {/* Sliding Pill Toggle */}
        <div className="pt-4 flex justify-center">
          <div className="relative p-1 rounded-xl bg-slate-100 border border-[#E5E7EB] flex items-center gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition select-none cursor-pointer ${
                billingCycle === "monthly" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition select-none cursor-pointer flex items-center gap-1 ${
                billingCycle === "yearly" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Yearly <span className="text-[9px] px-1 rounded bg-[#2563EB]/10 text-[#2563EB] font-extrabold">-20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`p-7 sm:p-8 rounded-[28px] border flex flex-col justify-between relative transition-all duration-300 ${
              p.popular
                ? "border-[#2563EB] bg-white shadow-lg ring-1 ring-[#2563EB]/35 -translate-y-1.5 shadow-glow"
                : "border-[#E5E7EB] bg-white/70 backdrop-blur-md"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-[9.5px] uppercase font-extrabold tracking-wider shadow-sm">
                Most Popular
              </span>
            )}

            <div>
              <div className="text-md.5 font-bold text-[#0F172A] tracking-tight">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">{p.price}</span>
                {p.price !== "Custom" && <span className="text-xs text-[#64748B] font-semibold">/ month</span>}
              </div>
              <p className="text-xs.5 text-[#64748B] mt-2 leading-relaxed">{p.desc}</p>

              <div className="w-full border-t border-slate-100 my-6" />

              <ul className="space-y-3.5 text-xs.5 text-[#64748B]">
                {p.features.map((feat) => (
                  <li key={feat} className="flex gap-2.5 items-start leading-normal">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Link
                to="/signup"
                className={`w-full h-11 rounded-xl font-bold text-xs.5 transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  p.popular
                    ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-md hover:opacity-95"
                    : "border border-[#E5E7EB] bg-slate-50/50 hover:bg-slate-100 text-[#0F172A]"
                }`}
              >
                {p.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 11. FAQ Accordion Section
function FAQSection() {
  const faqs = [
    {
      q: "How does the autonomous agent loop compare to basic keyword alerts?",
      a: "Keyword trackers search for raw text matches. CompetiLens AI agents actually load competitor pages, diff pricing tables, parse corporate filings, cluster semantic sentiment, filter noise, and compile SWOT insights.",
    },
    {
      q: "Can we host or direct the system using our private API models?",
      a: "Yes. Our Enterprise plan fully supports bringing your own API keys for OpenAI, Anthropic, or integrating private cloud endpoints for data security.",
    },
    {
      q: "Do you offer a free developer sandbox?",
      a: "Yes. Our Free Sandbox includes tracking up to 2 competitors, daily pricing table checks, and weekly email summaries.",
    },
    {
      q: "How often do agents check for updates?",
      a: "Pro checking is set at 6 hours intervals. Enterprise SLA supports custom intervals down to hourly checks.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 border-t border-[#E5E7EB] max-w-4xl mx-auto px-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2563EB]">FAQ</span>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = idx === openIdx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#E5E7EB] bg-white p-4.5 sm:p-5 transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-md.5 text-[#0F172A] tracking-tight cursor-pointer"
              >
                <span>{faq.q}</span>
                <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#64748B] transition-transform duration-200 ${isOpen ? "rotate-180 bg-[#2563EB]/10 text-[#2563EB]" : ""}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs.5 text-[#64748B] mt-4 pt-4 border-t border-slate-100 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 12. Footer: Dark Premium Minimal Footer
function Footer() {
  return (
    <footer className="bg-[#090D1A] text-slate-400 border-t border-white/[0.08] py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        {/* Logo and Short description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-white text-[15px]">CompetiLens</span>
          </div>
          <p className="text-xs.5 leading-relaxed max-w-xs text-slate-500">
            Autonomous competitive intelligence pipelines for tech organizations that value continuous strategy monitoring.
          </p>
          <div className="text-[11px] text-slate-500 font-semibold italic pt-2">
            Built for modern strategy teams.
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-3.5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Product</div>
          <ul className="space-y-2 text-xs.5">
            <li><a href="#workflow" className="hover:text-white transition duration-200">AI Workflow</a></li>
            <li><a href="#agents" className="hover:text-white transition duration-200">AI Agents</a></li>
            <li><a href="#pricing" className="hover:text-white transition duration-200">Pricing Tiers</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-3.5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Resources</div>
          <ul className="space-y-2 text-xs.5">
            <li><a href="#how-it-works" className="hover:text-white transition duration-200">How it Works</a></li>
            <li><a href="#faq" className="hover:text-white transition duration-200">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition duration-200">Developer API</a></li>
          </ul>
        </div>

        {/* Legal & Socials */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Legal & Social</div>
          <ul className="space-y-2 text-xs.5">
            <li><a href="#" className="hover:text-white transition duration-200">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition duration-200">Privacy Policy</a></li>
          </ul>
          
          <div className="flex items-center gap-3 pt-3">
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/[0.08] mt-12 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="text-slate-500">© 2026 CompetiLens AI. All rights reserved.</span>
        <span className="text-slate-600">Enterprise competitive operations, automated.</span>
      </div>
    </footer>
  );
}
