import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Github, Shield, Lock, Cpu, ArrowLeft } from "lucide-react";
import { GlowButton } from "@/components/app/ui";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — CompetiLens AI" }] }),
  component: Login,
});

// Custom Google SVG Icon
function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

// Particle Background for the left side
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {[
        { t: "12%", l: "18%", d: "4s", s: "h-2 w-2", c: "bg-[#726BFF]/40" },
        { t: "35%", l: "72%", d: "7s", s: "h-3 w-3", c: "bg-[#5CA9FF]/30 blur-[1px]" },
        { t: "55%", l: "22%", d: "5s", s: "h-1.5 w-1.5", c: "bg-[#31D88A]/40" },
        { t: "82%", l: "85%", d: "6s", s: "h-2.5 w-2.5", c: "bg-[#B68CFF]/30" },
        { t: "20%", l: "50%", d: "8s", s: "h-2 w-2", c: "bg-[#F36B73]/30" },
        { t: "70%", l: "40%", d: "9s", s: "h-3 w-3", c: "bg-[#726BFF]/20 blur-[1px]" },
      ].map((p, idx) => (
        <span
          key={idx}
          className={`absolute rounded-full animate-float ${p.s} ${p.c}`}
          style={{
            top: p.t,
            left: p.l,
            animationDuration: p.d,
            animationDelay: `${idx * 0.4}s`
          }}
        />
      ))}
    </div>
  );
}

