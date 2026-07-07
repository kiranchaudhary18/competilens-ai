import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  User,
  Settings,
  Globe,
  Shield,
  Bell,
  Eye,
  Brain,
  Grid,
  Key,
  CreditCard,
  Users,
  Info,
  Upload,
  RefreshCw,
  Smartphone,
  Lock,
  PlusCircle,
  Play,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — CompetiLens AI" }] }),
  component: SettingsPage,
});

type SettingsTab =
  | "general"
  | "profile"
  | "workspace"
  | "security"
  | "notifications"
  | "appearance"
  | "ai_agents"
  | "integrations"
  | "api_keys"
  | "billing"
  | "team"
  | "language"
  | "about";

interface TabItem {
  id: SettingsTab;
  label: string;
  desc: string;
  icon: any;
}

const leftMenuTabs: TabItem[] = [
  { id: "general", label: "General", desc: "Global workspace configuration", icon: Settings },
  { id: "profile", label: "Profile", desc: "Manage your personal profile details", icon: User },
  { id: "workspace", label: "Workspace", desc: "URLs, region and metadata settings", icon: Globe },
  { id: "security", label: "Security", desc: "Password, 2FA and active logs", icon: Shield },
  { id: "notifications", label: "Notifications", desc: "Manage alerts, Slack and reports", icon: Bell },
  { id: "appearance", label: "Appearance", desc: "Themes, layout modes and styling", icon: Eye },
  { id: "ai_agents", label: "AI Agents", desc: "Manage background crawling agents", icon: Brain },
  { id: "integrations", label: "Integrations", desc: "Connect Slack, Teams and Jira", icon: Grid },
  { id: "api_keys", label: "API Keys", desc: "Secret tokens for external requests", icon: Key },
  { id: "billing", label: "Billing", desc: "Subscription invoices and plan usage", icon: CreditCard },
  { id: "team", label: "Team Members", desc: "Invite, update roles and access rules", icon: Users },
  { id: "language", label: "Language", desc: "Localize times, dates and interface", icon: Globe },
  { id: "about", label: "About", desc: "System details and updates feed", icon: Info },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [isDirty, setIsDirty] = useState(false);

  // Form states to mock modification
  const [profileName, setProfileName] = useState("Alex Kim");
  const [profileEmail, setProfileEmail] = useState("alex@competilens.ai");
  const [wsName, setWsName] = useState("Acme Corp");
  const [wsUrl, setWsUrl] = useState("https://competilens.ai/acme");
  
  // Toggles for notifications
  const [notifs, setNotifs] = useState({
    threatAlerts: true,
    pricingAlerts: true,
    hiringAlerts: true,
    fundingAlerts: false,
    newsAlerts: true,
    slackNotifs: true,
    emailReports: true,
    weeklySummary: true,
  });

  const handleInputChange = () => {
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setProfileName("Alex Kim");
    setProfileEmail("alex@competilens.ai");
    setWsName("Acme Corp");
    setWsUrl("https://competilens.ai/acme");
    setIsDirty(false);
  };

  return (
    <div className="space-y-8 max-w-[1320px] mx-auto text-[#0F172A] font-sans pb-24 relative">
      
      {/* 1. TOP TITLE SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-full border border-[#2563EB]/15">
            Settings
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Workspace Settings
          </h1>
          <p className="text-sm font-semibold text-[#64748B] leading-relaxed">
            Manage your workspace, security, AI agents, and organization preferences.
          </p>
        </div>

        {/* Workspace Overview Card */}
        <div className="w-full sm:w-[480px] rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm shrink-0 grid grid-cols-3 gap-4">
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Plan Tier</span>
            <div className="text-xs.5 font-extrabold text-[#2563EB] mt-0.5">Enterprise</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Organization</span>
            <div className="text-xs.5 font-extrabold text-[#0F172A] mt-0.5">Active</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Members</span>
            <div className="text-xs.5 font-extrabold text-[#0F172A] mt-0.5">12 Users</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Tracked Companies</span>
            <div className="text-xs.5 font-extrabold text-[#0F172A] mt-0.5">24</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">AI Agents</span>
            <div className="text-xs.5 font-extrabold text-[#10B981] mt-0.5">6 Running</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">API Requests</span>
            <div className="text-xs.5 font-extrabold text-[#0F172A] mt-0.5">2.1M</div>
          </div>
        </div>
      </div>

      {/* 2. TWO COLUMN WORKSPACE LAYOUT */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
        
        {/* LEFT COLUMN: NAVIGATION */}
        <aside className="space-y-1 bg-white border border-[#E2E8F0] rounded-3xl p-3.5 shadow-sm">
          {leftMenuTabs.map((tab) => {
            const active = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition duration-200 select-none cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-[#2563EB]/5 to-[#06B6D4]/5 border-l-3 border-[#2563EB] text-[#2563EB]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50/70 border-l-3 border-transparent"
                }`}
              >
                <TabIcon className={`w-4 h-4 shrink-0 ${active ? "text-[#2563EB]" : "text-[#64748B]"}`} />
                <div className="leading-tight">
                  <div className="text-xs.5 font-bold">{tab.label}</div>
                  <div className="text-[9.5px] font-semibold text-[#64748B] mt-0.5 line-clamp-1">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* RIGHT COLUMN: CONTENT */}
        <main className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* GENERAL TAB */}
              {activeTab === "general" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">General Workspace Options</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Configure global details and identity properties.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Organization ID</label>
                      <input
                        type="text"
                        defaultValue="org_acme_7f920x"
                        disabled
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-slate-50 text-xs.5 font-semibold text-[#64748B] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Default Project Type</label>
                      <select
                        onChange={handleInputChange}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                      >
                        <option>SaaS Competitors</option>
                        <option>E-commerce Shops</option>
                        <option>Agency Competitors</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Profile details</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Manage how you appear in your team workspaces.</p>
                  </div>

                  <div className="flex items-center gap-4 border-b border-[#E2E8F0] pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-lg font-extrabold text-white shadow-sm">
                      AK
                    </div>
                    <button className="h-9 px-4.5 rounded-xl border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition cursor-pointer flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Avatar</span>
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => {
                          setProfileName(e.target.value);
                          handleInputChange();
                        }}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => {
                          setProfileEmail(e.target.value);
                          handleInputChange();
                        }}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Phone Number</label>
                      <input
                        type="text"
                        defaultValue="+1 (555) 019-2834"
                        onChange={handleInputChange}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Workspace Role</label>
                      <input
                        type="text"
                        defaultValue="Administrator"
                        disabled
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-slate-50 text-xs.5 font-semibold text-[#64748B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* WORKSPACE TAB */}
              {activeTab === "workspace" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Workspace Identity</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Configure company URL directories and region nodes.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Workspace Name</label>
                      <input
                        type="text"
                        value={wsName}
                        onChange={(e) => {
                          setWsName(e.target.value);
                          handleInputChange();
                        }}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Workspace directory URL</label>
                      <input
                        type="text"
                        value={wsUrl}
                        onChange={(e) => {
                          setWsUrl(e.target.value);
                          handleInputChange();
                        }}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Change Password</h3>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">Keep credentials secure.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <input type="password" placeholder="Current password" onChange={handleInputChange} className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15" />
                      <input type="password" placeholder="New password" onChange={handleInputChange} className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15" />
                      <input type="password" placeholder="Confirm password" onChange={handleInputChange} className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="text-xs.5 font-extrabold text-[#0F172A] uppercase tracking-wider">Two-factor Authentication (2FA)</h4>
                      <p className="text-[11px] text-[#64748B] font-semibold mt-1">Add an extra layer of protection to your account profile.</p>
                    </div>
                    <button className="h-9 px-4 rounded-xl bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition cursor-pointer shadow-sm">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Notification Preferences</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Set up automated reporting channels.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: "threatAlerts", label: "AI Threat Alerts", desc: "Real-time notice when risk is high" },
                      { key: "pricingAlerts", label: "Pricing Shift Alerts", desc: "Notify when price structure updates" },
                      { key: "hiringAlerts", label: "Hiring Alerts", desc: "Notify of key executive movements" },
                      { key: "slackNotifs", label: "Slack Sync Integrations", desc: "Forward summaries to workspace channels" },
                    ].map((item) => (
                      <div key={item.key} className="p-4 rounded-2xl border border-[#E2E8F0] bg-slate-50/30 flex items-center justify-between">
                        <div>
                          <span className="text-xs.5 font-extrabold text-[#0F172A]">{item.label}</span>
                          <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setNotifs((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof prev]
                            }));
                            handleInputChange();
                          }}
                          className={`relative w-10 h-6 rounded-full transition duration-200 cursor-pointer shrink-0 ${
                            notifs[item.key as keyof typeof notifs] ? "bg-[#2563EB]" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                            notifs[item.key as keyof typeof notifs] ? "left-[17px]" : "left-0.5"
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* APPEARANCE TAB */}
              {activeTab === "appearance" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Appearance Interface Theme</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Select your client display preferences.</p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { name: "Brand Light", desc: "Default light theme", active: true },
                      { name: "Midnight Glow", desc: "Developer dark overlay", active: false },
                      { name: "Contrast Clean", desc: "High accessibility", active: false },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        onClick={handleInputChange}
                        className={`rounded-2xl border p-4 text-left cursor-pointer transition-all duration-200 ${
                          theme.active ? "border-[#2563EB] ring-4 ring-blue-50/50 bg-[#2563EB]/5" : "border-[#E2E8F0] hover:border-slate-350"
                        }`}
                      >
                        <div className="h-16 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] mb-3" />
                        <span className="text-xs.5 font-bold text-[#0F172A] block">{theme.name}</span>
                        <span className="text-[10px] text-[#64748B] font-semibold block mt-0.5">{theme.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI AGENTS TAB */}
              {activeTab === "ai_agents" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">AI Crawling Agent Status</h3>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">Manage active background crawlers.</p>
                    </div>
                    <span className="text-[10px] text-[#10B981] font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-250">6 Running</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: "Research Agent", desc: "Filings and public brief audits", sync: "2m ago" },
                      { name: "Website Agent", desc: "Crawl pricing grids and layouts", sync: "5m ago" },
                      { name: "News Agent", desc: "Scan 8,000+ online press hubs", sync: "1d ago" },
                      { name: "Review Agent", desc: "Extract competitor customer feedback", sync: "2h ago" },
                    ].map((agent) => (
                      <div key={agent.name} className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm flex flex-col justify-between gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs.5 font-extrabold text-[#0F172A] block">{agent.name}</span>
                            <span className="text-[10px] text-[#64748B] font-semibold block mt-0.5">{agent.desc}</span>
                          </div>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-[#10B981] font-bold border border-emerald-100">Running</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                          <span className="text-[10px] text-[#64748B] font-bold">SYNCED: {agent.sync}</span>
                          <button className="h-7 px-3.5 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#2563EB]/5 text-[10px] font-extrabold text-[#64748B] hover:text-[#2563EB] transition cursor-pointer flex items-center gap-1 shadow-sm">
                            <RefreshCw className="w-3 h-3" />
                            <span>Restart</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INTEGRATIONS TAB */}
              {activeTab === "integrations" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Workspace Integrations</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Connect your dashboard to external tools.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: "Slack Linker", status: "Connected", action: "Manage" },
                      { name: "Discord Alert Hook", status: "Disconnected", action: "Connect" },
                      { name: "Teams Channel Pipe", status: "Disconnected", action: "Connect" },
                      { name: "Notion Knowledge base", status: "Connected", action: "Manage" },
                    ].map((item) => (
                      <div key={item.name} className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm flex items-center justify-between">
                        <div>
                          <span className="text-xs.5 font-extrabold text-[#0F172A]">{item.name}</span>
                          <span className={`text-[10px] block mt-0.5 font-bold ${
                            item.status === "Connected" ? "text-[#10B981]" : "text-[#64748B]"
                          }`}>{item.status}</span>
                        </div>
                        <button className="h-8.5 px-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#2563EB]/5 text-xs font-bold text-[#64748B] hover:text-[#2563EB] transition cursor-pointer shadow-sm">
                          {item.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* API KEYS TAB */}
              {activeTab === "api_keys" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Secret API Tokens</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Use these keys to access REST endpoint data.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value="competilens_sk_test_51O7f2026x92l0192834019x1"
                        disabled
                        className="flex-1 h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-slate-50 text-xs font-semibold text-[#64748B] focus:outline-none"
                      />
                      <button className="h-10 px-4 rounded-xl border border-[#E2E8F0] bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition cursor-pointer flex items-center gap-1.5 shadow-sm">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                    <div className="p-4.5 rounded-2xl bg-amber-50/30 border border-amber-200/50 text-[11px] font-semibold text-[#64748B] leading-relaxed">
                      Please treat secret API keys with absolute caution. Do not push raw key environments directly into public client source controllers.
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#2563EB] tracking-wider block">Current Plan</span>
                      <h3 className="text-lg font-extrabold text-[#0F172A] mt-1">Enterprise Subscription</h3>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">Renews automatically on August 2027.</p>
                    </div>
                    <button className="h-10 px-5.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer">
                      Manage billing
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-3.5">
                      <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider block">Competitor Monitor limits</span>
                      <div className="flex justify-between items-end">
                        <span className="text-xl font-extrabold text-[#0F172A]">24 / 50</span>
                        <span className="text-xs font-semibold text-[#64748B]">48% used</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2563EB] h-full rounded-full" style={{ width: "48%" }} />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm space-y-3.5">
                      <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider block">Monthly API Credits Usage</span>
                      <div className="flex justify-between items-end">
                        <span className="text-xl font-extrabold text-[#0F172A]">2.1M / 5.0M</span>
                        <span className="text-xs font-semibold text-[#64748B]">42% used</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#06B6D4] h-full rounded-full" style={{ width: "42%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TEAM MEMBERS TAB */}
              {activeTab === "team" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Organization Members</h3>
                      <p className="text-xs text-[#64748B] font-semibold mt-1">Add colleagues to coordinate competitor briefings.</p>
                    </div>
                    <button className="h-9 px-4 rounded-xl border border-[#E2E8F0] hover:border-[#2563EB]/40 hover:bg-slate-50 text-xs font-bold text-[#64748B] hover:text-[#2563EB] transition cursor-pointer flex items-center gap-1.5 shadow-sm">
                      <PlusCircle className="w-4 h-4" />
                      <span>Invite</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {[
                      { name: "Alex Kim", email: "alex@competilens.ai", role: "Owner" },
                      { name: "Jordan Smith", email: "jordan@competilens.ai", role: "Admin" },
                      { name: "Sarah Lee", email: "sarah@competilens.ai", role: "Editor" },
                    ].map((user) => (
                      <div key={user.email} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                        <div>
                          <span className="text-xs.5 font-bold text-[#0F172A] block">{user.name}</span>
                          <span className="text-[10px] text-[#64748B] font-semibold block mt-0.5">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-[#64748B] bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-lg">{user.role}</span>
                          {user.role !== "Owner" && (
                            <button className="text-xs font-bold text-red-650 hover:underline cursor-pointer">Remove</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LANGUAGE TAB */}
              {activeTab === "language" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">Language & Region localization</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Localize metrics, date formatting and interface languages.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Interface Language</label>
                      <select onChange={handleInputChange} className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-bold text-[#0F172A] focus:outline-none">
                        <option>English (US)</option>
                        <option>Deutsch</option>
                        <option>Español</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-[#64748B]">Default Currency</label>
                      <select onChange={handleInputChange} className="w-full h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs.5 font-bold text-[#0F172A] focus:outline-none">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === "about" && (
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F172A]">About CompetiLens</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Platform environment versioning and build hashes.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-bold">
                    <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/20">
                      <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider block">Instance version</span>
                      <span className="text-xs.5 text-[#0F172A] block mt-1">v3.14.0 Enterprise</span>
                    </div>
                    <div className="p-4.5 rounded-2xl border border-slate-100 bg-slate-50/20">
                      <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider block">AI Inference Models</span>
                      <span className="text-xs.5 text-[#0F172A] block mt-1">GPT-4o + Claude 3.5 Sonnet</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* 3. FLOATING SAVE CHANGES BAR */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-55 w-[90%] max-w-[560px]"
          >
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-lg flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-[#0F172A] block">Unsaved changes</span>
                <span className="text-[10px] text-[#64748B] font-semibold block mt-0.5">Please save your profile changes.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDiscard}
                  className="h-9 px-4.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="h-9 px-4.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
