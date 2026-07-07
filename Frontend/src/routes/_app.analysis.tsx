import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Globe, Sparkles, Zap, Search, Plus, Compass, Settings2, Paperclip, ChevronDown } from "lucide-react";
import { competitors } from "@/data/mock";

export const Route = createFileRoute("/_app/analysis")({
  head: () => ({ meta: [{ title: "New Analysis — CompetiLens AI" }] }),
  component: NewAnalysis,
});

function NewAnalysis() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focusType, setFocusType] = useState("All sources");
  const [showFocusDropdown, setShowFocusDropdown] = useState(false);

  const start = (target: string) => {
    if (!target) return;
    navigate({ to: "/analyzing" });
  };

  const suggestions = [
    { name: "Linear", domain: "linear.app" },
    { name: "Notion", domain: "notion.so" },
    { name: "Vercel", domain: "vercel.com" },
    { name: "Stripe", domain: "stripe.com" },
    { name: "OpenAI", domain: "openai.com" },
    { name: "Figma", domain: "figma.com" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Perplexity Center Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Competitive Engine v2.0
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl font-extrabold tracking-tight text-slate-900"
        >
          Where should we focus?
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-muted-foreground"
        >
          Paste any competitor domain name, pricing URL, or public website to deploy six specialized research agents instantly.
        </motion.p>
      </div>

      {/* ChatGPT/Perplexity Style Large Input Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative"
      >
        <div className="p-4 sm:p-5 rounded-[28px] border border-border bg-card shadow-card glass relative overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300">
          <div className="flex items-start gap-3">
            <Search className="w-5 h-5 text-muted-foreground mt-2 shrink-0" />
            <textarea
              rows={2}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Paste competitor URL or type company name... (e.g. vercel.com or Stripe)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (q.trim()) start(q.trim());
                }
              }}
              className="w-full text-[15px] bg-transparent border-0 placeholder:text-muted-foreground/80 focus:outline-none focus:ring-0 resize-none h-14"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-3 flex-wrap gap-2.5">
            {/* Options Left */}
            <div className="flex items-center gap-2 relative">
              <button
                type="button"
                onClick={() => setShowFocusDropdown(!showFocusDropdown)}
                className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none"
              >
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span>{focusType}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showFocusDropdown && (
                <div className="absolute top-10 left-0 w-44 rounded-xl border border-border bg-card shadow-card p-1.5 z-10 glass">
                  {["All sources", "Website focus", "News & PR focus", "Reviews focus"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFocusType(opt);
                        setShowFocusDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-accent/40 text-muted-foreground hover:text-foreground transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Attach URL</span>
              </button>
            </div>

            {/* Submit Button Right */}
            <button
              onClick={() => q.trim() && start(q.trim())}
              disabled={!q.trim()}
              className="inline-flex items-center justify-center gap-2 h-9 px-4.5 rounded-xl bg-gradient-primary text-primary-foreground text-xs.5 font-bold shadow-glow hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Analyze <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Suggested competitor pills */}
      <div className="space-y-3.5 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Competitors</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {suggestions.map((item) => (
            <button
              key={item.name}
              onClick={() => start(item.name)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card/45 hover:bg-card hover:border-primary/45 transition duration-250 text-xs.5 font-semibold text-muted-foreground hover:text-foreground"
            >
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Analyses list */}
      <div className="space-y-4">
        <div>
          <h2 className="text-md font-bold tracking-tight">Recent Analyses</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Quickly view or re-run recent competitor reports.</p>
        </div>

        <div className="rounded-[24px] border border-border bg-card shadow-card overflow-hidden divide-y divide-border">
          {competitors.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-4 hover:bg-accent/25 transition duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center text-sm font-bold text-primary-foreground shrink-0 shadow-glow select-none">
                  {c.logo}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold tracking-tight">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.domain} · last run {c.lastAnalyzed}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => start(c.name)}
                  className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border bg-background hover:bg-accent/40 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  Re-run
                </button>
                <button
                  onClick={() => navigate({ to: "/reports/$id", params: { id: c.id } })}
                  className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 text-xs font-semibold transition cursor-pointer"
                >
                  View Report <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center inline-flex items-center gap-1.5 justify-center w-full mt-4">
        <Zap className="w-3 h-3 text-primary animate-pulse" /> Each analysis process uses approximately 120 AI credits.
      </div>
    </div>
  );
}
