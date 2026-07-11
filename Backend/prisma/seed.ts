import bcrypt from "bcrypt";
import { PrismaClient, UserRole, CompetitorStatus, SignalType, SignalSeverity, ReportStatus, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing records (Optional, in case of re-run)
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.memorySnapshot.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.signal.deleteMany({});
  await prisma.competitor.deleteMany({});
  await prisma.workspaceSetting.deleteMany({});
  await prisma.user.updateMany({ data: { workspaceId: null } });
  await prisma.workspace.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Admin User
  const adminPasswordHash = await bcrypt.hash("password123", 12);
  const adminUser = await prisma.user.create({
    data: {
      fullName: "Alex Kim",
      email: "alex@competilens.ai",
      password: adminPasswordHash,
      avatar: "https://competilens.ai/avatars/alex.jpg",
      role: UserRole.ADMIN,
      isVerified: true,
      emailVerified: true,
    },
  });
  console.log(`Created Admin User: ${adminUser.email}`);

  // 3. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Acme Global Workspace",
      slug: "acme-global",
      logo: "https://competilens.ai/logos/acme.png",
      industry: "Enterprise Software",
      country: "United States",
      ownerId: adminUser.id,
    },
  });
  console.log(`Created Workspace: ${workspace.name}`);

  // Update Admin User's workspace association
  await prisma.user.update({
    where: { id: adminUser.id },
    data: { workspaceId: workspace.id },
  });

  // 4. Create Workspace Setting
  const settings = await prisma.workspaceSetting.create({
    data: {
      workspaceId: workspace.id,
      theme: "light",
      language: "en",
      timezone: "PST",
      notificationsEnabled: true,
    },
  });
  console.log("Created Workspace Settings");

  // 5. Create 5 Competitors
  const competitorsData = [
    { name: "Linear", domain: "linear.app", website: "https://linear.app", industry: "Project Management", logo: "https://logo.clearbit.com/linear.app" },
    { name: "Notion", domain: "notion.so", website: "https://notion.so", industry: "Workspace & Docs", logo: "https://logo.clearbit.com/notion.so" },
    { name: "Vercel", domain: "vercel.com", website: "https://vercel.com", industry: "Developer CDN Platform", logo: "https://logo.clearbit.com/vercel.com" },
    { name: "Coda", domain: "coda.io", website: "https://coda.io", industry: "Collaborative Documents", logo: "https://logo.clearbit.com/coda.io" },
    { name: "Jira", domain: "atlassian.com", website: "https://atlassian.com/software/jira", industry: "Enterprise Project Mgmt", logo: "https://logo.clearbit.com/jira.com" },
  ];

  const competitors = [];
  for (const comp of competitorsData) {
    const created = await prisma.competitor.create({
      data: {
        workspaceId: workspace.id,
        name: comp.name,
        domain: comp.domain,
        website: comp.website,
        logo: comp.logo,
        description: `Market leading competitor focused on ${comp.industry}.`,
        industry: comp.industry,
        status: CompetitorStatus.ACTIVE,
      },
    });
    competitors.push(created);
  }
  console.log(`Created ${competitors.length} Competitors`);

  // 6. Create 25 Signals (spread across competitors)
  const signalTitles = [
    { title: "Pricing Plan Restructured", desc: "Added a new $10 Pro tier while capping free workspaces.", type: SignalType.PRICING, severity: SignalSeverity.HIGH },
    { title: "AI Assistant Feature Launched", desc: "Rolled out automatic summarization capabilities in editor.", type: SignalType.PRODUCT, severity: SignalSeverity.MEDIUM },
    { title: "Key VP of Product Hired", desc: "Poached key platform engineering leader from Google Cloud.", type: SignalType.HIRING, severity: SignalSeverity.HIGH },
    { title: "Series C Funding Secured", desc: "Closed a $45M Series C round valuing the business at $900M.", type: SignalType.NEWS, severity: SignalSeverity.CRITICAL },
    { title: "New Landing Page Design", desc: "Completely refreshed typography and layout design system.", type: SignalType.WEBSITE, severity: SignalSeverity.LOW },
  ];

  let signalCount = 0;
  for (let i = 0; i < 25; i++) {
    const comp = competitors[i % competitors.length];
    const template = signalTitles[i % signalTitles.length];
    await prisma.signal.create({
      data: {
        workspaceId: workspace.id,
        competitorId: comp.id,
        title: `${comp.name}: ${template.title}`,
        summary: `${comp.name} has ${template.desc.toLowerCase()}`,
        type: template.type,
        severity: template.severity,
        url: `${comp.website}/news-and-updates-row-${i}`,
        source: comp.website,
        publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });
    signalCount++;
  }
  console.log(`Created ${signalCount} Signals`);

  // 7. Create 5 Reports
  for (let i = 0; i < 5; i++) {
    const comp = competitors[i % competitors.length];
    await prisma.report.create({
      data: {
        workspaceId: workspace.id,
        competitorId: comp.id,
        generatedBy: adminUser.id,
        title: `Q${i + 1} Competitor Report: ${comp.name}`,
        summary: `Strategic briefing covering ${comp.name}'s latest software expansions and estimated ARR shifts.`,
        pdfUrl: `https://competilens.ai/reports/acme-${comp.name.toLowerCase()}-q${i + 1}.pdf`,
        status: ReportStatus.READY,
      },
    });
  }
  console.log("Created 5 Reports");

  // 8. Create 5 Memory Snapshots
  const snapshotData = [
    { threat: 85, arr: "$45M", pricing: "$8/user", features: 56, strengths: ["UX simplicity", "Developer DX"], weaknesses: ["Enterprise reporting"] },
    { threat: 92, arr: "$500M", pricing: "$10/user", features: 142, strengths: ["Community templates", "Infinite flexibility"], weaknesses: ["Database load time"] },
    { threat: 88, arr: "$150M", pricing: "$20/user", features: 78, strengths: ["Global Edge network", "Next.js leadership"], weaknesses: ["Bandwidth costs"] },
    { threat: 74, arr: "$35M", pricing: "$12/user", features: 94, strengths: ["Strong custom formulas", "Pack ecosystem"], weaknesses: ["Complex UI setup"] },
    { threat: 80, arr: "$1.2B", pricing: "$15/user", features: 280, strengths: ["Huge enterprise footprint", "Robust Jira integration"], weaknesses: ["Bloated setup steps"] },
  ];

  for (let i = 0; i < 5; i++) {
    const comp = competitors[i];
    const snap = snapshotData[i];
    await prisma.memorySnapshot.create({
      data: {
        competitorId: comp.id,
        threatScore: snap.threat,
        estimatedARR: snap.arr,
        pricing: snap.pricing,
        featureCount: snap.features,
        strengths: snap.strengths,
        weaknesses: snap.weaknesses,
        notes: { comment: `Snapshot audit executed successfully for ${comp.name}.` },
      },
    });
  }
  console.log("Created 5 Memory Snapshots");

  // 9. Create 10 Notifications
  for (let i = 0; i < 10; i++) {
    await prisma.notification.create({
      data: {
        userId: adminUser.id,
        title: `Intelligence Signal Alert ${i + 1}`,
        message: `CompetiLens AI detected a new product launch update for competitor ${competitors[i % competitors.length].name}.`,
        type: i % 2 === 0 ? NotificationType.SUCCESS : NotificationType.WARNING,
        isRead: i < 6,
      },
    });
  }
  console.log("Created 10 Notifications");

  // 10. Create 10 Activity Logs
  const actions = [
    { action: "User Login", module: "AUTH" },
    { action: "View Dashboard", module: "ANALYTICS" },
    { action: "Generate Report", module: "REPORTS" },
    { action: "Update Settings", module: "WORKSPACE" },
    { action: "Configure Integrations", module: "WORKSPACE" },
  ];

  for (let i = 0; i < 10; i++) {
    const template = actions[i % actions.length];
    await prisma.activityLog.create({
      data: {
        userId: adminUser.id,
        action: template.action,
        module: template.module,
        ipAddress: `192.168.1.${10 + i}`,
      },
    });
  }
  console.log("Created 10 Activity Logs");

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
