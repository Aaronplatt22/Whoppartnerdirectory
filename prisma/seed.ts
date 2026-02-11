import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding database...");

  // --- USERS ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@whop.com" },
    update: {},
    create: {
      email: "admin@whop.com",
      name: "Aaron Admin",
      role: "admin",
      passwordHash: hashPassword("admin123"),
    },
  });

  const cam1 = await prisma.user.upsert({
    where: { email: "cam1@whop.com" },
    update: {},
    create: {
      email: "cam1@whop.com",
      name: "Sarah Chen",
      role: "account_manager",
      passwordHash: hashPassword("cam123"),
    },
  });

  const cam2 = await prisma.user.upsert({
    where: { email: "cam2@whop.com" },
    update: {},
    create: {
      email: "cam2@whop.com",
      name: "Marcus Johnson",
      role: "account_manager",
      passwordHash: hashPassword("cam123"),
    },
  });

  const partnerUser1 = await prisma.user.upsert({
    where: { email: "jake@pixelforge.io" },
    update: {},
    create: {
      email: "jake@pixelforge.io",
      name: "Jake Morrison",
      role: "partner",
      passwordHash: hashPassword("partner123"),
    },
  });

  const partnerUser2 = await prisma.user.upsert({
    where: { email: "nina@growthlab.co" },
    update: {},
    create: {
      email: "nina@growthlab.co",
      name: "Nina Patel",
      role: "partner",
      passwordHash: hashPassword("partner123"),
    },
  });

  const partnerUser3 = await prisma.user.upsert({
    where: { email: "tom@buildstack.dev" },
    update: {},
    create: {
      email: "tom@buildstack.dev",
      name: "Tom Rivera",
      role: "partner",
      passwordHash: hashPassword("partner123"),
    },
  });

  const partnerUser4 = await prisma.user.upsert({
    where: { email: "lisa@contentwave.co" },
    update: {},
    create: {
      email: "lisa@contentwave.co",
      name: "Lisa Zhang",
      role: "partner",
      passwordHash: hashPassword("partner123"),
    },
  });

  const partnerUser5 = await prisma.user.upsert({
    where: { email: "omar@launchpad.agency" },
    update: {},
    create: {
      email: "omar@launchpad.agency",
      name: "Omar Khalil",
      role: "partner",
      passwordHash: hashPassword("partner123"),
    },
  });

  console.log("Users created");

  // --- PARTNERS ---
  await prisma.bountyProgress.deleteMany({});
  await prisma.bounty.deleteMany({});
  await prisma.dealActivity.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.camAssignment.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.partner.deleteMany({});

  const partner1 = await prisma.partner.create({
    data: {
      userId: partnerUser1.id,
      slug: "pixelforge",
      name: "PixelForge Studios",
      logo: "/logos/pixel.svg",
      coverImage: "",
      tagline: "Premium Whop design & development",
      description: "We build beautiful, high-converting Whop pages and custom integrations.",
      partnerType: "Agency",
      categories: JSON.stringify(["Web Design", "Development", "Whop Customization"]),
      industries: JSON.stringify(["Education", "Fitness", "Finance"]),
      featuredWhops: JSON.stringify([]),
      caseStudies: JSON.stringify([]),
      reviews: JSON.stringify([]),
      avgRating: 4.8,
      reviewCount: 24,
      priceRange: "$$$",
      location: "Austin, TX",
      timezone: "CST",
      languages: JSON.stringify(["English"]),
      responseTime: "Under 24 hours",
      contactEmail: "jake@pixelforge.io",
      website: "https://pixelforge.io",
      internalNotes: "Top performer. Great for high-ticket clients.",
      internalTags: JSON.stringify(["top-performer", "design", "dev"]),
      whopContactPerson: "Sarah Chen",
      recommendedFor: JSON.stringify(["Course creators", "Premium memberships"]),
      tier: "Gold",
      totalRevenue: 145000,
      totalDeals: 18,
    },
  });

  const partner2 = await prisma.partner.create({
    data: {
      userId: partnerUser2.id,
      slug: "growthlab",
      name: "GrowthLab",
      logo: "/logos/growthlab.svg",
      coverImage: "",
      tagline: "Data-driven growth for Whop creators",
      description: "We help Whop creators scale with paid ads, email funnels, and conversion optimization.",
      partnerType: "Agency",
      categories: JSON.stringify(["Marketing", "Paid Ads", "Email Marketing"]),
      industries: JSON.stringify(["SaaS", "Education", "E-commerce"]),
      featuredWhops: JSON.stringify([]),
      caseStudies: JSON.stringify([]),
      reviews: JSON.stringify([]),
      avgRating: 4.6,
      reviewCount: 31,
      priceRange: "$$",
      location: "Miami, FL",
      timezone: "EST",
      languages: JSON.stringify(["English", "Spanish"]),
      responseTime: "Under 24 hours",
      contactEmail: "nina@growthlab.co",
      website: "https://growthlab.co",
      internalNotes: "Strong in paid acquisition.",
      internalTags: JSON.stringify(["marketing", "growth", "ads"]),
      whopContactPerson: "Sarah Chen",
      recommendedFor: JSON.stringify(["Scaling creators", "Ad-heavy businesses"]),
      tier: "Silver",
      totalRevenue: 87000,
      totalDeals: 12,
    },
  });

  const partner3 = await prisma.partner.create({
    data: {
      userId: partnerUser3.id,
      slug: "buildstack",
      name: "BuildStack",
      logo: "/logos/buildstack.svg",
      coverImage: "",
      tagline: "Full-stack development for Whop integrations",
      description: "Custom API integrations, automation workflows, and technical builds for Whop.",
      partnerType: "Freelancer",
      categories: JSON.stringify(["Development", "API Integration", "Automation"]),
      industries: JSON.stringify(["SaaS", "Finance", "Trading"]),
      featuredWhops: JSON.stringify([]),
      caseStudies: JSON.stringify([]),
      reviews: JSON.stringify([]),
      avgRating: 4.9,
      reviewCount: 15,
      priceRange: "$$$$",
      location: "San Francisco, CA",
      timezone: "PST",
      languages: JSON.stringify(["English"]),
      responseTime: "Under 4 hours",
      contactEmail: "tom@buildstack.dev",
      website: "https://buildstack.dev",
      internalNotes: "Best technical partner. Complex integrations only.",
      internalTags: JSON.stringify(["technical", "api", "automation"]),
      whopContactPerson: "Marcus Johnson",
      recommendedFor: JSON.stringify(["Complex integrations", "API work"]),
      tier: "Gold",
      totalRevenue: 210000,
      totalDeals: 9,
    },
  });

  const partner4 = await prisma.partner.create({
    data: {
      userId: partnerUser4.id,
      slug: "contentwave",
      name: "ContentWave",
      logo: "/logos/contentwave.svg",
      coverImage: "",
      tagline: "Content strategy for digital creators",
      description: "Content strategies, course curricula, and community engagement plans.",
      partnerType: "Agency",
      categories: JSON.stringify(["Content Strategy", "Course Design", "Community"]),
      industries: JSON.stringify(["Education", "Coaching", "Creative"]),
      featuredWhops: JSON.stringify([]),
      caseStudies: JSON.stringify([]),
      reviews: JSON.stringify([]),
      avgRating: 4.5,
      reviewCount: 19,
      priceRange: "$$",
      location: "New York, NY",
      timezone: "EST",
      languages: JSON.stringify(["English", "Mandarin"]),
      responseTime: "Under 24 hours",
      contactEmail: "lisa@contentwave.co",
      website: "https://contentwave.co",
      internalNotes: "Great for content-heavy creators.",
      internalTags: JSON.stringify(["content", "community", "courses"]),
      whopContactPerson: "Marcus Johnson",
      recommendedFor: JSON.stringify(["Course creators", "Community builders"]),
      tier: "Bronze",
      totalRevenue: 42000,
      totalDeals: 7,
    },
  });

  const partner5 = await prisma.partner.create({
    data: {
      userId: partnerUser5.id,
      slug: "launchpad-agency",
      name: "Launchpad Agency",
      logo: "/logos/launchpad.svg",
      coverImage: "",
      tagline: "Launch, grow, and scale on Whop",
      description: "Full-service Whop agency. From initial setup to scaling to 7 figures.",
      partnerType: "Agency",
      categories: JSON.stringify(["Full Service", "Launch Strategy", "Operations"]),
      industries: JSON.stringify(["Education", "Fitness", "Finance", "SaaS"]),
      featuredWhops: JSON.stringify([]),
      caseStudies: JSON.stringify([]),
      reviews: JSON.stringify([]),
      avgRating: 4.7,
      reviewCount: 28,
      priceRange: "$$$",
      location: "Los Angeles, CA",
      timezone: "PST",
      languages: JSON.stringify(["English", "Arabic"]),
      responseTime: "Under 24 hours",
      contactEmail: "omar@launchpad.agency",
      website: "https://launchpad.agency",
      internalNotes: "Solid all-rounder.",
      internalTags: JSON.stringify(["full-service", "launch", "scaling"]),
      whopContactPerson: "Sarah Chen",
      recommendedFor: JSON.stringify(["New creators", "Full-service needs"]),
      tier: "Silver",
      totalRevenue: 98000,
      totalDeals: 14,
    },
  });

  console.log("Partners created");

  // --- CAM ASSIGNMENTS ---
  await prisma.camAssignment.createMany({
    data: [
      { camId: cam1.id, partnerId: partner1.id },
      { camId: cam1.id, partnerId: partner2.id },
      { camId: cam1.id, partnerId: partner5.id },
      { camId: cam2.id, partnerId: partner3.id },
      { camId: cam2.id, partnerId: partner4.id },
    ],
  });
  console.log("CAM assignments created");

  // --- DEALS ---
  const deal1 = await prisma.deal.create({
    data: {
      name: "FitLife Pro Whop Setup",
      businessName: "FitLife Pro",
      businessContact: "Mike Chen",
      businessEmail: "mike@fitlifepro.com",
      estimatedValue: 15000,
      monthlyProcessing: 8000,
      probability: 80,
      stage: "Qualified",
      notes: "High-ticket fitness course. Wants premium design + payment integration.",
      partnerId: partner1.id,
      camId: cam1.id,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      name: "CryptoEdge Trading Community",
      businessName: "CryptoEdge",
      businessContact: "Alex Rivera",
      businessEmail: "alex@cryptoedge.io",
      estimatedValue: 25000,
      monthlyProcessing: 20000,
      probability: 60,
      stage: "In Discussion",
      notes: "Full trading signals community with Discord integration.",
      partnerId: partner1.id,
      camId: cam1.id,
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      name: "ScaleUp SaaS Academy",
      businessName: "ScaleUp Academy",
      businessContact: "Priya Sharma",
      businessEmail: "priya@scaleupacademy.com",
      estimatedValue: 8000,
      monthlyProcessing: 5000,
      probability: 90,
      stage: "Closed Won",
      notes: "Launched successfully. First month revenue exceeded projections.",
      partnerId: partner2.id,
      camId: cam1.id,
      closedAt: new Date("2025-01-15"),
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      name: "MasterClass Hub",
      businessName: "MasterClass Hub",
      businessContact: "Jordan Lee",
      businessEmail: "jordan@masterclasshub.com",
      estimatedValue: 12000,
      monthlyProcessing: 10000,
      probability: 40,
      stage: "New Opportunity",
      notes: "Initial conversation. Interested in course platform setup.",
      partnerId: partner2.id,
      camId: cam1.id,
    },
  });

  const deal5 = await prisma.deal.create({
    data: {
      name: "AlgoTrade Pro Integration",
      businessName: "AlgoTrade Pro",
      businessContact: "David Kim",
      businessEmail: "david@algotradepro.com",
      estimatedValue: 50000,
      monthlyProcessing: 35000,
      probability: 70,
      stage: "Qualified",
      notes: "Complex API integration. Custom webhook system for trade signals.",
      partnerId: partner3.id,
      camId: cam2.id,
    },
  });

  const deal6 = await prisma.deal.create({
    data: {
      name: "FinanceGuru Membership",
      businessName: "FinanceGuru",
      businessContact: "Sarah Williams",
      businessEmail: "sarah@financeguru.com",
      estimatedValue: 18000,
      monthlyProcessing: 12000,
      probability: 50,
      stage: "In Discussion",
      notes: "Automated member onboarding with Stripe integration.",
      partnerId: partner3.id,
      camId: cam2.id,
    },
  });

  const deal7 = await prisma.deal.create({
    data: {
      name: "CreatorSchool Content Platform",
      businessName: "CreatorSchool",
      businessContact: "Emma Watson",
      businessEmail: "emma@creatorschool.co",
      estimatedValue: 6000,
      monthlyProcessing: 3000,
      probability: 85,
      stage: "Qualified",
      notes: "Content strategy + course curriculum design. Ready to start.",
      partnerId: partner4.id,
      camId: cam2.id,
    },
  });

  const deal8 = await prisma.deal.create({
    data: {
      name: "YogaFlow Digital Studio",
      businessName: "YogaFlow",
      businessContact: "Tina Park",
      businessEmail: "tina@yogaflow.com",
      estimatedValue: 20000,
      monthlyProcessing: 15000,
      probability: 75,
      stage: "In Discussion",
      notes: "Full-service launch. Design, marketing, and ongoing management.",
      partnerId: partner5.id,
      camId: cam1.id,
    },
  });

  const deal9 = await prisma.deal.create({
    data: {
      name: "BeatMakers Collective",
      businessName: "BeatMakers",
      businessContact: "Ray Thompson",
      businessEmail: "ray@beatmakers.io",
      estimatedValue: 10000,
      monthlyProcessing: 7000,
      probability: 30,
      stage: "Long Term Nurture",
      notes: "Not ready to launch yet. Following up in Q2.",
      partnerId: partner5.id,
      camId: cam1.id,
    },
  });

  const deal10 = await prisma.deal.create({
    data: {
      name: "TechTalk Premium Community",
      businessName: "TechTalk",
      businessContact: "Chris Miller",
      businessEmail: "chris@techtalk.dev",
      estimatedValue: 35000,
      monthlyProcessing: 25000,
      probability: 10,
      stage: "Closed Lost",
      notes: "Went with a competitor. Price was the deciding factor.",
      partnerId: partner1.id,
      camId: cam1.id,
      closedAt: new Date("2025-02-01"),
      closedReason: "Lost to competitor on pricing",
    },
  });

  console.log("Deals created");

  // --- DEAL ACTIVITIES ---
  await prisma.dealActivity.createMany({
    data: [
      { dealId: deal1.id, authorId: partnerUser1.id, type: "message", content: "Initial call went great. Mike is excited about the platform.", createdAt: new Date("2025-01-10") },
      { dealId: deal1.id, authorId: cam1.id, type: "message", content: "Proposal looks solid. Bump the timeline estimate by a week.", createdAt: new Date("2025-01-11") },
      { dealId: deal1.id, authorId: partnerUser1.id, type: "stage_change", content: "Moved from In Discussion to Qualified", createdAt: new Date("2025-01-12") },
      { dealId: deal2.id, authorId: partnerUser1.id, type: "message", content: "Alex wants Discord bot integration. Scoping technical requirements.", createdAt: new Date("2025-01-20") },
      { dealId: deal5.id, authorId: partnerUser3.id, type: "message", content: "Custom webhook system will take 4-6 weeks. David approved.", createdAt: new Date("2025-01-25") },
      { dealId: deal5.id, authorId: cam2.id, type: "message", content: "Great work Tom. Keep me posted on the spec review.", createdAt: new Date("2025-01-26") },
      { dealId: deal8.id, authorId: partnerUser5.id, type: "message", content: "Tina loves the initial mockups. Moving to proposal phase.", createdAt: new Date("2025-02-01") },
    ],
  });
  console.log("Deal activities created");

  // --- BOUNTIES ---
  const bounty1 = await prisma.bounty.create({
    data: {
      title: "February Deal Blitz",
      description: "Register and close 3 deals this month to earn a $500 bonus.",
      type: "deal_count",
      target: 3,
      reward: "$500 bonus",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-02-28"),
      isActive: true,
    },
  });

  const bounty2 = await prisma.bounty.create({
    data: {
      title: "Revenue Milestone",
      description: "Generate $50,000 in total deal value this quarter.",
      type: "revenue",
      target: 50000,
      reward: "Tier upgrade + featured listing",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-03-31"),
      isActive: true,
    },
  });

  const bounty3 = await prisma.bounty.create({
    data: {
      title: "Merchant Activation Sprint",
      description: "Get 5 merchants to make their first payment this month.",
      type: "merchant_activation",
      target: 5,
      reward: "$300 bonus + badge",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-02-28"),
      isActive: true,
    },
  });
  console.log("Bounties created");

  // --- BOUNTY PROGRESS ---
  await prisma.bountyProgress.createMany({
    data: [
      { bountyId: bounty1.id, partnerId: partner1.id, current: 2 },
      { bountyId: bounty1.id, partnerId: partner2.id, current: 1 },
      { bountyId: bounty1.id, partnerId: partner3.id, current: 0 },
      { bountyId: bounty1.id, partnerId: partner5.id, current: 1 },
      { bountyId: bounty2.id, partnerId: partner1.id, current: 40000 },
      { bountyId: bounty2.id, partnerId: partner3.id, current: 50000, completed: true },
      { bountyId: bounty2.id, partnerId: partner5.id, current: 30000 },
      { bountyId: bounty3.id, partnerId: partner1.id, current: 3 },
      { bountyId: bounty3.id, partnerId: partner2.id, current: 1 },
    ],
  });
  console.log("Bounty progress created");

  // --- NOTIFICATIONS ---
  await prisma.notification.createMany({
    data: [
      { userId: partnerUser1.id, type: "deal_registered", title: "Deal Registered", message: "Your deal CryptoEdge Trading Community has been registered.", link: "/partner/deals" },
      { userId: partnerUser1.id, type: "bounty_progress", title: "Bounty Progress", message: "You are 2/3 of the way to the February Deal Blitz reward!", link: "/partner/bounties" },
      { userId: cam1.id, type: "deal_registered", title: "New Deal", message: "PixelForge Studios registered a new deal: CryptoEdge Trading Community", link: "/am/pipeline" },
      { userId: cam2.id, type: "stage_change", title: "Deal Stage Changed", message: "AlgoTrade Pro Integration moved to Qualified", link: "/am/pipeline" },
      { userId: admin.id, type: "system_event", title: "New Partner Application", message: "New application received from TechVentures Inc.", link: "/admin/submissions" },
    ],
  });
  console.log("Notifications created");

  // --- PARTNER APPLICATIONS ---
  await prisma.partnerApplication.deleteMany({});
  await prisma.partnerApplication.createMany({
    data: [
      { name: "TechVentures Inc", email: "hello@techventures.io", company: "TechVentures", interest: "Whop setup services for SaaS clients." },
      { name: "DesignPulse", email: "contact@designpulse.co", company: "DesignPulse", interest: "Whop page design and branding." },
      { name: "MediaFlow Agency", email: "info@mediaflow.agency", company: "MediaFlow", interest: "Social media marketing for Whop creators." },
    ],
  });
  console.log("Partner applications created");

  console.log("");
  console.log("Seed complete! Demo credentials:");
  console.log("  Admin:   admin@whop.com / admin123");
  console.log("  CAM 1:   cam1@whop.com / cam123");
  console.log("  CAM 2:   cam2@whop.com / cam123");
  console.log("  Partner: jake@pixelforge.io / partner123");
  console.log("  Partner: nina@growthlab.co / partner123");
  console.log("  Partner: tom@buildstack.dev / partner123");
  console.log("  Partner: lisa@contentwave.co / partner123");
  console.log("  Partner: omar@launchpad.agency / partner123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
