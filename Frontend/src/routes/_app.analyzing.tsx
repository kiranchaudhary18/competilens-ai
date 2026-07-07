import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { agents } from "@/data/mock";

export const Route = createFileRoute("/_app/analyzing")({
  head: () => ({ meta: [{ title: "Generating intelligence — CompetiLens AI" }] }),
  component: LoadingScreen,
});

function LoadingScreen() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState<number[]>(agents.map(() => 0));

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((prev) => {
        const next = [...prev];
        for (let i = 0; i < next.length; i++) {
          if (i > step) break;
          if (next[i] < 100) {
            next[i] = Math.min(100, next[i] + (i === step ? 6 : 3));
          }
        }
        return next;
      });
    }, 90);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (progress[step] >= 100 && step < agents.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), 250);
      return () => clearTimeout(t);
    }
    if (step === agents.length - 1 && progress[step] >= 100) {
      const t = setTimeout(() => nav({ to: "/reports/$id", params: { id: "linear" } }), 800);
      return () => clearTimeout(t);
    }
  }, [progress, step, nav]);

  const overall = Math.round(progress.reduce((a, b) => a + b, 0) / agents.length);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-10">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Generating Business
          Intelligence...
        </div>
        <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight">
          Six agents are on it.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We're crawling the web, reasoning across sources and drafting your executive report.
        </p>

        <div className="mt-8">
          <div className="text-6xl font-semibold tracking-tight text-gradient tabular-nums">
            {overall}%
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: `${overall}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      <div className="relative mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl w-full">
        {agents.map((a, i) => {
          const p = progress[i];
          const done = p >= 100;
          const active = i === step && !done;
          const Icon = a.icon;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border p-4 backdrop-blur-xl transition-all ${
                active
                  ? "border-primary/60 bg-card/80 shadow-glow"
                  : done
                    ? "border-success/40 bg-card/50"
                    : "border-border bg-card/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl grid place-items-center"
                  style={{ background: `color-mix(in oklab, ${a.color} 15%, transparent)` }}
                >
                  <Icon className="w-5 h-5" style={{ color: a.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {a.name}
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    ) : active ? (
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{a.role}</div>
                </div>
                <div className="text-xs tabular-nums text-muted-foreground">{Math.round(p)}%</div>
              </div>
              <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ background: a.color }}
                  animate={{ width: `${p}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
