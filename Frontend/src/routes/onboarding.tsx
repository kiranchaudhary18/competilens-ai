import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Building2, Globe, Sparkles, Plus, Check, Bell, Mail, Slack, Webhook, ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Onboarding — CompetiLens AI" }],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Step 1: Company Profile
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  // Step 2: Competitors
  const defaultCompetitors = [
    { id: "linear", name: "Linear", domain: "linear.app", selected: false },
    { id: "notion", name: "Notion", domain: "notion.so", selected: false },
    { id: "vercel", name: "Vercel", domain: "vercel.com", selected: false },
    { id: "stripe", name: "Stripe", domain: "stripe.com", selected: false },
    { id: "openai", name: "OpenAI", domain: "openai.com", selected: false },
    { id: "figma", name: "Figma", domain: "figma.com", selected: false },
  ];
  const [competitors, setCompetitors] = useState(defaultCompetitors);
  const [newCompetitor, setNewCompetitor] = useState("");

  // Step 3: Notifications
  const [notifySlack, setNotifySlack] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWebhook, setNotifyWebhook] = useState(false);

  // Step 4: Loading State
  const [deploying, setDeploying] = useState(false);

  const addCompetitor = () => {
    if (!newCompetitor) return;
    const cleanDomain = newCompetitor.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    const name = cleanDomain.split(".")[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    setCompetitors([
      ...competitors,
      { id: name, name: formattedName, domain: cleanDomain, selected: true }
    ]);
    setNewCompetitor("");
  };

  const toggleCompetitor = (id: string) => {
    setCompetitors(competitors.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    setDeploying(true);
    // Simulate agent deployment sequence
    setTimeout(() => {
      setDeploying(false);
      navigate({ to: "/dashboard" });
    }, 3000);
  };

  const progressPct = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground font-sans relative overflow-hidden">
      {/* Background glow lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[580px] space-y-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">CompetiLens AI</span>
          </Link>

          {/* Step Progress bar */}
          <div className="w-full max-w-[320px] space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
              <span>Step {step} of 4</span>
              <span>{Math.round(progressPct)}% Complete</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-primary"
              />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-8 rounded-[28px] border border-border bg-card shadow-card glass relative overflow-hidden min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Tell us about your Company</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Help your AI agents understand your own positioning and target market.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                      <input
                        type="text"
                        placeholder="e.g. Stripe"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Industry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Fintech"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Website Domain
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                        <input
                          type="text"
                          placeholder="company.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Select Competitors to track</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select who you want to monitor, or add your own custom competitor domain below.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Select grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {competitors.slice(0, 6).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCompetitor(c.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition select-none ${
                          c.selected
                            ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                            : "border-border bg-background/50 hover:bg-accent/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{c.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{c.domain}</div>
                        </div>
                        {c.selected && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0 ml-2">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Add domain input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                      <input
                        type="text"
                        placeholder="Add custom competitor domain (e.g. competitor.com)"
                        value={newCompetitor}
                        onChange={(e) => setNewCompetitor(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCompetitor}
                      className="h-11 px-4 rounded-xl border border-border bg-background hover:bg-accent/40 transition flex items-center justify-center text-sm font-medium"
                    >
                      <Plus className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose how you want to receive autonomous competitor insights and threat warnings.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "slack",
                      title: "Slack Workspace Integration",
                      desc: "Instantly post signals into a chosen slack channel.",
                      icon: Slack,
                      state: notifySlack,
                      setter: setNotifySlack,
                    },
                    {
                      id: "email",
                      title: "Weekly Email Digest",
                      desc: "Executive summaries and threat score updates sent directly to your inbox.",
                      icon: Mail,
                      state: notifyEmail,
                      setter: setNotifyEmail,
                    },
                    {
                      id: "webhook",
                      title: "Webhook Realtime Event Stream",
                      desc: "Send JSON payloads to your servers whenever changes are classified.",
                      icon: Webhook,
                      state: notifyWebhook,
                      setter: setNotifyWebhook,
                    },
                  ].map((notif) => (
                    <button
                      key={notif.id}
                      type="button"
                      onClick={() => notif.setter(!notif.state)}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition select-none ${
                        notif.state
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background/50 hover:bg-accent/40"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <notif.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{notif.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 leading-normal">
                          {notif.desc}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 mt-1 ${
                          notif.state ? "bg-primary border-primary text-white" : "border-border bg-card"
                        }`}
                      >
                        {notif.state && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex flex-col justify-between flex-1 py-4"
              >
                {!deploying ? (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-glow">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Ready to Deploy Agents?</h2>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-normal">
                        Your workspace is configured. Clicking next will initialize and deploy your 6 autonomous agents to index and monitor selected competitors.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-8 py-6">
                    <div className="relative w-20 h-20 mx-auto">
                      {/* Rotating ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <div className="absolute inset-2 rounded-full border-4 border-secondary/15 border-b-secondary animate-[spin_2s_linear_infinite_reverse]" />
                      <div className="absolute inset-4 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                        <Zap className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-bold">Deploying Autonomous Agents...</h3>
                      <div className="max-w-[280px] mx-auto text-xs text-muted-foreground space-y-1">
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                          • Spawning Research Agent
                        </motion.div>
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>
                          • Indexing competitor changelogs
                        </motion.div>
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>
                          • Creating target analysis profiles
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {!deploying && (
            <div className="flex items-center justify-between border-t border-border/80 pt-6 mt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-background hover:bg-accent/40 font-semibold text-sm transition disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition duration-200"
              >
                {step === 4 ? "Deploy Agents" : "Continue"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
