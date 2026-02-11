import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
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

  // Hash passwords
  const adminHash = await bcrypt.hash("admin123", 10);
  const camHash = await bcrypt.hash("cam123", 10);
  const partnerHash = await bcrypt.hash("partner123", 10);

  // Create users
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

  // Create partners
  const partners = await Promise.all([
    prisma.partner.create({ data: { name: "PixelForge Studios", userId: partnerUsers[0].id, partnerType: "Agency", tier: "Gold", status: "active", location: "San Francisco, CA", description: "Full-service creative agency specializing in Whop storefronts and digital products.", specialties: ["Design", "Development", "Marketing"], avgRating: 4.8, totalDeals: 12 } }),
    prisma.partner.create({ data: { name: "GrowthLab", userId: partnerUsers[1].id, partnerType: "Agency", tier: "Silver", status: "active", location: "Austin, TX", description: "Growth marketing agency focused on community building and monetization.", specialties: ["Marketing", "Community Building", "Analytics"], avgRating: 4.5, totalDeals: 8 } }),
    prisma.partner.create({ data: { name: "BuildStack", userId: partnerUsers[2].id, partnerType: "Freelancer", tier: "Gold", status: "active", location: "Remote", description: "Technical integration specialist for Whop API and custom development.", specialties: ["Development", "API Integration", "Automation"], avgRating: 4.9, totalDeals: 15 } }),
    prisma.partner.create({ data: { name: "Launchpad Agency", userId: partnerUsers[3].id, partnerType: "Agency", tier: "Silver", status: "active", location: "New York, NY", description: "End-to-end launch strategy for digital creators and course builders.", specialties: ["Strategy", "Launch Planning", "Sales Page Design"], avgRating: 4.3, totalDeals: 6 } }),
    prisma.partner.create({ data: { name: "ContentWave", userId: partnerUsers[4].id, partnerType: "Agency", tier: "Bronze", status: "active", location: "Los Angeles, CA", description: "Content creation and social media management for Whop businesses.", specialties: ["Content", "Social Media", "Video Production"], avgRating: 4.1, totalDeals: 3 } }),
  ]);
  console.log("Partners created");

  // CAM Assignments
  await prisma.camAssignment.create({ data: { camId: cam1.id, partnerId: partners[0].id } });
  await prisma.camAssignment.create({ data: { camId: cam1.id, partnerId: partners[1].id } });
  await prisma.camAssignment.create({ data: { camId: cam1.id, partnerId: partners[3].id } });
  await prisma.camAssignment.create({ data: { camId: cam2.id, partnerId: partners[2].id } });
  await prisma.camAssignment.create({ data: { camId: cam2.id, partnerId: partners[4].id } });
  console.log("CAM assignments created");

  // Deals
  const deals = await Promise.all([
    prisma.deal.create({ data: { name: "MasterClass Hub", businessName: "MasterClass Online", businessContact: "Sarah Wilson", businessEmail: "sarah@masterclass.io", estimatedValue: 12000, monthlyProcessing: 5000, probability: 40, stage: "New Opportunity", partnerId: partners[1].id, camId: cam1.id } }),
    prisma.deal.create({ data: { name: "YogaFlow Digital Studio", businessName: "YogaFlow", businessContact: "Emma Roberts", businessEmail: "emma@yogaflow.com", estimatedValue: 20000, monthlyProcessing: 8000, probability: 75, stage: "In Discussion", partnerId: partners[3].id, camId: cam1.id } }),
    prisma.deal.create({ data: { name: "CreatorSchool Content Platform", businessName: "CreatorSchool", businessContact: "David Kim", businessEmail: "david@creatorschool.co", estimatedValue: 6000, monthlyProcessing: 3000, probability: 85, stage: "Qualified", partnerId: partners[4].id, camId: cam2.id } }),
    prisma.deal.create({ data: { name: "FitLife Pro Whop Setup", businessName: "FitLife Pro", businessContact: "Mike Chen", businessEmail: "mike@fitlifepro.com", estimatedValue: 15000, monthlyProcessing: 6000, probability: 80, stage: "Qualified", partnerId: partners[0].id, camId: cam1.id } }),
    prisma.deal.create({ data: { name: "CryptoEdge Trading Community", businessName: "CryptoEdge", businessContact: "Alex Turner", businessEmail: "alex@cryptoedge.io", estimatedValue: 25000, monthlyProcessing: 12000, probability: 60, stage: "In Discussion", partnerId: partners[0].id, camId: cam1.id } }),
    prisma.deal.create({ data: { name: "FinanceGuru Membership", businessName: "FinanceGuru", businessContact: "Rachel Green", businessEmail: "rachel@financeguru.com", estimatedValue: 18000, monthlyProcessing: 7000, probability: 50, stage: "In Discussion", partnerId: partners[2].id, camId: cam2.id } }),
    prisma.deal.create({ data: { name: "BeatMakers Collective", businessName: "BeatMakers", businessContact: "James Brown", businessEmail: "james@beatmakers.co", estimatedValue: 10000, monthlyProcessing: 4000, probability: 30, stage: "Long Term Nurture", partnerId: partners[3].id, camId: cam1.id } }),
    prisma.deal.create({ data: { name: "ScaleUp SaaS Academy", businessName: "ScaleUp", businessContact: "Lisa Park", businessEmail: "lisa@scaleup.dev", estimatedValue: 8000, monthlyProcessing: 3500, probability: 90, stage: "Closed Won", partnerId: partners[1].id, camId: cam1.id } }),
    prisma.deal.create({ data: { name: "TechTalk Premium Community", businessName: "TechTalk", businessContact: "Ryan Cole", businessEmail: "ryan@techtalk.io", estimatedValue: 35000, monthlyProcessing: 15000, probability: 10, stage: "Closed Lost", partnerId: partners[0].id, camId: cam1.id } }),
    prisma.deal.create({ data: { name: "AlgoTrade Pro Integration", businessName: "AlgoTrade", businessContact: "Chris Lee", businessEmail: "chris@algotrade.com", estimatedValue: 50000, monthlyProcessing: 20000, probability: 70, stage: "Qualified", partnerId: partners[2].id, camId: cam2.id } }),
  ]);
  console.log("Deals created");

  // Deal Activities
  await Promise.all([
    prisma.dealActivity.create({ data: { dealId: deals[3].id, authorId: partnerUsers[0].id, type: "message", content: "Initial call went great. Mike is excited about the platform." } }),
    prisma.dealActivity.create({ data: { dealId: deals[3].id, authorId: cam1.id, type: "message", content: "Proposal looks solid. Bump the timeline estimate by a week." } }),
    prisma.dealActivity.create({ data: { dealId: deals[3].id, authorId: partnerUsers[0].id, type: "stage_change", content: "Moved from In Discussion to Qualified" } }),
    prisma.dealActivity.create({ data: { dealId: deals[4].id, authorId: partnerUsers[0].id, type: "message", content: "Alex wants Discord bot integration. Scoping technical requirements." } }),
    prisma.dealActivity.create({ data: { dealId: deals[7].id, authorId: cam1.id, type: "stage_change", content: "Deal closed! First payment received." } }),
  ]);
  console.log("Deal activities created");

  // Bounties
  const bounty1 = await prisma.bounty.create({ data: { title: "Q1 Deal Blitz", description: "Register 5 new deals in Q1 2025", reward: "$500 bonus + Featured Listing", target: 5, metric: "deals_registered", endDate: new Date("2025-03-31"), isActive: true } });
  const bounty2 = await prisma.bounty.create({ data: { title: "Revenue Champion", description: "Close $50,000 in total deal value", reward: "$1,000 bonus + Gold Badge", target: 50000, metric: "revenue", endDate: new Date("2025-06-30"), isActive: true } });
  const bounty3 = await prisma.bounty.create({ data: { title: "Community Builder", description: "Refer 3 new partners to the network", reward: "Priority Support + Swag Pack", target: 3, metric: "referrals", endDate: new Date("2025-04-30"), isActive: true } });
  console.log("Bounties created");

  // Bounty Progress
  await Promise.all([
    prisma.bountyProgress.create({ data: { bountyId: bounty1.id, partnerId: partners[0].id, current: 3, completed: false } }),
    prisma.bountyProgress.create({ data: { bountyId: bounty1.id, partnerId: partners[1].id, current: 2, completed: false } }),
    prisma.bountyProgress.create({ data: { bountyId: bounty1.id, partnerId: partners[2].id, current: 5, completed: true } }),
    prisma.bountyProgress.create({ data: { bountyId: bounty2.id, partnerId: partners[0].id, current: 15000, completed: false } }),
    prisma.bountyProgress.create({ data: { bountyId: bounty2.id, partnerId: partners[2].id, current: 8000, completed: false } }),
    prisma.bountyProgress.create({ data: { bountyId: bounty3.id, partnerId: partners[0].id, current: 1, completed: false } }),
    prisma.bountyProgress.create({ data: { bountyId: bounty3.id, partnerId: partners[3].id, current: 3, completed: true } }),
  ]);
  console.log("Bounty progress created");

  // Notifications
  await Promise.all([
    prisma.notification.create({ data: { userId: cam1.id, type: "deal_registered", title: "New Deal Registered", message: "PixelForge Studios registered FitLife Pro Whop Setup", link: "/am/pipeline" } }),
    prisma.notification.create({ data: { userId: cam1.id, type: "deal_registered", title: "New Deal Registered", message: "PixelForge Studios registered CryptoEdge Trading Community", link: "/am/pipeline" } }),
    prisma.notification.create({ data: { userId: cam2.id, type: "deal_registered", title: "New Deal Registered", message: "BuildStack registered FinanceGuru Membership", link: "/am/pipeline" } }),
    prisma.notification.create({ data: { userId: admin.id, type: "application", title: "New Partner Application", message: "New application from TechVault Solutions", link: "/admin/submissions" } }),
  ]);
  console.log("Notifications created");

  // Partner Applications
  await Promise.all([
    prisma.partnerApplication.create({ data: { companyName: "TechVault Solutions", contactName: "Amanda Foster", contactEmail: "amanda@techvault.io", partnerType: "Agency", website: "https://techvault.io", description: "Enterprise SaaS consulting firm looking to expand into Whop ecosystem.", status: "pending" } }),
    prisma.partnerApplication.create({ data: { companyName: "DigitalNomad Studio", contactName: "Carlos Rivera", contactEmail: "carlos@digitalnomad.studio", partnerType: "Freelancer", website: "https://digitalnomad.studio", description: "Freelance designer specializing in digital product launches.", status: "pending" } }),
    prisma.partnerApplication.create({ data: { companyName: "GrowthEngine Labs", contactName: "Priya Sharma", contactEmail: "priya@growthengine.io", partnerType: "Agency", website: "https://growthengine.io", description: "Full-stack growth agency with experience in membership platforms.", status: "pending" } }),
  ]);
  console.log("Partner applications created");

  console.log("\n✅ Seed complete! Demo credentials:");
  console.log("  Admin:    admin@whop.com / admin123");
  console.log("  CAM 1:    cam1@whop.com / cam123");
  console.log("  CAM 2:    cam2@whop.com / cam123");
  console.log("  Partner:  jake@pixelforge.io / partner123");
  console.log("  Partner:  nina@growthlab.co / partner123");
  console.log("  Partner:  tom@buildstack.dev / partner123");
  console.log("  Partner:  lisa@contentwave.co / partner123");
  console.log("  Partner:  omar@launchpad.agency / partner123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
