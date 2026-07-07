import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  User,
  Mail,
  Lock,
  Building,
  Globe2,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Database,
  Cpu,
  Server,
  Search,
  Globe,
  Newspaper,
  MessageSquare,
  Brain,
  Target,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Create Workspace — CompetiLens AI" }],
  }),
  component: SignUp,
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

import { useAuth } from "../components/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1); // 1 = Personal, 2 = Company, 3 = Workspace, 4 = Provisioning

  // Step 1: Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Company
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("SaaS / Software");
  const [country, setCountry] = useState("United States");
  const [teamSize, setTeamSize] = useState("2-10 people");

  // Step 3: Workspace
  const [workspaceName, setWorkspaceName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 4 Provisioning list
  const [provisionStep, setProvisionStep] = useState(0);
  const provisionLogs = [
    { text: "Creating Workspace", icon: Database },
    { text: "Deploying AI Agents", icon: Cpu },
    { text: "Initializing Database", icon: Server },
    { text: "Connecting Intelligence Engine", icon: Brain },
    { text: "Finalizing Dashboard", icon: ShieldCheck },
  ];

  // Password strength validation
  const hasMinLen = password.length >= 8;
  const hasNum = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSym = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthCount = [hasMinLen, hasNum, hasUpper, hasSym].filter(Boolean).length;
  const strengthPercent = (strengthCount / 4) * 100;

  // Domain availability mock check
  const [availability, setAvailability] = useState<"checking" | "available" | "taken" | null>(null);
  useEffect(() => {
    if (!workspaceName) {
      setAvailability(null);
      return;
    }
    setAvailability("checking");
    const delay = setTimeout(() => {
      if (workspaceName.length < 3) {
        setAvailability("taken");
      } else {
        setAvailability(workspaceName.length % 2 === 0 ? "available" : "taken");
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [workspaceName]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName) {
      setError("Please enter your name.");
      return;
    }
    if (!email) {
      setError("Please enter your work email.");
      return;
    }
    if (!password) {
      setError("Please choose a password.");
      return;
    }
    if (strengthCount < 3) {
      setError("Please pick a stronger password.");
      return;
    }

    if (!workspaceName && companyName) {
      setWorkspaceName(companyName.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    } else if (!workspaceName && !companyName) {
      const prefix = email.split("@")[0].replace(/[^a-z0-9-]/g, "");
      setWorkspaceName(prefix ? `${prefix}-portal` : "workspace");
    }

    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companyName) {
      setError("Please enter your company name.");
      return;
    }

    setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!workspaceName) {
      setError("Please enter a workspace URL prefix.");
      return;
    }
    if (availability === "taken") {
      setError("This workspace URL is taken.");
      return;
    }
    if (!acceptTerms) {
      setError("You must accept the terms of service.");
      return;
    }

    try {
      setLoading(true);
      await register({
        fullName,
        email,
        password,
        role: "OWNER",
      });
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Failed to create workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Simulation logic
  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setProvisionStep((prev) => {
          if (prev >= provisionLogs.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Orbiting nodes definitions
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
        <filter id="noise-texture-signup-light">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.015 0" />
        </filter>
      </svg>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-70" style={{ filter: "url(#noise-texture-signup-light)" }} />

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
                      stroke="url(#line-glow-signup-light)"
                      strokeWidth="2"
                      strokeDasharray="6 20"
                      animate={{ strokeDashoffset: [-120, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    />
                  </g>
                ))}
                <defs>
                  <linearGradient id="line-glow-signup-light" x1="0" y1="0" x2="1" y2="1">
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

        {/* RIGHT PANEL: Light Form Card Onboarding (60%) */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white/40 backdrop-blur-md relative overflow-y-auto h-full">
          <div className="w-full max-w-[440px] mx-auto space-y-6">
            
            {/* Header info */}
            {step < 4 && (
              <div className="space-y-4">
                {/* Step Progress Indicators */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        s <= step ? "bg-[#2563EB]" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="space-y-1">
                  <span className="text-[9.5px] uppercase font-extrabold text-[#2563EB] tracking-wider">
                    Step {step} of 3
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                    {step === 1 && "Create your Profile"}
                    {step === 2 && "Company details"}
                    {step === 3 && "Workspace configurations"}
                  </h2>
                </div>
              </div>
            )}

            {/* Error alerts */}
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

            <AnimatePresence mode="wait">
              {step === 1 && (
                // STEP 1: Personal Profile
                <motion.form
                  key="step-personal"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  onSubmit={handleStep1}
                  className="space-y-5"
                >
                  {/* Full Name */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                    <input
                      type="text"
                      id="fullname"
                      required
                      placeholder=" "
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="peer w-full h-13 pt-4.5 pb-1 pl-11 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition placeholder-transparent shadow-sm"
                    />
                    <label
                      htmlFor="fullname"
                      className="absolute left-11 top-3.5 text-[#64748B] text-xs pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#64748B]"
                    >
                      Full Name
                    </label>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer w-full h-13 pt-4.5 pb-1 pl-11 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition placeholder-transparent shadow-sm"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-11 top-3.5 text-[#64748B] text-xs pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#64748B]"
                    >
                      Work Email
                    </label>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
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

                  {/* Password Strength validation bar */}
                  {password && (
                    <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#64748B]">Password strength:</span>
                        <span className={`uppercase tracking-wider ${
                          strengthCount === 4 ? "text-[#10B981]" : strengthCount >= 3 ? "text-[#2563EB]" : "text-amber-600"
                        }`}>
                          {strengthCount === 4 ? "Very strong" : strengthCount >= 3 ? "Strong" : "Weak"}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strengthCount === 4 ? "bg-[#10B981]" : strengthCount >= 3 ? "bg-[#2563EB]" : "bg-amber-500"
                          }`}
                          style={{ width: `${strengthPercent}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9.5px] font-semibold text-[#64748B]">
                        <div className="flex items-center gap-1.5">
                          {hasMinLen ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>8+ Characters</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasNum ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>1+ Number</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasUpper ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>1+ Uppercase</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasSym ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>1+ Symbol</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue <ArrowRight className="w-4.5 h-4.5" />
                  </motion.button>

                  <p className="text-center text-xs.5 font-bold text-[#64748B] pt-2">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-[#2563EB] hover:underline">
                      Sign In
                    </Link>
                  </p>
                </motion.form>
              )}

              {step === 2 && (
                // STEP 2: Company Information
                <motion.form
                  key="step-company"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  onSubmit={handleStep2}
                  className="space-y-5"
                >
                  {/* Company Name */}
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                    <input
                      type="text"
                      id="company"
                      required
                      placeholder=" "
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="peer w-full h-13 pt-4.5 pb-1 pl-11 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition placeholder-transparent shadow-sm"
                    />
                    <label
                      htmlFor="company"
                      className="absolute left-11 top-3.5 text-[#64748B] text-xs pointer-events-none transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#2563EB] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#64748B]"
                    >
                      Company Name
                    </label>
                  </div>

                  {/* Industry Focus */}
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full h-13 pl-11 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition appearance-none cursor-pointer"
                    >
                      <option>SaaS / Software</option>
                      <option>Fintech / Blockchain</option>
                      <option>Artificial Intelligence</option>
                      <option>E-commerce / Retail</option>
                      <option>Agency / Consulting</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div className="relative">
                    <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-13 pl-11 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition appearance-none cursor-pointer"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Germany</option>
                      <option>Singapore</option>
                      <option>India</option>
                    </select>
                  </div>

                  {/* Team Size */}
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#2563EB] pointer-events-none" />
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full h-13 pl-11 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition appearance-none cursor-pointer"
                    >
                      <option>1 person (Just me)</option>
                      <option>2-10 people</option>
                      <option>11-50 people</option>
                      <option>51-200 people</option>
                      <option>201+ people</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="h-12 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] text-xs.5 font-bold transition cursor-pointer"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                      type="submit"
                      className="h-12 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/95 text-white text-xs.5 font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Continue <ArrowRight className="w-4.5 h-4.5" />
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                // STEP 3: Workspace config
                <motion.form
                  key="step-workspace"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  onSubmit={handleStep3}
                  className="space-y-5"
                >
                  {/* Workspace sub-domain */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="text"
                        required
                        placeholder="workspace-domain"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        className="w-full h-13 px-4 rounded-l-xl border border-[#E2E8F0] border-r-0 bg-white text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] transition"
                      />
                      <span className="h-13 px-4 flex items-center bg-slate-50 text-[#64748B] text-xs.5 font-bold border border-[#E2E8F0] rounded-r-xl select-none">
                        .competilens.ai
                      </span>
                    </div>

                    {/* Preview & Checker Badge */}
                    <div className="flex items-center justify-between text-xs pt-1 px-1">
                      <span className="text-[#64748B] font-medium">
                        Live Preview: <strong className="text-[#0F172A]">{workspaceName || "company"}.competilens.ai</strong>
                      </span>

                      {availability === "checking" && (
                        <span className="text-[9.5px] text-[#64748B] font-bold animate-pulse">Checking...</span>
                      )}
                      {availability === "available" && (
                        <span className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25">
                          Available
                        </span>
                      )}
                      {availability === "taken" && (
                        <span className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/25">
                          Taken
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start pt-2">
                    <input
                      id="terms-signup"
                      type="checkbox"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4.5 h-4.5 mt-0.5 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB]/20 bg-white cursor-pointer"
                    />
                    <label
                      htmlFor="terms-signup"
                      className="ml-2.5 text-xs text-[#64748B] select-none cursor-pointer leading-relaxed"
                    >
                      I accept the{" "}
                      <a href="#" className="font-bold text-[#2563EB] hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="font-bold text-[#2563EB] hover:underline">Privacy Policy</a>.
                    </label>
                  </div>

                  <div className="grid grid-cols-[100px_1fr] gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="h-12 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] text-xs.5 font-bold transition cursor-pointer"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Create Workspace <ArrowRight className="w-4.5 h-4.5" />
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {step === 4 && (
                // SUCCESS / PROVISIONING FLOW
                <motion.div
                  key="step-provisioning"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center mx-auto text-[#10B981] relative">
                    <ShieldCheck className="w-9 h-9 animate-bounce" />
                    <span className="absolute inset-0 rounded-2xl bg-[#10B981]/10 blur-md -z-10 animate-ping" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-[#0F172A]">Preparing Workspace</h3>
                    <p className="text-xs.5 text-[#64748B] leading-relaxed">
                      Setting up your private portal domain.
                    </p>
                  </div>

                  {/* Provision logs checkmarks list */}
                  <div className="space-y-3.5 max-w-[280px] mx-auto text-left py-3 border-t border-b border-[#E2E8F0]">
                    {provisionLogs.map((log, idx) => {
                      const LogIcon = log.icon;
                      const isDone = idx < provisionStep;
                      const isCurrent = idx === provisionStep;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3.5 text-xs.5 font-bold transition-all duration-300 ${
                            isDone
                              ? "text-[#10B981] opacity-100"
                              : isCurrent
                                ? "text-[#2563EB] opacity-100"
                                : "text-[#64748B] opacity-40"
                          }`}
                        >
                          {isDone ? (
                            <Check className="w-4.5 h-4.5 text-[#10B981]" />
                          ) : (
                            <LogIcon className={`w-4.5 h-4.5 ${isCurrent ? "animate-spin text-[#2563EB]" : "text-slate-400"}`} />
                          )}
                          <span>{log.text}</span>
                        </div>
                      );
                    })}
                  </div>


                  {/* Final enter CTA */}
                  <div className="pt-2">
                    <motion.button
                      onClick={() => navigate({ to: "/signin" })}
                      disabled={provisionStep < provisionLogs.length - 1}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs.5 font-bold shadow-md hover:shadow-[0_4px_20px_rgba(37,99,235,0.25)] transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Proceed to Login <ArrowRight className="w-4.5 h-4.5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
