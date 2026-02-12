import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.notification.deleteMany();
  await prisma.dealActivity.deleteMany();
  await prisma.bountyProgress.deleteMany();
  await prisma.bounty.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.camAssignment.deleteMany();
  await prisma.partnerApplication.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 10);
  const camHash = await bcrypt.hash("cam123", 10);
  const partnerHash = await bcrypt.hash("partner123", 10);

  const admin = await prisma.user.create({ data: { name: "Admin User", email: "admin@whop.com", passwordHash: adminHash, role: "admin" } });
  const cam1 = await prisma.user.create({ data: { name: "Sarah Chen", email: "cam1@whop.com", passwordHash: camHash, role: "account_manager" } });
  const cam2 = await prisma.user.create({ data: { name: "Marcus Johnson", email: "cam2@whop.com", passwordHash: camHash, role: "account_manager" } });

  const partnerUsers = await Promise.all([
    prisma.user.create({ data: { name: "Jake Morrison", email: "jake@pixelforge.io", passwordHash: partnerHash, role: "partner" } }),
    prisma.user.create({ data: { name: "Nina Patel", email: "nina@growthlab.co", passwordHash: partnerHash, role: "partner" } }),
    prisma.user.create({ data: { name: "Tom Reeves", email: "tom@buildstack.dev", passwordHash: partnerHash, role: "partner" } }),
    prisma.user.create({ data: { name: "Lisa Nguyen", email: "lisa@contentwave.co", passwordHash: partnerHash, role: "partner" } }),
    prisma.user.create({ data: { name: "Omar Farouk", email: "omar@launchpad.agency", passwordHash: partnerHash, role: "partner" } }),
  ]);
  console.log("Users created");

  const partners = await Promise.all([
    prisma.partner.create({ data: {
      name: "PixelForge Studios", slug: "pixelforge-studios", user: { connect: { id: partnerUsers[0].id } }, partnerType: "Agency", tier: "Gold", status: "active", location: "San Francisco, CA",
      tagline: "Full-service creative agency for Whop storefronts", description: "Full-service creative agency specializing in Whop storefronts and digital products.",
      categories: "Design,Development,Marketing", industries: "E-commerce,Digital Products,Education", featuredWhops: "", caseStudies: "", reviews: "",
      priceRange: "$5k-$25k", languages: "English", responseTime: "Within 24 hours", contactEmail: "jake@pixelforge.io",
      internalTags: "top-performer,design-specialist", recommendedFor: "Storefronts,Digital Products",
      specialties: ["Design", "Development", "Marketing"], avgRating: 4.8, totalDeals: 12,
    }}),
    prisma.partner.create({ data: {
      name: "GrowthLab", slug: "growthlab", user: { connect: { id: partnerUsers[1].id } }, partnerType: "Agency", tier: "Silver", status: "active", location: "Austin, TX",
      tagline: "Growth marketing for communities and creators", description: "Growth marketing agency focused on community building and monetization.",
      categories: "Marketing,Community Building,Analytics", industries: "SaaS,Communities,Coaching", featuredWhops: "", caseStudies: "", reviews: "",
      priceRange: "$3k-$15k", languages: "English,Spanish", responseTime: "Within 24 hours", contactEmail: "nina@growthlab.co",
      internalTags: "growth-specialist", recommendedFor: "Communities,Memberships",
      specialties: ["Marketing", "Community Building", "Analytics"], avgRating: 4.5, totalDeals: 8,
    }}),
    prisma.partner.create({ data: {
      name: "BuildStack", slug: "buildstack", user: { connect: { id: partnerUsers[2].id } }, partnerType: "Freelancer", tier: "Gold", status: "active", location: "Remote",
      tagline: "Technical integration specialist for Whop API", description: "Technical integration specialist for Whop API and custom development.",
      categories: "Development,API Integration,Automation", industries: "SaaS,FinTech,E-commerce", featuredWhops: "", caseStudies: "", reviews: "",
      priceRange: "$2k-$20k", languages: "English", responseTime: "Within 12 hours", contactEmail: "tom@buildstack.dev",
      internalTags: "api-expert,fast-turnaround", recommendedFor: "API Integration,Custom Development",
      specialties: ["Development", "API Integration", "Automation"], avgRating: 4.9, totalDeals: 15,
    }}),
    prisma.partner.create({ data: {
      name: "Launchpad Agency", slug: "launchpad-agency", user: { connect: { id: partnerUsers[3].id } }, partnerType: "Agency", tier: "Silver", status: "active", location: "New York, NY",
      tagline: "End-to-end launch strategy for digital creators", description: "End-to-end launch strategy for digital creators and course builders.",
      categories: "Strategy,Launch Planning,Sales Page Design", industries: "Education,Coaching,Digital Products", featuredWhops: "", caseStudies: "", reviews: "",
      priceRange: "$5k-$30k", languages: "English", responseTime: "Within 48 hours", contactEmail: "lisa@contentwave.co",
      internalTags: "launch-specialist", recommendedFor: "Course Launches,Product Launches",
      specialties: ["Strategy", "Launch Planning", "Sales Page Design"], avgRating: 4.3, totalDeals: 6,
    }}),
    prisma.partner.create({ data: {
      name: "ContentWave", slug: "contentwave", user: { connect: { id: partnerUsers[4].id } }, partnerType: "Agency", tier: "Bronze", status: "active", location: "Los Angeles, CA",
      tagline: "Content creation and social media for Whop businesses", description: "Content creation and social media management for Whop businesses.",
      categories: "Content,Social Media,Video Production", industries: "Entertainment,Fitness,Lifestyle", featuredWhops: "", caseStudies: "", reviews: "",
      priceRange: "$1k-$10k", languages: "English,French", responseTime: "Within 24 hours", contactEmail: "omar@launchpad.agency",
      internalTags: "content-creator", recommendedFor: "Social Media,Content Strategy",
      specialties: ["Content", "Social Media", "Video Production"], avgRating: 4.1, totalDeals: 3,
    }}),
  ]);
  console.log("Partners created");

  await prisma.camAssignment.create({ data: { cam: { connect: { id: cam1.id } }, partner: { connect: { id: partners[0].id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: cam1.id } }, partner: { connect: { id: partners[1].id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: cam1.id } }, partner: { connect: { id: partners[3].id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: cam2.id } }, partner: { connect: { id: partners[2].id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: cam2.id } }, partner: { connect: { id: partners[4].id } } } });
  console.log("CAM assignments created");

  const deals = await Promise.all([
    prisma.deal.create({ data: { name: "MasterClass Hub", businessName: "MasterClass Online", businessContact: "Sarah Wilson", businessEmail: "sarah@masterclass.io", estimatedValue: 12000, monthlyProcessing: 5000, probability: 40, stage: "New Opportunity", partner: { connect: { id: partners[1].id } }, cam: { connect: { id: cam1.id } } } }),
    prisma.deal.create({ data: { name: "YogaFlow Digital Studio", businessName: "YogaFlow", businessContact: "Emma Roberts", businessEmail: "emma@yogaflow.com", estimatedValue: 20000, monthlyProcessing: 8000, probability: 75, stage: "In Discussion", partner: { connect: { id: partners[3].id } }, cam: { connect: { id: cam1.id } } } }),
    prisma.deal.create({ data: { name: "CreatorSchool Content Platform", businessName: "CreatorSchool", businessContact: "David Kim", businessEmail: "david@creatorschool.co", estimatedValue: 6000, monthlyProcessing: 3000, probability: 85, stage: "Qualified", partner: { connect: { id: partners[4].id } }, cam: { connect: { id: cam2.id } } } }),
    prisma.deal.create({ data: { name: "FitLife Pro Whop Setup", businessName: "FitLife Pro", businessContact: "Mike Chen", businessEmail: "mike@fitlifepro.com", estimatedValue: 15000, monthlyProcessing: 6000, probability: 80, stage: "Qualified", partner: { connect: { id: partners[0].id } }, cam: { connect: { id: cam1.id } } } }),
    prisma.deal.create({ data: { name: "CryptoEdge Trading Community", businessName: "CryptoEdge", businessContact: "Alex Turner", businessEmail: "alex@cryptoedge.io", estimatedValue: 25000, monthlyProcessing: 12000, probability: 60, stage: "In Discussion", partner: { connect: { id: partners[0].id } }, cam: { connect: { id: cam1.id } } } }),
    prisma.deal.create({ data: { name: "FinanceGuru Membership", businessName: "FinanceGuru", businessContact: "Rachel Green", businessEmail: "rachel@financeguru.com", estimatedValue: 18000, monthlyProcessing: 7000, probability: 50, stage: "In Discussion", partner: { connect: { id: partners[2].id } }, cam: { connect: { id: cam2.id } } } }),
    prisma.deal.create({ data: { name: "BeatMakers Collective", businessName: "BeatMakers", businessContact: "James Brown", businessEmail: "james@beatmakers.co", estimatedValue: 10000, monthlyProcessing: 4000, probability: 30, stage: "Long Term Nurture", partner: { connect: { id: partners[3].id } }, cam: { connect: { id: cam1.id } } } }),
    prisma.deal.create({ data: { name: "ScaleUp SaaS Academy", businessName: "ScaleUp", businessContact: "Lisa Park", businessEmail: "lisa@scaleup.dev", estimatedValue: 8000, monthlyProcessing: 3500, probability: 90, stage: "Closed Won", partner: { connect: { id: partners[1].id } }, cam: { connect: { id: cam1.id } } } }),
    prisma.deal.create({ data: { name: "TechTalk Premium Community", businessName: "TechTalk", businessContact: "Ryan Cole", businessEmail: "ryan@techtalk.io", estimatedValue: 35000, monthlyProcessing: 15000, probability: 10, stage: "Closed Lost", partner: { connect: { id: partners[0].id } }, cam: { connect: { id: cam1.id } } } }),
    prisma.deal.create({ data: { name: "AlgoTrade Pro Integration", businessName: "AlgoTrade", businessContact: "Chris Lee", businessEmail: "chris@algotrade.com", estimatedValue: 50000, monthlyProcessing: 20000, probability: 70, stage: "Qualified", partner: { connect: { id: partners[2].id } }, cam: { connect: { id: cam2.id } } } }),
  ]);
  console.log("Deals created");

  await Promise.all([
    prisma.dealActivity.create({ data: { deal: { connect: { id: deals[3].id } }, author: { connect: { id: partnerUsers[0].id } }, type: "message", content: "Initial call went great. Mike is excited about the platform." } }),
    prisma.dealActivity.create({ data: { deal: { connect: { id: deals[3].id } }, author: { connect: { id: cam1.id } }, type: "message", content: "Proposal looks solid. Bump the timeline estimate by a week." } }),
    prisma.dealActivity.create({ data: { deal: { connect: { id: deals[3].id } }, author: { connect: { id: partnerUsers[0].id } }, type: "stage_change", content: "Moved from In Discussion to Qualified" } }),
    prisma.dealActivity.create({ data: { deal: { connect: { id: deals[4].id } }, author: { connect: { id: partnerUsers[0].id } }, type: "message", content: "Alex wants Discord bot integration. Scoping technical requirements." } }),
    prisma.dealActivity.create({ data: { deal: { connect: { id: deals[7].id } }, author: { connect: { id: cam1.id } }, type: "stage_change", content: "Deal closed! First payment received." } }),
  ]);
  console.log("Deal activities created");

  const bounty1 = await prisma.bounty.create({ data: { title: "Q1 Deal Blitz", description: "Register 5 new deals in Q1 2025", reward: "$500 bonus + Featured Listing", target: 5, metric: "deals_registered", endDate: new Date("2025-03-31"), isActive: true } });
  const bounty2 = await prisma.bounty.create({ data: { title: "Revenue Champion", description: "Close $50,000 in total deal value", reward: "$1,000 bonus + Gold Badge", target: 50000, metric: "revenue", endDate: new Date("2025-06-30"), isActive: true } });
  const bounty3 = await prisma.bounty.create({ data: { title: "Community Builder", description: "Refer 3 new partners to the network", reward: "Priority Support + Swag Pack", target: 3, metric: "referrals", endDate: new Date("2025-04-30"), isActive: true } });
  console.log("Bounties created");

  await Promise.all([
    prisma.bountyProgress.create({ data: { bounty: { connect: { id: bounty1.id } }, partner: { connect: { id: partners[0].id } }, current: 3, completed: false } }),
    prisma.bountyProgress.create({ data: { bounty: { connect: { id: bounty1.id } }, partner: { connect: { id: partners[1].id } }, current: 2, completed: false } }),
    prisma.bountyProgress.create({ data: { bounty: { connect: { id: bounty1.id } }, partner: { connect: { id: partners[2].id } }, current: 5, completed: true } }),
    prisma.bountyProgress.create({ data: { bounty: { connect: { id: bounty2.id } }, partner: { connect: { id: partners[0].id } }, current: 15000, completed: false } }),
    prisma.bountyProgress.create({ data: { bounty: { connect: { id: bounty2.id } }, partner: { connect: { id: partners[2].id } }, current: 8000, completed: false } }),
    prisma.bountyProgress.create({ data: { bounty: { connect: { id: bounty3.id } }, partner: { connect: { id: partners[0].id } }, current: 1, completed: false } }),
    prisma.bountyProgress.create({ data: { bounty: { connect: { id: bounty3.id } }, partner: { connect: { id: partners[3].id } }, current: 3, completed: true } }),
  ]);
  console.log("Bounty progress created");

  await Promise.all([
    prisma.notification.create({ data: { user: { connect: { id: cam1.id } }, type: "deal_registered", title: "New Deal Registered", message: "PixelForge Studios registered FitLife Pro Whop Setup", link: "/am/pipeline" } }),
    prisma.notification.create({ data: { user: { connect: { id: cam1.id } }, type: "deal_registered", title: "New Deal Registered", message: "PixelForge Studios registered CryptoEdge Trading Community", link: "/am/pipeline" } }),
    prisma.notification.create({ data: { user: { connect: { id: cam2.id } }, type: "deal_registered", title: "New Deal Registered", message: "BuildStack registered FinanceGuru Membership", link: "/am/pipeline" } }),
    prisma.notification.create({ data: { user: { connect: { id: admin.id } }, type: "application", title: "New Partner Application", message: "New application from TechVault Solutions", link: "/admin/submissions" } }),
  ]);
  console.log("Notifications created");

  await Promise.all([
    prisma.partnerApplication.create({ data: { companyName: "TechVault Solutions", contactName: "Amanda Foster", contactEmail: "amanda@techvault.io", partnerType: "Agency", website: "https://techvault.io", description: "Enterprise SaaS consulting firm looking to expand into Whop ecosystem.", status: "pending" } }),
    prisma.partnerApplication.create({ data: { companyName: "DigitalNomad Studio", contactName: "Carlos Rivera", contactEmail: "carlos@digitalnomad.studio", partnerType: "Freelancer", website: "https://digitalnomad.studio", description: "Freelance designer specializing in digital product launches.", status: "pending" } }),
    prisma.partnerApplication.create({ data: { companyName: "GrowthEngine Labs", contactName: "Priya Sharma", contactEmail: "priya@growthengine.io", partnerType: "Agency", website: "https://growthengine.io", description: "Full-stack growth agency with experience in membership platforms.", status: "pending" } }),
  ]);
  console.log("Partner applications created");

  console.log("\n✅ Seed complete! Demo credentials:");
  console.log("  Admin:    admin@whop.com / admin123");
  console.log("  CAM 1:    cam1@whop.com / cam123");
  console.log("  Partner:  jake@pixelforge.io / partner123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
