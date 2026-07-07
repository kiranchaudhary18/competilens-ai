import type { LucideIcon } from "lucide-react";
import { Search, Globe, Newspaper, MessageSquare, Brain, Target } from "lucide-react";

export type Competitor = {
  id: string;
  name: string;
  domain: string;
  industry: string;
  logo: string;
  hq: string;
  employees: string;
  founded: number;
  arr: string;
  growth: number;
  score: number;
  status: "tracked" | "new" | "archived";
  lastAnalyzed: string;
  summary: string;
};

export const competitors: Competitor[] = [
  {
    id: "linear",
    name: "Linear",
    domain: "linear.app",
    industry: "Project Management",
    logo: "L",
    hq: "San Francisco, USA",
    employees: "180+",
    founded: 2019,
    arr: "$52M",
    growth: 128,
    score: 92,
    status: "tracked",
    lastAnalyzed: "2h ago",
    summary:
      "Opinionated issue tracking with a keyboard-first workflow, aggressively expanding into full product-development suite.",
  },
  {
    id: "notion",
    name: "Notion",
    domain: "notion.so",
    industry: "Productivity",
    logo: "N",
    hq: "San Francisco, USA",
    employees: "600+",
    founded: 2016,
    arr: "$500M",
    growth: 42,
    score: 87,
    status: "tracked",
    lastAnalyzed: "1d ago",
    summary: "All-in-one workspace pushing hard into AI-native docs, databases and calendaring.",
  },
  {
    id: "vercel",
    name: "Vercel",
    domain: "vercel.com",
    industry: "Developer Infra",
    logo: "▲",
    hq: "San Francisco, USA",
    employees: "500+",
    founded: 2015,
    arr: "$140M",
    growth: 96,
    score: 90,
    status: "tracked",
    lastAnalyzed: "5h ago",
    summary:
      "Frontend cloud betting on AI-generated UI, Edge functions and observability for React apps.",
  },
  {
    id: "stripe",
    name: "Stripe",
    domain: "stripe.com",
    industry: "Payments",
    logo: "S",
    hq: "Dublin / SF",
    employees: "8k+",
    founded: 2010,
    arr: "$14B",
    growth: 25,
    score: 96,
    status: "tracked",
    lastAnalyzed: "3d ago",
    summary:
      "Payments giant expanding into embedded finance, billing and issuing, with a strong developer moat.",
  },
  {
    id: "openai",
    name: "OpenAI",
    domain: "openai.com",
    industry: "AI Platform",
    logo: "◎",
    hq: "San Francisco, USA",
    employees: "2k+",
    founded: 2015,
    arr: "$3.4B",
    growth: 240,
    score: 95,
    status: "new",
    lastAnalyzed: "12m ago",
    summary:
      "Frontier model lab commercializing GPT via API and ChatGPT, moving up the stack into agents and devices.",
  },
];

export type Agent = {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  color: string;
};

export const agents: Agent[] = [
  {
    id: "research",
    name: "Research Agent",
    role: "Scanning knowledge graph & filings",
    icon: Search,
    color: "var(--primary)",
  },
  {
    id: "website",
    name: "Website Agent",
    role: "Crawling product pages & pricing",
    icon: Globe,
    color: "var(--secondary)",
  },
  {
    id: "news",
    name: "News Agent",
    role: "Parsing 8,214 articles from last 90d",
    icon: Newspaper,
    color: "var(--warning)",
  },
  {
    id: "review",
    name: "Review Agent",
    role: "Extracting customer sentiment",
    icon: MessageSquare,
    color: "var(--success)",
  },
  {
    id: "analysis",
    name: "Analysis Agent",
    role: "Correlating signals & SWOT",
    icon: Brain,
    color: "var(--primary-glow)",
  },
  {
    id: "strategy",
    name: "Strategy Agent",
    role: "Drafting actionable recommendations",
    icon: Target,
    color: "var(--chart-5)",
  },
];

