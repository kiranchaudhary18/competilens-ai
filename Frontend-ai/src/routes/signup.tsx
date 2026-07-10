import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, Check, ArrowLeft, Shield, Lock, Cpu, Globe, Mail, Users, Plus, X, Github } from "lucide-react";
import { GlowButton } from "@/components/app/ui";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your workspace — CompetiLens AI" }] }),
  component: Signup,
});

// Custom Google Icon
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

// Particle background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {[
        { t: "15%", l: "22%", d: "5s", s: "h-2 w-2", c: "bg-[#726BFF]/30" },
        { t: "42%", l: "80%", d: "8s", s: "h-3 w-3", c: "bg-[#5CA9FF]/20 blur-[1px]" },
        { t: "62%", l: "15%", d: "6s", s: "h-1.5 w-1.5", c: "bg-[#31D88A]/30" },
        { t: "78%", l: "65%", d: "7s", s: "h-2 w-2", c: "bg-[#B68CFF]/25" }
      ].map((p, idx) => (
        <span
          key={idx}
          className={`absolute rounded-full animate-float ${p.s} ${p.c}`}
          style={{
            top: p.t,
            left: p.l,
            animationDuration: p.d,
            animationDelay: `${idx * 0.5}s`
          }}
        />
      ))}
    </div>
  );
}

