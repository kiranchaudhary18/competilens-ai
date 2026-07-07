import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Search,
  Globe,
  Newspaper,
  MessageSquare,
  Brain,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [{ title: "Sign In — CompetiLens AI" }],
  }),
  component: SignIn,
});

// Custom Count Up component using requestAnimationFrame
function StatCounter({ endValue, suffix = "" }: { endValue: string; suffix?: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500; // ms
    const end = parseFloat(endValue.replace(/[^0-9.]/g, ""));
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * end;
      if (endValue.includes(".")) {
        setValue(Number(current.toFixed(1)));
      } else {
        setValue(Math.floor(current));
      }
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

// Custom animated eye icon
function EyeIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-all duration-300"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <motion.circle
        cx="12"
        cy="12"
        r="3"
        animate={{ scale: isOpen ? 1 : 0.4 }}
        transition={{ duration: 0.2 }}
      />
      {!isOpen && (
        <motion.line
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25 }}
        />
      )}
    </svg>
  );
}

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/dashboard" });
    }, 1500);
  };

  // 6 orbiting nodes
  const nodes = [
    { name: "Research", icon: Search, x: 160, y: 32, labelPos: "-top-6 left-1/2 -translate-x-1/2" },
    { name: "Website", icon: Globe, x: 280, y: 88, labelPos: "top-1/2 -translate-y-1/2 -right-16" },
    { name: "News", icon: Newspaper, x: 280, y: 232, labelPos: "top-1/2 -translate-y-1/2 -right-12" },
    { name: "Review", icon: MessageSquare, x: 160, y: 288, labelPos: "-bottom-6 left-1/2 -translate-x-1/2" },
    { name: "Analysis", icon: Brain, x: 40, y: 232, labelPos: "top-1/2 -translate-y-1/2 -left-16" },
    { name: "Strategy", icon: Target, x: 40, y: 88, labelPos: "top-1/2 -translate-y-1/2 -left-16" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#2563EB]/10 overflow-hidden relative">
      {/* Floating Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-30 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E2E8F0] bg-white/80 hover:bg-white backdrop-blur-md text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:border-[#2563EB]/30 hover:shadow-sm hover:-translate-y-0.5 transition duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB]" />
        <span>Back to Home</span>
      </Link>
      {styleTag}
      {/* Light soft noise texture overlay */}
      <svg className="hidden">
        <filter id="noise-texture-signin-light">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.015 0" />
        </filter>
      </svg>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-70" style={{ filter: "url(#noise-texture-signin-light)" }} />

      {/* Large blurred blue and cyan radial gradients matching Landing Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-[#2563EB]/5 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/5 w-[420px] h-[420px] rounded-full bg-[#06B6D4]/5 blur-[120px] animate-float-reverse" />
      </div>

      {/* Floating glowing particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#06B6D4]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120 - Math.random() * 100],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1200px] rounded-[32px] border border-[#E2E8F0]/80 bg-white/70 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.04)] overflow-hidden grid lg:grid-cols-[40fr_60fr] relative z-10 h-auto lg:h-[640px] max-h-[95vh] lg:max-h-[90vh]"
      >
        {/* LEFT PANEL: Light Cinematic AI Visual (40%) */}
        <div className="relative flex flex-col justify-between p-8 bg-gradient-to-br from-white via-slate-50/50 to-white text-[#0F172A] border-r border-[#E2E8F0] overflow-hidden">
          {/* Subtle center network glowing background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#2563EB]/5 blur-[100px] pointer-events-none" />

          {/* Brand Header */}
          <Link to="/" className="relative flex items-center gap-2.5 z-10 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-md">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-md text-[#0F172A]">CompetiLens</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 uppercase font-extrabold tracking-widest">
              AI
            </span>
          </Link>

          {/* Cinematic Light neural net */}
          <div className="relative flex items-center justify-center flex-1 my-4">
            <div className="w-80 h-80 relative flex items-center justify-center select-none scale-105">
              
              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {[
                  { x: 160, y: 32 },
                  { x: 280, y: 88 },
                  { x: 280, y: 232 },
                  { x: 160, y: 288 },
                  { x: 40, y: 232 },
                  { x: 40, y: 88 },
                ].map((target, idx) => (
                  <g key={idx}>
                    <line
                      x1="160"
                      y1="160"
                      x2={target.x}
                      y2={target.y}
                      stroke="rgba(37, 99, 235, 0.08)"
                      strokeWidth="1.5"
                    />
                    <motion.line
                      x1="160"
                      y1="160"
                      x2={target.x}
                      y2={target.y}
                      stroke="url(#line-glow-signin-light)"
                      strokeWidth="2"
                      strokeDasharray="6 20"
                      animate={{ strokeDashoffset: [-120, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    />
                  </g>
                ))}
                <defs>
                  <linearGradient id="line-glow-signin-light" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Blue glowing AI Core */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 15px rgba(37,99,235,0.15)", "0 0 25px rgba(6,182,212,0.3)", "0 0 15px rgba(37,99,235,0.15)"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-lg relative z-10 border border-white"
              >
                <Sparkles className="w-6.5 h-6.5 text-white" />
                <span className="absolute inset-0 rounded-full bg-[#06B6D4]/20 blur-md -z-10 animate-ping opacity-60" />
              </motion.div>

              {/* Floating Orbiting AI Nodes */}
              {nodes.map((n, idx) => {
                const Icon = n.icon;
                return (
                  <motion.div
                    key={n.name}
                    animate={{
                      y: [0, (idx % 2 === 0 ? -5 : 5), 0],
                      x: [0, (idx % 3 === 0 ? 3.5 : -3.5), 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 5 + idx,
                      ease: "easeInOut"
                    }}
                    style={{
                      position: "absolute",
                      left: n.x - 22,
                      top: n.y - 22,
                    }}
                    className="w-11 h-11 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center shadow-sm relative group hover:border-[#2563EB]/40 transition duration-300 z-10"
                  >
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] border border-white animate-pulse" />
                    
                    <span className={`absolute ${n.labelPos} text-[9px] font-bold uppercase tracking-wider text-[#64748B] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-[#E2E8F0] opacity-90 pointer-events-none whitespace-nowrap shadow-sm`}>
                      {n.name}
                    </span>
                  </motion.div>
                );
              })}

            </div>
          </div>

          {/* Light Copywriting & Statistics */}
          <div className="space-y-6 relative z-10 pt-6 border-t border-[#E2E8F0]">
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                The future of competitive intelligence.
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                Six autonomous AI agents monitor pricing, hiring, product launches, customer reviews and market signals in real time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-2">
              <div>
                <div className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  <StatCounter endValue="24" />
                </div>
                <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Companies</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  <StatCounter endValue="18" suffix="K" />
                </div>
                <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Signals</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  <StatCounter endValue="6" />
                </div>
                <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">AI Agents</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-[#2563EB] tracking-tight">
                  <StatCounter endValue="99.8" suffix="%" />
                </div>
                <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Light Form Card (60%) */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white/40 backdrop-blur-md relative overflow-y-auto h-full">
          <div className="w-full max-w-[440px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="space-y-2 text-left">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[9.5px] uppercase font-extrabold tracking-wider border border-[#2563EB]/25">
                AI Command Center
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">Welcome Back</h2>
              <p className="text-xs.5 text-[#64748B] font-semibold leading-relaxed">
                Access your AI command center.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs.5 leading-normal"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating label input for Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full h-13 pt-4.5 pb-1 pl-11 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition placeholder-transparent shadow-sm"
                />
                <label
                  htmlFor="email"
                  className="absolute left-11 top-3.5 text-[#64748B] text-xs pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#64748B]"
                >
                  Email Address
                </label>
              </div>

              {/* Floating label input for Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full h-13 pt-4.5 pb-1 pl-11 pr-11 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition placeholder-transparent shadow-sm"
                />
                <label
                  htmlFor="password"
                  className="absolute left-11 top-3.5 text-[#64748B] text-xs pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#64748B]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
                >
                  <EyeIcon isOpen={showPassword} />
                </button>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs font-bold">
                <label className="flex items-center gap-2 text-[#64748B] select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]/20 bg-white cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[#2563EB] hover:text-[#06B6D4] transition"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Gradient Submit Button */}
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] text-white text-xs.5 font-bold shadow-md transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Social Logins */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-[#E2E8F0]" />
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                  or sign in with
                </span>
                <div className="h-[1px] flex-1 bg-[#E2E8F0]" />
              </div>

              <div className="flex items-center justify-center gap-4">
                {[
                  {
                    name: "Google",
                    svg: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )
                  },
                  {
                    name: "GitHub",
                    svg: (
                      <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.066 6.839 9.39.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.062 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    )
                  },
                  {
                    name: "Microsoft",
                    svg: (
                      <svg className="w-5 h-5" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                    )
                  },
                  {
                    name: "Apple",
                    svg: (
                      <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.84-1.01 2.96 1.12.09 2.26-.57 2.94-1.39z"/>
                      </svg>
                    )
                  }
                ].map((s) => (
                  <motion.button
                    whileHover={{ scale: 1.1, y: -1.5, borderColor: "rgba(37,99,235,0.4)", boxShadow: "0 0 12px rgba(37,99,235,0.12)" }}
                    whileTap={{ scale: 0.95 }}
                    key={s.name}
                    type="button"
                    title={s.name}
                    className="w-11 h-11 rounded-full border border-[#E2E8F0] bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer"
                  >
                    {s.svg}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-xs.5 font-bold text-[#64748B] pt-2 select-none">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#2563EB] hover:text-[#06B6D4] transition relative group"
              >
                Create Workspace →
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-all duration-300 group-hover:w-full" />
              </Link>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Injected styling patterns
const styleTag = (
  <style>{`
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes floatReverse {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(8px) rotate(-1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    .animate-float-slow {
      animation: float 7s ease-in-out infinite;
    }
    .animate-float-reverse {
      animation: floatReverse 8s ease-in-out infinite;
    }
  `}</style>
);
