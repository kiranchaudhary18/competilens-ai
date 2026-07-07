import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bell, Globe, Info, Palette, User } from "lucide-react";
import { Panel } from "@/components/app/Panel";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — CompetiLens AI" }] }),
  component: SettingsPage,
});

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "language", label: "Language", icon: Globe },
  { id: "about", label: "About", icon: Info },
] as const;

function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("profile");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs text-primary uppercase tracking-[0.16em]">Settings</div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
          Workspace preferences
        </h1>
      </motion.div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <div className="rounded-2xl glass shadow-card p-2">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {tab === "profile" && (
            <Panel title="Profile" subtitle="How you appear in your workspace">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-primary grid place-items-center text-lg font-semibold text-primary-foreground">
                  AK
                </div>
                <div>
                  <div className="text-sm font-medium">Alex Kim</div>
                  <div className="text-xs text-muted-foreground">alex@competilens.ai</div>
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <Field label="Full name" defaultValue="Alex Kim" />
                <Field label="Job title" defaultValue="Head of Strategy" />
                <Field label="Email" defaultValue="alex@competilens.ai" />
                <Field label="Workspace" defaultValue="Acme Inc." />
              </div>
            </Panel>
          )}
          {tab === "appearance" && (
            <Panel title="Appearance" subtitle="Interface density and accents">
              <div className="grid sm:grid-cols-3 gap-3">
                {["Dark", "Midnight", "Contrast"].map((t) => (
                  <button
                    key={t}
                    className="rounded-xl border border-border bg-card/40 p-4 text-left hover:border-primary/60 transition"
                  >
                    <div className="h-16 rounded-lg bg-gradient-primary mb-3" />
                    <div className="text-sm font-medium">{t}</div>
                    <div className="text-xs text-muted-foreground">Recommended</div>
                  </button>
                ))}
              </div>
            </Panel>
          )}
          {tab === "notifications" && (
            <Panel title="Notifications" subtitle="What you want to hear about">
              {[
                "New competitor signal",
                "Weekly executive digest",
                "Report ready",
                "Pricing change detected",
                "Product launch detected",
              ].map((n) => (
                <Toggle key={n} label={n} />
              ))}
            </Panel>
          )}
          {tab === "language" && (
            <Panel title="Language & region" subtitle="Localize your reports and UI">
              <div className="grid sm:grid-cols-2 gap-3">
                <Select
                  label="Language"
                  options={[
                    "English (US)",
                    "English (UK)",
                    "German",
                    "French",
                    "Spanish",
                    "Japanese",
                  ]}
                />
                <Select label="Timezone" options={["UTC", "PST", "EST", "CET", "JST"]} />
                <Select label="Currency" options={["USD", "EUR", "GBP", "JPY"]} />
                <Select label="Date format" options={["MMM D, YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]} />
              </div>
            </Panel>
          )}
          {tab === "about" && (
            <Panel title="About" subtitle="Your CompetiLens instance">
              <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                <Meta k="Version" v="3.14.0" />
                <Meta k="Model" v="GPT-4o + Claude 3.5" />
                <Meta k="Region" v="us-east" />
                <Meta k="Plan" v="Team · Annual" />
              </dl>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        defaultValue={defaultValue}
        className="mt-1 w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/60"
      />
    </label>
  );
}
function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select className="mt-1 w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm focus:outline-none focus:border-primary/60">
        {options.map((o) => (
          <option key={o} className="bg-surface">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
function Toggle({ label }: { label: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="text-sm">{label}</div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-10 h-6 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${on ? "left-[18px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{k}</div>
      <div className="mt-1 font-medium">{v}</div>
    </div>
  );
}