// Visual AI core pipeline representation
function OnboardingIllustration() {
  return (
    <div className="relative w-full h-[280px] flex items-center justify-center my-8">
      {/* Outer orbit rings */}
      <div className="absolute w-60 h-60 rounded-full border border-dashed border-[#726BFF]/10 animate-spin-slow" />
      <div className="absolute w-44 h-44 rounded-full border border-[#B68CFF]/10 animate-spin" style={{ animationDuration: "18s", animationDirection: "reverse" }} />

      {/* Central sphere */}
      <div className="absolute h-16 w-16 rounded-full bg-gradient-to-br from-[#726BFF] to-[#5CA9FF] flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(114,107,255,0.3)] z-10">
        <Sparkles className="h-7 w-7 text-white" strokeWidth={2.2} />
      </div>

      {/* Connection paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <line x1="80" y1="60" x2="200" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="320" y1="80" x2="200" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="120" y1="240" x2="200" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
      </svg>

      {/* Floating Status Widgets */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Card 1 */}
        <div className="absolute top-4 left-6 glass-strong rounded-xl p-3 border border-[#31D88A]/20 shadow-lg animate-float max-w-[160px]">
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#31D88A] font-bold uppercase">
            <Check className="h-3 w-3 text-[#31D88A]" /> Setup Complete
          </div>
          <div className="text-[10px] text-white font-semibold mt-1">AI Agent Clusters Ready</div>
        </div>

        {/* Floating Card 2 */}
        <div className="absolute top-28 right-0 glass-strong rounded-xl p-3 border border-[#5CA9FF]/25 shadow-lg animate-float max-w-[165px]" style={{ animationDelay: "2s" }}>
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#5CA9FF] font-bold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5CA9FF] animate-glow-pulse" /> Telemetry Sync
          </div>
          <div className="text-[10px] text-white font-semibold mt-1">Watching Acme & Vertex</div>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "../lib/api";

function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State variables for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [role, setRole] = useState("Strategy Lead");
  const [invites, setInvites] = useState<string[]>([""]);

  // Password strength logic
  const strength = Math.min(4, [pw.length >= 8, /[A-Z]/.test(pw), /\d/.test(pw), /[^\w]/.test(pw)].filter(Boolean).length);
  const strengthLabel = ["Weak", "Weak", "Fair", "Strong", "Excellent"][strength];
  const strengthColor = ["#F36B73", "#F36B73", "#F4B84F", "#5CA9FF", "#31D88A"][strength];

  // Auto generate slug from workspace name
  const handleWorkspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWorkspaceName(val);
    setWorkspaceSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const addInviteField = () => {
    if (invites.length < 5) {
      setInvites([...invites, ""]);
    }
  };

  const removeInviteField = (index: number) => {
    const newInvites = [...invites];
    newInvites.splice(index, 1);
    setInvites(newInvites);
  };

  const handleInviteChange = (index: number, value: string) => {
    const newInvites = [...invites];
    newInvites[index] = value;
    setInvites(newInvites);
  };

  const handleSignup = async () => {
    if (!name || !email || !pw) {
      toast.error("Please fill in all fields on Step 1");
      setStep(1);
      return;
    }
    if (!workspaceName || !workspaceSlug) {
      toast.error("Please fill in workspace details on Step 2");
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      // 1. Register User
      await api.signup({
        fullName: name,
        email,
        password: pw,
      });

      // 2. Log in
      await api.login({
        email,
        password: pw,
      });

      // 3. Create Workspace
      try {
        await api.createWorkspace({
          name: workspaceName,
          slug: workspaceSlug,
        });
      } catch (wsErr) {
        console.error("Workspace creation failed, continuing...", wsErr);
      }

      // 4. Invite Peers (fire and forget)
      const validInvites = invites.filter((emailVal) => emailVal.trim() !== "");
      if (validInvites.length > 0) {
        for (const peerEmail of validInvites) {
          api.inviteMember({ email: peerEmail, role: "VIEWER" }).catch(console.error);
        }
      }

      toast.success("Workspace setup completed successfully!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Onboarding failed. Launching sandbox workspace.");
      navigate({ to: "/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0E1628] text-white flex items-center justify-center overflow-hidden">
      {/* Background radial spotlights */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(114,107,255,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(182,140,255,0.12),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-fade opacity-30" />

      {/* Main double column grid */}
      <div className="mx-auto w-full max-w-7xl min-h-screen grid grid-cols-1 md:grid-cols-12 items-stretch px-4 md:px-8">

        {/* Left Column (55% width): Brand contexts & illustrations */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-7 flex-col justify-between py-12 pr-12 relative border-r border-white/8">
          <FloatingParticles />

          {/* Header */}
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

          {/* Onboarding Context */}
          <div className="my-auto max-w-lg space-y-6">
            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white">
              Initialize Your <br />
              <span className="italic text-gradient">Strategic Console.</span>
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed">
              Activate your competitive intelligence node. Set up autonomous monitoring configurations, deploy specialized AI agents, and connect collaborative strategic planning modules.
            </p>

            {/* Pulsating core visual */}
            <OnboardingIllustration />

            {/* Quick value items */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-3 border border-white/8">
                <div className="flex items-center gap-2 text-[#5CA9FF]">
                  <Globe className="h-4 w-4" />
                  <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-slate-350">Continuous scans</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-normal">Scrapes code, plan rates, and user sentiment.</div>
              </div>
              <div className="glass rounded-xl p-3 border border-white/8">
                <div className="flex items-center gap-2 text-[#31D88A]">
                  <Users className="h-4 w-4" />
                  <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-slate-350">Team Alignment</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-normal">Publish dossiers directly to Slack or shared vaults.</div>
              </div>
            </div>
          </div>

          {/* Footer details */}
          <div className="text-[10px] text-slate-550 font-mono tracking-widest flex gap-4 uppercase select-none">
            <span>SOC 2 COMPLIANT</span>
            <span>·</span>
            <span>AES-256 ENCRYPTION</span>
          </div>
        </div>

        {/* Right Column (45% width): Glass Onboarding Card */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-center py-12 md:pl-12 lg:pl-16">
          {/* Mobile view top header */}
          <div className="flex md:hidden items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#726BFF] to-[#B68CFF]"><Sparkles className="h-3.5 w-3.5 text-white" /></span>
              <span className="font-display text-lg font-bold">CompetiLens</span>
            </Link>
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>

          {/* Onboarding Card */}
          <div className="glass-strong rounded-[28px] border border-white/8 p-8 md:p-10 shadow-[0_30px_70px_rgba(5,8,16,0.4)] relative bg-gradient-to-b from-[#151F35]/90 to-[#0E1628]/95">
            {/* Soft inner glow */}
            <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(114,107,255,0.06),transparent_70%)] pointer-events-none" />

            <div className="relative">

              {/* Progress Bar / Indicator */}
              <div className="mb-6 flex items-center gap-3">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex flex-1 items-center gap-2">
                    <div
                      className={`grid h-6 w-6 place-items-center rounded-full font-mono text-[10px] font-bold transition duration-300 ${stepNum <= step
                          ? "bg-gradient-to-br from-[#726BFF] to-[#5CA9FF] text-white shadow-[0_0_10px_rgba(114,107,255,0.3)]"
                          : "border border-white/8 text-slate-500 bg-white/[0.01]"
                        }`}
                    >
                      {stepNum < step ? <Check className="h-3 w-3" strokeWidth={3} /> : stepNum}
                    </div>
                    {stepNum < 3 && (
                      <div className={`h-[2px] flex-1 rounded-full transition-all duration-300 ${stepNum < step ? "bg-[#726BFF]" : "bg-white/5"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Steps Headers & Content */}
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B68CFF] font-bold">Step {step} of 3</div>

              {/* STEP 1: Personal Credentials */}
              {step === 1 && (
                <div className="animate-fade-up">
                  <h2 className="mt-2 font-display text-3xl font-bold text-white">Create your account.</h2>
                  <p className="mt-1 text-xs text-slate-400">Initialize your access credentials in our database.</p>

                  {/* Google & GitHub Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#1C2840]/60 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#1C2840] hover:border-white/12 active:scale-98 transition duration-300">
                      <GoogleIcon className="h-4 w-4" /> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-[#1C2840]/60 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#1C2840] hover:border-white/12 active:scale-98 transition duration-300">
                      <Github className="h-4 w-4 text-white" /> GitHub
                    </button>
                  </div>

                  <div className="my-5 flex items-center gap-3 text-[9px] font-mono tracking-widest text-slate-550 uppercase select-none">
                    <div className="h-px flex-1 bg-white/5" />
                    <span>or register email</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Full name</label>
                      <input
                        type="text"
                        placeholder="Elena Marsh"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-3 text-sm text-white placeholder-slate-550 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Work email</label>
                      <input
                        type="email"
                        placeholder="elena@northwind.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-3 text-sm text-white placeholder-slate-555 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-3 text-sm text-white placeholder-slate-555 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                      />

                      {/* Password strength meter */}
                      {pw.length > 0 && (
                        <div className="mt-2.5">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                            <span>Strength</span>
                            <span style={{ color: strengthColor }} className="font-bold">{strengthLabel}</span>
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map(i => (
                              <div
                                key={i}
                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                style={{ background: i < strength ? strengthColor : "rgba(255,255,255,0.06)" }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Workspace Setup */}
              {step === 2 && (
                <div className="animate-fade-up">
                  <h2 className="mt-2 font-display text-3xl font-bold text-white">Setup your workspace.</h2>
                  <p className="mt-1 text-xs text-slate-400">Configure your target directory and team environment.</p>

                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Workspace name</label>
                      <input
                        type="text"
                        placeholder="Northwind HQ"
                        value={workspaceName}
                        onChange={handleWorkspaceNameChange}
                        className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-3 text-sm text-white placeholder-slate-555 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Workspace domain slug</label>
                      <div className="relative flex items-center">
                        <input
                           type="text"
                           placeholder="northwind-hq"
                           value={workspaceSlug}
                           onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""))}
                           className="w-full rounded-xl border border-white/8 bg-[#151F35] pl-4 pr-32 py-3 text-sm text-white placeholder-slate-555 focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                        />
                        <span className="absolute right-3 font-mono text-[9px] text-slate-500 uppercase tracking-widest font-semibold pointer-events-none select-none">
                          .competilens.com
                        </span>
                      </div>

                      {/* URL Preview */}
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <Globe className="h-3.5 w-3.5 text-[#5CA9FF]" />
                        <span>Live Preview: </span>
                        <span className="text-[#5CA9FF] font-semibold">
                          competilens.com/{workspaceSlug || "your-slug"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Your role / function</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-white/8 bg-[#151F35] px-4 py-3 text-sm text-white focus:border-[#726BFF]/50 focus:ring-2 focus:ring-[#726BFF]/10 focus:outline-none transition"
                      >
                        <option value="Strategy Lead">Head of Corporate Strategy</option>
                        <option value="Product Lead">Product Manager / Director</option>
                        <option value="Operator">Operations Analyst</option>
                        <option value="Executive">Founder / C-Level Executive</option>
                        <option value="Developer">Software Engineer / Dev</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Invite Team */}
              {step === 3 && (
                <div className="animate-fade-up">
                  <h2 className="mt-2 font-display text-3xl font-bold text-white">Invite strategy peers.</h2>
                  <p className="mt-1 text-xs text-slate-400">Share signal alerts and custom dossiers with teammates.</p>

                  <div className="space-y-3 mt-6">
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">Teammate emails (Optional)</label>

                    {invites.map((emailVal, idx) => (
                      <div key={idx} className="flex items-center gap-2 animate-fade-up">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input
                            type="email"
                            placeholder="peer@northwind.com"
                            value={emailVal}
                            onChange={(e) => handleInviteChange(idx, e.target.value)}
                            className="w-full rounded-xl border border-white/8 bg-[#151F35] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-555 focus:border-[#726BFF]/50 focus:ring-1 focus:ring-[#726BFF]/10 focus:outline-none transition"
                          />
                        </div>
                        {invites.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInviteField(idx)}
                            className="h-9 w-9 rounded-xl border border-white/8 hover:border-[#F36B73]/30 hover:bg-[#F36B73]/5 text-slate-400 hover:text-[#F36B73] flex items-center justify-center transition"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {invites.length < 5 && (
                      <button
                        type="button"
                        onClick={addInviteField}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 rounded-xl py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 hover:text-white hover:border-[#726BFF]/30 transition"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Another Invitee
                      </button>
                    )}

                    <div className="h-px bg-white/5 my-4" />

                    <label className="flex items-start gap-2.5 text-[11px] text-slate-400 leading-normal cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded-md border-white/8 bg-white/[0.02] text-[#726BFF] focus:ring-0 focus:ring-offset-0 accent-[#726BFF]/20"
                        defaultChecked
                      />
                      <span>
                        I accept the enterprise platform <a href="#" className="text-[#5CA9FF] hover:underline">Terms of Service</a> and <a href="#" className="text-[#5CA9FF] hover:underline">Privacy Charter</a>.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Dynamic Buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1 || loading}
                  className="text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-white transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  Previous
                </button>

                {step < 3 ? (
                  <GlowButton type="button" onClick={() => setStep(step + 1)} className="px-5 py-2.5">
                    Continue <ArrowRight className="h-4 w-4" />
                  </GlowButton>
                ) : (
                  <GlowButton type="button" onClick={handleSignup} disabled={loading} className="px-6 py-2.5">
                    {loading ? "Configuring..." : "Enter Workspace Console"} <ArrowRight className="h-4 w-4" />
                  </GlowButton>
                )}
              </div>

              {/* Already have an account prompt */}
              <div className="mt-8 text-center text-xs text-slate-500 border-t border-white/8 pt-6">
                Already have a workspace? <Link to="/login" className="text-[#5CA9FF] hover:underline font-semibold font-mono ml-1">Sign in</Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
