import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Globe, Sparkles, Zap, Search, Plus, Compass, Settings2, Paperclip, ChevronDown, RefreshCw } from "lucide-react";
import { useAuth } from "../components/AuthContext";

export const Route = createFileRoute("/_app/analysis")({
  head: () => ({ meta: [{ title: "New Analysis — CompetiLens AI" }] }),
  component: NewAnalysis,
});

function NewAnalysis() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focusType, setFocusType] = useState("All sources");
  const [showFocusDropdown, setShowFocusDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const start = async (target: string) => {
    if (!target || !accessToken) return;

    try {
      setIsSubmitting(true);

      // Clean the target to extract domain name and name
      let domain = target.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].toLowerCase();
      if (!domain.includes(".")) {
        domain = `${domain}.com`;
      }
      
      const nameParts = domain.split(".")[0];
      const name = nameParts.charAt(0).toUpperCase() + nameParts.slice(1);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-workspace-id": user?.workspaceId || "",
      };

      const res = await fetch("http://localhost:5000/competitors", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          domain,
          website: `https://${domain}`,
          industry: "Technology",
        }),
      });

      const json = await res.json();
      if (json.success) {
        const compId = json.data.competitor.id;
        navigate({
          to: "/analyzing",
          search: { id: compId },
        });
      } else {
        alert(json.message || "Failed to create competitor profile");
      }
    } catch (err) {
      console.error("Failed to start analysis:", err);
      alert("Error starting competitor analysis. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
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
                <div className="absolute top-10 left-0 w-48 rounded-2xl border border-border bg-card shadow-lg p-1.5 z-20 space-y-0.5">
                  {["All sources", "Website crawling", "Job boards", "Social & News"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFocusType(type);
                        setShowFocusDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-muted transition"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Right */}
            <button
              onClick={() => start(q)}
              disabled={isSubmitting || !q.trim()}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-primary text-primary-foreground text-[14px] font-bold shadow-glow hover:opacity-95 disabled:opacity-55 active:scale-[0.98] transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span>Deploy agents</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Suggested suggestions */}
      <div className="space-y-4">
        <h3 className="text-xs.5 font-bold tracking-wider text-muted-foreground uppercase text-center">
          Or start research with
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {suggestions.map((s, idx) => (
            <motion.button
              key={s.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setQ(s.domain);
                start(s.domain);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{s.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