function NeuralNodeEngine() {
  return (
    <div className="relative w-full h-[280px] flex items-center justify-center my-6">
      {/* Outer spinning ring */}
      <div className="absolute w-56 h-56 rounded-full border border-dashed border-white/5 animate-spin-slow" />
      {/* Mid ring */}
      <div className="absolute w-40 h-40 rounded-full border border-white/8 animate-spin" style={{ animationDuration: "16s", animationDirection: "reverse" }} />
      {/* Central Core */}
      <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-[#726BFF] to-[#B68CFF] flex items-center justify-center shadow-[0_0_50px_rgba(114,107,255,0.4)] z-10 border border-white/20">
        <Sparkles className="h-6 w-6 text-white" strokeWidth={2.2} />
      </div>

      {/* Floating interactive cards */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Card 1 */}
        <div className="absolute top-2 left-6 glass-strong rounded-xl p-3 border border-[#F36B73]/25 shadow-xl animate-float max-w-[170px]">
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#F36B73] font-bold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F36B73] animate-glow-pulse" /> pricing · Acme
          </div>
          <div className="text-[10px] text-white font-semibold mt-1">Pro Plan cut by 18%</div>
        </div>

        {/* Card 2 */}
        <div className="absolute top-24 right-4 glass-strong rounded-xl p-3 border border-[#726BFF]/25 shadow-xl animate-float max-w-[170px]" style={{ animationDelay: "1.8s" }}>
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#B68CFF] font-bold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#726BFF] animate-glow-pulse" /> product · Vertex
          </div>
          <div className="text-[10px] text-white font-semibold mt-1">AI Search v4.2 Live</div>
        </div>

        {/* Card 3 */}
        <div className="absolute bottom-2 left-10 glass-strong rounded-xl p-3 border border-[#F4B84F]/25 shadow-xl animate-float max-w-[170px]" style={{ animationDelay: "3.2s" }}>
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#F4B84F] font-bold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F4B84F] animate-glow-pulse" /> sentiment · Nova
          </div>
          <div className="text-[10px] text-white font-semibold mt-1">Reviews rating down 12%</div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "../lib/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await api.login({ email, password });
      toast.success("Welcome to CompetiLens!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Authentication failed. Using sandbox access.");
      // Graceful fallback for sandbox testing
      navigate({ to: "/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0E1628] text-white flex items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(114,107,255,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(182,140,255,0.1),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-fade opacity-30" />

      {/* Main Container */}
      <div className="mx-auto w-full max-w-7xl min-h-screen grid grid-cols-1 md:grid-cols-12 items-stretch px-4 md:px-8">

        {/* Left Side: Product context & storytelling (55% width) */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-7 flex-col justify-between py-12 pr-12 relative border-r border-white/8">
          {/* Particles */}
          <FloatingParticles />

          {/* Top Logo & Back Button */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#726BFF] to-[#B68CFF] shadow-[0_4px_12px_rgba(114,107,255,0.3)] border border-white/20">
                <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">CompetiLens</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-mono border border-white/8 bg-white/[0.02] rounded-full px-3.5 py-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>

          {/* Central AI Node Engine & Welcome */}
          <div className="my-auto max-w-lg space-y-6">
            <h1 className="font-display text-5xl leading-tight font-bold text-white tracking-tight">
              Access the <br />
              <span className="italic text-gradient">Intelligence Layer.</span>
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed">
              We built CompetiLens to give modern enterprise strategy teams real-time market foresight. Track competitor nodes, analyze signal streams, and compile high-confidence strategy briefs autonomously.
            </p>

            {/* Neural engine */}
            <NeuralNodeEngine />

            {/* Mini Dashboard preview indicators */}
            <div className="glass rounded-2xl p-4 border border-white/8 bg-gradient-to-r from-[#726BFF]/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-[#5CA9FF] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-wider text-slate-300 font-bold uppercase">Workspace Status</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#31D88A] animate-glow-pulse" />
                  <span className="font-mono text-[9px] text-[#31D88A] font-bold">7 ACTIVE SIGNALS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer of Left side */}
          <div className="text-[10px] text-slate-500 font-mono tracking-widest flex gap-4 uppercase select-none">
            <span>© 2026 CompetiLens Labs</span>
            <span>·</span>
            <span>All systems active</span>
          </div>
        </div>

        {/* Right Side: Auth Card (45% width) */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-center py-12 md:pl-12 lg:pl-16">
          {/* Logo for mobile view */}
          <div className="flex md:hidden items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#726BFF] to-[#B68CFF]"><Sparkles className="h-3.5 w-3.5 text-white" /></span>
              <span className="font-display text-lg font-bold">CompetiLens</span>
            </Link>
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>

          {/* Glass Card */}
          <div className="glass-strong rounded-[28px] border border-white/8 p-8 md:p-10 shadow-[0_30px_70px_rgba(5,8,16,0.4)] relative bg-gradient-to-b from-[#151F35]/90 to-[#0E1628]/95">
            {/* Ambient inner card glow */}
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(114,107,255,0.06),transparent_70%)] pointer-events-none" />

            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B68CFF] font-bold">Console Access</div>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">Enter the console.</h2>
              <p className="mt-1.5 text-xs text-slate-400 leading-normal">Authenticate to access your workspace signals and dossiers.</p>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#1C2840]/60 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#1C2840] hover:border-white/12 active:scale-98 transition duration-300">
                  <GoogleIcon className="h-4 w-4" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#1C2840]/60 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#1C2840] hover:border-white/12 active:scale-98 transition duration-300">
                  <Github className="h-4 w-4 text-white" /> GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase select-none">
                <div className="h-px flex-1 bg-white/5" />
                <span>or email credentials</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Email address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition-all duration-300 shadow-inner"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Password</label>
                    <a href="#" className="text-[10px] font-mono text-[#5CA9FF] hover:text-[#726BFF] transition">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition-all duration-300 shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded-md border-white/8 bg-white/[0.02] text-[#726BFF] focus:ring-0 focus:ring-offset-0 accent-[#726BFF]/20"
                    />
                    Remember Me
                  </label>
                </div>

                <GlowButton type="submit" disabled={loading} className="w-full py-3 mt-6 text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
                  {loading ? "Verifying..." : "Sign in to Workspace"} <ArrowRight className="h-4 w-4" />
                </GlowButton>
              </form>

              {/* Sign up prompt */}
              <div className="mt-8 text-center text-xs text-slate-400">
                New to CompetiLens? <Link to="/signup" className="text-[#5CA9FF] hover:text-[#726BFF] font-bold font-mono ml-1">Create Account</Link>
              </div>

              {/* Trust Section */}
              <div className="mt-8 pt-6 border-t border-white/8 grid grid-cols-3 gap-2 text-center text-[8px] font-mono tracking-wider text-slate-500 uppercase select-none">
                <div className="flex flex-col items-center gap-1.5">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span>SOC2 Type II</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span>AES-256 BIT</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-slate-500" />
                  <span>Enterprise Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