export const stats = [
  { label: "Competitors tracked", value: "24", delta: "+3", trend: "up" as const },
  { label: "Reports generated", value: "148", delta: "+22", trend: "up" as const },
  { label: "Signals this week", value: "1,284", delta: "+18%", trend: "up" as const },
  { label: "Avg. threat score", value: "68", delta: "-4", trend: "down" as const },
];

export const growthSeries = [
  { month: "Jan", you: 40, market: 32 },
  { month: "Feb", you: 48, market: 36 },
  { month: "Mar", you: 55, market: 41 },
  { month: "Apr", you: 62, market: 44 },
  { month: "May", you: 71, market: 49 },
  { month: "Jun", you: 78, market: 52 },
  { month: "Jul", you: 88, market: 58 },
  { month: "Aug", you: 96, market: 62 },
];

export const sentimentSeries = [
  { name: "Positive", value: 62 },
  { name: "Neutral", value: 24 },
  { name: "Negative", value: 14 },
];

export const pricingSeries = [
  { tier: "Free", you: 0, competitor: 0 },
  { tier: "Starter", you: 12, competitor: 15 },
  { tier: "Pro", you: 29, competitor: 32 },
  { tier: "Business", you: 79, competitor: 89 },
  { tier: "Enterprise", you: 199, competitor: 249 },
];

export const featureMatrix = [
  { feature: "AI Autocomplete", you: true, competitor: true },
  { feature: "Realtime collaboration", you: true, competitor: true },
  { feature: "Offline mode", you: true, competitor: false },
  { feature: "Custom workflows", you: true, competitor: true },
  { feature: "SOC 2 Type II", you: true, competitor: true },
  { feature: "On-prem deploy", you: false, competitor: true },
  { feature: "Mobile SDK", you: true, competitor: false },
];

export const news = [
  {
    date: "Nov 12, 2026",
    source: "TechCrunch",
    title: "Linear raises $80M Series C led by Sequoia",
    sentiment: "positive" as const,
  },
  {
    date: "Nov 09, 2026",
    source: "The Verge",
    title: "Notion launches AI meetings, blurring lines with Loom",
    sentiment: "positive" as const,
  },
  {
    date: "Nov 03, 2026",
    source: "Reuters",
    title: "EU opens inquiry into Stripe's data residency practices",
    sentiment: "negative" as const,
  },
  {
    date: "Oct 28, 2026",
    source: "Bloomberg",
    title: "Vercel ships v0.dev enterprise tier at $500/seat",
    sentiment: "neutral" as const,
  },
];

export const reviews = [
  {
    author: "Sarah K.",
    role: "Head of Product",
    rating: 5,
    text: "Fastest issue tracker we've ever used. The keyboard shortcuts feel like a superpower.",
    source: "G2",
  },
  {
    author: "Marcus R.",
    role: "Engineering Manager",
    rating: 4,
    text: "Great UX, but reporting is still shallow compared to Jira advanced roadmaps.",
    source: "Trustpilot",
  },
  {
    author: "Dana L.",
    role: "Founder",
    rating: 5,
    text: "Everything you'd expect from a modern SaaS. Pricing has crept up though.",
    source: "Reddit",
  },
];

export const swot = {
  strengths: [
    "Best-in-class UX & performance",
    "Loyal developer community",
    "Aggressive shipping cadence",
  ],
  weaknesses: [
    "Limited enterprise controls",
    "Sparse reporting & BI",
    "Higher price than category avg.",
  ],
  opportunities: [
    "Expand into project portfolio management",
    "AI-native project planning",
    "APAC market entry",
  ],
  threats: [
    "Notion's growing project features",
    "Bundled tools from Atlassian",
    "AI-native new entrants",
  ],
};

export const risks = [
  {
    label: "Feature parity gap widening",
    severity: "high" as const,
    detail: "Competitor shipped 14 features in Q3 vs our 6.",
  },
  {
    label: "Pricing pressure on Pro tier",
    severity: "medium" as const,
    detail: "Two competitors dropped Pro tier by ~15%.",
  },
  {
    label: "Talent poaching in ML team",
    severity: "medium" as const,
    detail: "3 senior ML hires moved to competitor in 90d.",
  },
];

