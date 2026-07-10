export type Threat = "critical" | "high" | "medium" | "low";
export type SignalType = "pricing" | "product" | "marketing" | "reviews" | "hiring" | "partnership" | "news";

export const competitors = [
  {
    id: "acme", code: "AC", name: "Acme", domain: "acme.io",
    threat: 87, threatLevel: "critical" as Threat, activity: 92,
    region: "North America", tint: "#EF4444",
    summary: "Category-defining incumbent. Rapid enterprise expansion, aggressive pricing posture, and a widening product surface.",
    last: "Reduced Pro pricing by 18%",
    x: 50, y: 25, size: 96,
  },
  {
    id: "vertex", code: "VX", name: "Vertex", domain: "vertex.ai",
    threat: 71, threatLevel: "high" as Threat, activity: 78,
    region: "Europe", tint: "#00D4FF",
    summary: "Fast-moving European challenger. Ships weekly, strong developer following, weaker on enterprise motion.",
    last: "Launched AI Search",
    x: 78, y: 65, size: 80,
  },
  {
    id: "nova", code: "NV", name: "Nova", domain: "nova.dev",
    threat: 54, threatLevel: "medium" as Threat, activity: 61,
    region: "North America", tint: "#FACC15",
    summary: "Design-forward challenger with a loyal indie base. Recent onboarding regressions are eroding sentiment.",
    last: "Reviews dropped 12%",
    x: 22, y: 68, size: 68,
  },
  {
    id: "pulse", code: "PL", name: "Pulse", domain: "pulse.co",
    threat: 32, threatLevel: "low" as Threat, activity: 42,
    region: "APAC", tint: "#22C55E",
    summary: "Adjacent analytics player pushing into overlapping territory. Currently opportunity more than threat.",
    last: "Entered LATAM market",
    x: 15, y: 40, size: 56,
  },
];

export const signals = [
  { id: "s1", type: "pricing" as SignalType, competitor: "Acme", title: "Acme reduced Pro plan pricing by 18%", body: "Acme quietly rolled out an 18% cut on the Pro tier, bundling AI credits previously sold as add-ons.", confidence: 94, severity: "critical", time: "6:50 PM" },
  { id: "s2", type: "product" as SignalType, competitor: "Acme", title: "Acme shipped native workflow automation", body: "New workflow builder covers 60% of the surface where Lattice differentiates today.", confidence: 88, severity: "critical", time: "2:32 PM" },
  { id: "s3", type: "product" as SignalType, competitor: "Vertex", title: "Vertex launched AI Search", body: "Semantic search across all workspace content, launched at Vertex Summit.", confidence: 91, severity: "high", time: "1:14 PM" },
  { id: "s4", type: "reviews" as SignalType, competitor: "Nova", title: "Nova review sentiment dropped 12%", body: "G2 and Capterra show sharp drop tied to a broken onboarding flow.", confidence: 82, severity: "medium", time: "3:41 AM" },
  { id: "s5", type: "marketing" as SignalType, competitor: "Pulse", title: "Pulse entered LATAM market", body: "Localized site in pt-BR and es-MX, plus regional pricing.", confidence: 76, severity: "medium", time: "11:02 AM" },
  { id: "s6", type: "hiring" as SignalType, competitor: "Vertex", title: "Vertex opened 14 enterprise AE roles", body: "Aggressive hiring signal — a coordinated enterprise push into North America.", confidence: 84, severity: "high", time: "9:28 AM" },
  { id: "s7", type: "partnership" as SignalType, competitor: "Acme", title: "Acme × Snowflake integration", body: "Direct data warehouse write-back, GA in Q3.", confidence: 89, severity: "high", time: "8:11 AM" },
  { id: "s8", type: "news" as SignalType, competitor: "Nova", title: "Nova raised $40M Series B", body: "Led by Sequoia. Runway extended ~28 months.", confidence: 97, severity: "high", time: "7:04 AM" },
  { id: "s9", type: "product" as SignalType, competitor: "Pulse", title: "Pulse deprecated legacy dashboards", body: "Migration path forced by end of month — customer churn risk for Pulse.", confidence: 71, severity: "low", time: "6:00 AM" },
];

