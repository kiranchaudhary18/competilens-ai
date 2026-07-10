import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { GlassCard, Eyebrow } from "@/components/app/ui";
import { User, Building2, Sparkles, Bell, Puzzle, Key, ShieldCheck, CreditCard, Palette } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — CompetiLens AI" }] }),
  component: Settings,
});

const nav = [
  { id: "identity", label: "Identity", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "intel", label: "Intelligence", icon: Sparkles },
  { id: "notif", label: "Notifications", icon: Bell },
  { id: "integ", label: "Integrations", icon: Puzzle },
  { id: "api", label: "API access", icon: Key },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function Settings() {
  const [tab, setTab] = useState("identity");
  return (
    <AppShell crumb="SETTINGS">
      <div className="mb-8">
        <Eyebrow>Control Room</Eyebrow>
        <h1 className="mt-3 font-display text-5xl">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <GlassCard className="p-3 h-fit">
          <nav className="space-y-1">
            {nav.map(n => {
              const active = tab === n.id;
              return (
                <button key={n.id} onClick={() => setTab(n.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition ${active ? "bg-[#00D4FF]/10 text-[#7DD3FC]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </button>
              );
            })}
          </nav>
        </GlassCard>

        <GlassCard className="p-8">
          {tab === "identity" && <Identity />}
          {tab === "workspace" && <Workspace />}
          {tab === "intel" && <Section title="Intelligence" desc="Tune how your agents work." />}
          {tab === "notif" && <Notifications />}
          {tab === "integ" && <Integrations />}
          {tab === "api" && <Section title="API Access" desc="Programmatic access to your workspace." />}
          {tab === "security" && <Section title="Security" desc="SSO, MFA, session controls." />}
          {tab === "billing" && <Section title="Billing" desc="Plan, invoices, seat management." />}
          {tab === "appearance" && <Section title="Appearance" desc="Theme, density, motion." />}
        </GlassCard>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
        <div className="mt-1">{value}</div>
      </div>
      <button className="text-xs text-[#7DD3FC] hover:underline">Edit</button>
    </div>
  );
}

function Section({ title, desc }: any) {
  return (
    <>
      <Eyebrow>{title}</Eyebrow>
      <p className="mt-2 text-sm text-slate-400">{desc}</p>
      <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-500">
        Configure {title.toLowerCase()} preferences here.
      </div>
    </>
  );
}

function Identity() {
  return (
    <>
      <Eyebrow>Identity</Eyebrow>
      <p className="mt-2 text-sm text-slate-400">Your account and how you appear across the system.</p>
      <div className="mt-6 space-y-3">
        <Row label="Name" value="Narvin Ambekar" />
        <Row label="Email" value="narvin@lattice.io" />
        <Row label="Role" value="Head of Product Strategy" />
      </div>
    </>
  );
}
function Workspace() {
  return (
    <>
      <Eyebrow>Workspace</Eyebrow>
      <p className="mt-2 text-sm text-slate-400">Your team's shared intelligence field.</p>
      <div className="mt-6 space-y-3">
        <Row label="Workspace" value="Lattice HQ" />
        <Row label="Members" value="12 people · 3 admins" />
        <Row label="Region" value="US-East (Virginia)" />
      </div>
    </>
  );
}
function Notifications() {
  const items = [
    { l: "Critical signals", d: "Push, email, Slack" },
    { l: "New reports ready", d: "Email" },
    { l: "Daily brief", d: "Email — 8:00 AM local" },
    { l: "Investigation complete", d: "Push" },
  ];
  return (
    <>
      <Eyebrow>Notifications</Eyebrow>
      <p className="mt-2 text-sm text-slate-400">Choose what reaches you.</p>
      <div className="mt-6 space-y-3">
        {items.map(i => (
          <div key={i.l} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div>
              <div>{i.l}</div>
              <div className="text-xs text-slate-500">{i.d}</div>
            </div>
            <label className="relative inline-flex h-6 w-11 items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <span className="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-gradient-to-r peer-checked:from-[#4F8CFF] peer-checked:to-[#00D4FF]"></span>
              <span className="absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></span>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
function Integrations() {
  const items = [
    { n: "Slack", d: "Post critical signals to channels", ok: true },
    { n: "Notion", d: "Sync briefs into workspace", ok: true },
    { n: "Linear", d: "Create issues from investigations", ok: false },
    { n: "Salesforce", d: "Enrich accounts with intel", ok: false },
    { n: "Snowflake", d: "Warehouse export", ok: false },
    { n: "HubSpot", d: "Trigger sequences from alerts", ok: false },
  ];
  return (
    <>
      <Eyebrow>Integrations</Eyebrow>
      <p className="mt-2 text-sm text-slate-400">Wire CompetiLens into your stack.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map(i => (
          <div key={i.n} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 font-mono text-xs">{i.n.slice(0, 2)}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm">{i.n}</div>
              <div className="text-xs text-slate-500 truncate">{i.d}</div>
            </div>
            <button className={`rounded-full px-3 py-1.5 text-xs ${i.ok ? "bg-emerald-500/15 text-emerald-300" : "border border-white/10 text-slate-300"}`}>
              {i.ok ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