export const opportunities = [
  {
    label: "Undeserved SMB segment",
    impact: "high" as const,
    detail: "72% of SMBs surveyed lack a specialised tool.",
  },
  {
    label: "Vertical: healthcare",
    impact: "medium" as const,
    detail: "Regulated verticals have low competitor coverage.",
  },
  {
    label: "AI meeting notes bundle",
    impact: "high" as const,
    detail: "Attach an AI meeting module to reduce churn 8%.",
  },
];

export const recommendations = [
  {
    title: "Launch AI-native planning within 60 days",
    detail: "Close the gap on Notion's AI planning surface; est. +6% activation.",
    tag: "Product",
  },
  {
    title: "Introduce annual commit discount",
    detail: "Match competitor's 20% annual discount to defend Pro tier ARPU.",
    tag: "Pricing",
  },
  {
    title: "Ship SOC 2 Type II report",
    detail: "Unblocks 34 stalled enterprise deals in pipeline.",
    tag: "Trust",
  },
  {
    title: "Publish weekly benchmark blog",
    detail: "Own the narrative on speed & DX with public benchmarks.",
    tag: "Marketing",
  },
];

export const actionPlan = [
  {
    week: "Week 1",
    tasks: ["Audit AI feature gap", "Draft pricing experiment", "Interview 8 lost deals"],
  },
  {
    week: "Week 2-3",
    tasks: ["Ship AI planning beta", "A/B test annual discount", "Kick off SOC 2 remediation"],
  },
  {
    week: "Week 4-6",
    tasks: [
      "Public launch of AI planning",
      "Publish benchmark #1",
      "Close first 5 enterprise deals",
    ],
  },
];

export const history = [
  {
    id: "r-014",
    competitor: "Linear",
    date: "Nov 12, 2026",
    change: "+4 threat score",
    type: "update" as const,
  },
  {
    id: "r-013",
    competitor: "Notion",
    date: "Nov 09, 2026",
    change: "New AI feature detected",
    type: "signal" as const,
  },
  {
    id: "r-012",
    competitor: "Vercel",
    date: "Nov 05, 2026",
    change: "Pricing changed",
    type: "pricing" as const,
  },
  {
    id: "r-011",
    competitor: "Stripe",
    date: "Nov 01, 2026",
    change: "Regulatory news",
    type: "news" as const,
  },
  {
    id: "r-010",
    competitor: "OpenAI",
    date: "Oct 27, 2026",
    change: "New model launched",
    type: "signal" as const,
  },
  {
    id: "r-009",
    competitor: "Linear",
    date: "Oct 20, 2026",
    change: "Report generated",
    type: "update" as const,
  },
  {
    id: "r-008",
    competitor: "Notion",
    date: "Oct 12, 2026",
    change: "Leadership change",
    type: "news" as const,
  },
];

export const memoryComparisons = [
  {
    competitor: "Linear",
    previous: { date: "Aug 12, 2026", score: 84, arr: "$41M", features: 42, pricing: "$8 / user" },
    latest: { date: "Nov 12, 2026", score: 92, arr: "$52M", features: 56, pricing: "$10 / user" },
  },
  {
    competitor: "Notion",
    previous: {
      date: "Jul 30, 2026",
      score: 82,
      arr: "$420M",
      features: 128,
      pricing: "$10 / user",
    },
    latest: { date: "Nov 09, 2026", score: 87, arr: "$500M", features: 141, pricing: "$12 / user" },
  },
  {
    competitor: "Vercel",
    previous: {
      date: "Aug 01, 2026",
      score: 86,
      arr: "$110M",
      features: 64,
      pricing: "$20 / user",
    },
    latest: { date: "Nov 05, 2026", score: 90, arr: "$140M", features: 78, pricing: "$20 / user" },
  },
];

export const notifications = [
  { id: 1, title: "Linear shipped AI planning", time: "12m", type: "signal" as const },
  { id: 2, title: "Report ready: Vercel Q4", time: "1h", type: "report" as const },
  { id: 3, title: "3 new news mentions for Stripe", time: "3h", type: "news" as const },
  { id: 4, title: "Notion pricing updated", time: "1d", type: "pricing" as const },
];