export const reports = [
  { id: "r0", tag: "featured", kind: "Executive", period: "APR — JUN 2026", title: "Q2 Competitive Landscape Brief", subtitle: "Pricing pressure, ecosystem plays, and the enterprise pull-through", confidence: 92, covers: ["Acme","Vertex","Nova","Pulse"], status: "ready" },
  { id: "r1", kind: "Pricing", period: "JUL 2026", title: "Acme Pricing Doctrine", subtitle: "18% cut, credit bundling, and the mid-market squeeze", confidence: 88, status: "ready" },
  { id: "r2", kind: "SWOT", period: "JUN 2026", title: "SWOT — Lattice vs Vertex", subtitle: "Where the EU challenger threatens and where you win", confidence: 85, status: "ready" },
  { id: "r3", kind: "Market", period: "H1 2026", title: "Market Map — Workflow Automation", subtitle: "Where the category is compressing", confidence: 79, status: "draft" },
  { id: "r4", kind: "Competitor", period: "JUN 2026", title: "Nova — Sentiment Deep Dive", subtitle: "Reading the review drop before it becomes churn", confidence: 81, status: "ready" },
  { id: "r5", kind: "Pricing", period: "MAY 2026", title: "Pricing Elasticity Panel", subtitle: "How the category responded to Acme's move", confidence: 74, status: "draft" },
];

export const history = [
  { day: "TODAY", items: [
    { kind: "SIGNAL DETECTED", time: "14:20", title: "Acme reduced Pro pricing by 18%", detail: "3 corroborating sources, confidence 94%", author: "AI Research Agent" },
    { kind: "INVESTIGATION", time: "13:02", title: "Investigation: Why is Acme gaining enterprise?", detail: "5 agents, 41 evidence items", author: "AI Strategy Agent" },
    { kind: "SIGNAL DETECTED", time: "10:12", title: "Vertex launched AI Search", detail: "Detected via changelog scan", author: "AI Research Agent" },
  ]},
  { day: "YESTERDAY", items: [
    { kind: "REPORT", time: "22:44", title: "Q2 Competitive Landscape Brief generated", detail: "12 pages, 4 competitors", author: "You" },
    { kind: "ALERT", time: "18:33", title: "Alert reviewed: Nova sentiment drop", detail: "Flagged as opportunity", author: "System" },
    { kind: "MEMORY", time: "09:14", title: "Memory created: Acme × Snowflake", detail: "Linked to enterprise pattern cluster", author: "AI Research Agent" },
  ]},
  { day: "2 DAYS AGO", items: [
    { kind: "COMPETITOR ADDED", time: "16:20", title: "Pulse added to tracking", detail: "Auto-classified as adjacent · Low threat", author: "You" },
  ]},
];

export const alerts = [
  { id: "a1", severity: "critical", title: "Acme cut Pro pricing 18%", body: "Immediate mid-market pressure. Recommend response memo within 48h.", time: "2h ago", competitor: "Acme" },
  { id: "a2", severity: "high", title: "Vertex enterprise hiring surge", body: "14 new AE reqs in North America. Coordinated market push likely in 30-60d.", time: "6h ago", competitor: "Vertex" },
  { id: "a3", severity: "medium", title: "Nova sentiment slipping", body: "Sustained G2/Capterra decline. Potential churn opportunity.", time: "1d ago", competitor: "Nova" },
  { id: "a4", severity: "low", title: "Pulse expanded to LATAM", body: "Adjacent market. Monitor overlap in enterprise deals.", time: "2d ago", competitor: "Pulse" },
];

export const memoryTracks = [
  { code: "AC", tint: "#EF4444", events: [
    { m: 0, label: "First Pro tier trim" },
    { m: 2, label: "Workflows preview" },
    { m: 3, label: "Snowflake alliance" },
    { m: 5, label: "Pro cut 18%" },
  ]},
  { code: "VX", tint: "#00D4FF", events: [
    { m: 1, label: "AI Notes beta" },
    { m: 4, label: "AI Search launched" },
  ]},
  { code: "NV", tint: "#FACC15", events: [
    { m: 1, label: "Sentiment softens" },
  ]},
  { code: "PL", tint: "#22C55E", events: [
    { m: 2, label: "APAC hiring surge" },
    { m: 6, label: "LATAM launch" },
  ]},
];

export const agents = [
  { id: "research", name: "Research Agent", icon: "search", tint: "#4F8CFF" },
  { id: "pricing", name: "Pricing Agent", icon: "dollar", tint: "#22C55E" },
  { id: "sentiment", name: "Sentiment Agent", icon: "heart", tint: "#EF4444" },
  { id: "news", name: "News Agent", icon: "newspaper", tint: "#7DD3FC" },
  { id: "strategy", name: "Strategy Agent", icon: "trending", tint: "#FACC15" },
];

export const threatColor = (t: Threat) => t === "critical" ? "#EF4444" : t === "high" ? "#00D4FF" : t === "medium" ? "#FACC15" : "#22C55E";
export const signalColor = (t: SignalType) => ({
  pricing: "#EF4444", product: "#4F8CFF", marketing: "#FACC15",
  reviews: "#F472B6", hiring: "#22C55E", partnership: "#00D4FF", news: "#7DD3FC",
}[t]);
