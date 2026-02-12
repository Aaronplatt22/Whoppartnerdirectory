const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
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
  console.log("Cleared old data");

  var ah = await bcrypt.hash("admin123", 10);
  var ch = await bcrypt.hash("cam123", 10);
  var ph = await bcrypt.hash("partner123", 10);

  var admin = await prisma.user.create({ data: { name: "Admin User", email: "admin@whop.com", passwordHash: ah, role: "admin" } });
  var c1 = await prisma.user.create({ data: { name: "Sarah Chen", email: "cam1@whop.com", passwordHash: ch, role: "account_manager" } });
  var c2 = await prisma.user.create({ data: { name: "Marcus Johnson", email: "cam2@whop.com", passwordHash: ch, role: "account_manager" } });
  var u0 = await prisma.user.create({ data: { name: "Jake Morrison", email: "jake@pixelforge.io", passwordHash: ph, role: "partner" } });
  var u1 = await prisma.user.create({ data: { name: "Nina Patel", email: "nina@growthlab.co", passwordHash: ph, role: "partner" } });
  var u2 = await prisma.user.create({ data: { name: "Tom Reeves", email: "tom@buildstack.dev", passwordHash: ph, role: "partner" } });
  var u3 = await prisma.user.create({ data: { name: "Lisa Nguyen", email: "lisa@contentwave.co", passwordHash: ph, role: "partner" } });
  var u4 = await prisma.user.create({ data: { name: "Omar Farouk", email: "omar@launchpad.agency", passwordHash: ph, role: "partner" } });
  console.log("Users created");

  var p0 = await prisma.partner.create({ data: {
    name: "PixelForge Studios", slug: "pixelforge-studios",
    user: { connect: { id: u0.id } },
    partnerType: "Agency", tier: "Gold", location: "San Francisco, CA",
    tagline: "Full-service creative agency for Whop storefronts",
    description: "Full-service creative agency specializing in Whop storefronts and digital products.",
    categories: "Design,Development,Marketing", industries: "E-commerce,Digital Products,Education",
    featuredWhops: "", caseStudies: "", reviews: "",
    priceRange: "$5k-$25k", languages: "English", responseTime: "Within 24 hours",
    contactEmail: "jake@pixelforge.io", internalTags: "top-performer,design-specialist",
    recommendedFor: "Storefronts,Digital Products", avgRating: 4.8, totalDeals: 12,
  }});
  console.log("Partner 1 done");

  var p1 = await prisma.partner.create({ data: {
    name: "GrowthLab", slug: "growthlab",
    user: { connect: { id: u1.id } },
    partnerType: "Agency", tier: "Silver", location: "Austin, TX",
    tagline: "Growth marketing for communities and creators",
    description: "Growth marketing agency focused on community building and monetization.",
    categories: "Marketing,Community Building,Analytics", industries: "SaaS,Communities,Coaching",
    featuredWhops: "", caseStudies: "", reviews: "",
    priceRange: "$3k-$15k", languages: "English,Spanish", responseTime: "Within 24 hours",
    contactEmail: "nina@growthlab.co", internalTags: "growth-specialist",
    recommendedFor: "Communities,Memberships", avgRating: 4.5, totalDeals: 8,
  }});
  console.log("Partner 2 done");

  var p2 = await prisma.partner.create({ data: {
    name: "BuildStack", slug: "buildstack",
    user: { connect: { id: u2.id } },
    partnerType: "Freelancer", tier: "Gold", location: "Remote",
    tagline: "Technical integration specialist for Whop API",
    description: "Technical integration specialist for Whop API and custom development.",
    categories: "Development,API Integration,Automation", industries: "SaaS,FinTech,E-commerce",
    featuredWhops: "", caseStudies: "", reviews: "",
    priceRange: "$2k-$20k", languages: "English", responseTime: "Within 12 hours",
    contactEmail: "tom@buildstack.dev", internalTags: "api-expert,fast-turnaround",
    recommendedFor: "API Integration,Custom Development", avgRating: 4.9, totalDeals: 15,
  }});
  console.log("Partner 3 done");

  var p3 = await prisma.partner.create({ data: {
    name: "Launchpad Agency", slug: "launchpad-agency",
    user: { connect: { id: u3.id } },
    partnerType: "Agency", tier: "Silver", location: "New York, NY",
    tagline: "End-to-end launch strategy for digital creators",
    description: "End-to-end launch strategy for digital creators and course builders.",
    categories: "Strategy,Launch Planning,Sales Page Design", industries: "Education,Coaching,Digital Products",
    featuredWhops: "", caseStudies: "", reviews: "",
    priceRange: "$5k-$30k", languages: "English", responseTime: "Within 48 hours",
    contactEmail: "lisa@contentwave.co", internalTags: "launch-specialist",
    recommendedFor: "Course Launches,Product Launches", avgRating: 4.3, totalDeals: 6,
  }});
  console.log("Partner 4 done");

  var p4 = await prisma.partner.create({ data: {
    name: "ContentWave", slug: "contentwave",
    user: { connect: { id: u4.id } },
    partnerType: "Agency", tier: "Bronze", location: "Los Angeles, CA",
    tagline: "Content creation and social media for Whop businesses",
    description: "Content creation and social media management for Whop businesses.",
    categories: "Content,Social Media,Video Production", industries: "Entertainment,Fitness,Lifestyle",
    featuredWhops: "", caseStudies: "", reviews: "",
    priceRange: "$1k-$10k", languages: "English,French", responseTime: "Within 24 hours",
    contactEmail: "omar@launchpad.agency", internalTags: "content-creator",
    recommendedFor: "Social Media,Content Strategy", avgRating: 4.1, totalDeals: 3,
  }});
  console.log("Partners created");

  await prisma.camAssignment.create({ data: { cam: { connect: { id: c1.id } }, partner: { connect: { id: p0.id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: c1.id } }, partner: { connect: { id: p1.id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: c1.id } }, partner: { connect: { id: p3.id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: c2.id } }, partner: { connect: { id: p2.id } } } });
  await prisma.camAssignment.create({ data: { cam: { connect: { id: c2.id } }, partner: { connect: { id: p4.id } } } });
  console.log("CAM assignments created");

  var d0 = await prisma.deal.create({ data: { name: "MasterClass Hub", businessName: "MasterClass Online", businessContact: "Sarah Wilson", businessEmail: "sarah@masterclass.io", estimatedValue: 12000, monthlyProcessing: 5000, probability: 40, stage: "New Opportunity", partner: { connect: { id: p1.id } }, cam: { connect: { id: c1.id } } } });
  var d1 = await prisma.deal.create({ data: { name: "YogaFlow Digital Studio", businessName: "YogaFlow", businessContact: "Emma Roberts", businessEmail: "emma@yogaflow.com", estimatedValue: 20000, monthlyProcessing: 8000, probability: 75, stage: "In Discussion", partner: { connect: { id: p3.id } }, cam: { connect: { id: c1.id } } } });
  var d2 = await prisma.deal.create({ data: { name: "CreatorSchool Platform", businessName: "CreatorSchool", businessContact: "David Kim", businessEmail: "david@creatorschool.co", estimatedValue: 6000, monthlyProcessing: 3000, probability: 85, stage: "Qualified", partner: { connect: { id: p4.id } }, cam: { connect: { id: c2.id } } } });
  var d3 = await prisma.deal.create({ data: { name: "FitLife Pro Whop Setup", businessName: "FitLife Pro", businessContact: "Mike Chen", businessEmail: "mike@fitlifepro.com", estimatedValue: 15000, monthlyProcessing: 6000, probability: 80, stage: "Qualified", partner: { connect: { id: p0.id } }, cam: { connect: { id: c1.id } } } });
  var d4 = await prisma.deal.create({ data: { name: "CryptoEdge Trading Community", businessName: "CryptoEdge", businessContact: "Alex Turner", businessEmail: "alex@cryptoedge.io", estimatedValue: 25000, monthlyProcessing: 12000, probability: 60, stage: "In Discussion", partner: { connect: { id: p0.id } }, cam: { connect: { id: c1.id } } } });
  var d5 = await prisma.deal.create({ data: { name: "FinanceGuru Membership", businessName: "FinanceGuru", businessContact: "Rachel Green", businessEmail: "rachel@financeguru.com", estimatedValue: 18000, monthlyProcessing: 7000, probability: 50, stage: "In Discussion", partner: { connect: { id: p2.id } }, cam: { connect: { id: c2.id } } } });
  var d6 = await prisma.deal.create({ data: { name: "BeatMakers Collective", businessName: "BeatMakers", businessContact: "James Brown", businessEmail: "james@beatmakers.co", estimatedValue: 10000, monthlyProcessing: 4000, probability: 30, stage: "Long Term Nurture", partner: { connect: { id: p3.id } }, cam: { connect: { id: c1.id } } } });
  var d7 = await prisma.deal.create({ data: { name: "ScaleUp SaaS Academy", businessName: "ScaleUp", businessContact: "Lisa Park", businessEmail: "lisa@scaleup.dev", estimatedValue: 8000, monthlyProcessing: 3500, probability: 90, stage: "Closed Won", partner: { connect: { id: p1.id } }, cam: { connect: { id: c1.id } } } });
  var d8 = await prisma.deal.create({ data: { name: "TechTalk Premium Community", businessName: "TechTalk", businessContact: "Ryan Cole", businessEmail: "ryan@techtalk.io", estimatedValue: 35000, monthlyProcessing: 15000, probability: 10, stage: "Closed Lost", partner: { connect: { id: p0.id } }, cam: { connect: { id: c1.id } } } });
  var d9 = await prisma.deal.create({ data: { name: "AlgoTrade Pro Integration", businessName: "AlgoTrade", businessContact: "Chris Lee", businessEmail: "chris@algotrade.com", estimatedValue: 50000, monthlyProcessing: 20000, probability: 70, stage: "Qualified", partner: { connect: { id: p2.id } }, cam: { connect: { id: c2.id } } } });
  console.log("Deals created");

  await prisma.dealActivity.create({ data: { deal: { connect: { id: d3.id } }, author: { connect: { id: u0.id } }, type: "message", content: "Initial call went great. Mike is excited about the platform." } });
  await prisma.dealActivity.create({ data: { deal: { connect: { id: d3.id } }, author: { connect: { id: c1.id } }, type: "message", content: "Proposal looks solid. Bump the timeline estimate by a week." } });
  await prisma.dealActivity.create({ data: { deal: { connect: { id: d3.id } }, author: { connect: { id: u0.id } }, type: "stage_change", content: "Moved from In Discussion to Qualified" } });
  await prisma.dealActivity.create({ data: { deal: { connect: { id: d4.id } }, author: { connect: { id: u0.id } }, type: "message", content: "Alex wants Discord bot integration. Scoping technical requirements." } });
  await prisma.dealActivity.create({ data: { deal: { connect: { id: d7.id } }, author: { connect: { id: c1.id } }, type: "stage_change", content: "Deal closed! First payment received." } });
  console.log("Deal activities created");

  var b1 = await prisma.bounty.create({ data: { title: "Q1 Deal Blitz", description: "Register 5 new deals in Q1 2025", reward: "$500 bonus + Featured Listing", target: 5, type: "deals_registered", startDate: new Date("2025-01-01"), endDate: new Date("2025-03-31"), isActive: true } });
  var b2 = await prisma.bounty.create({ data: { title: "Revenue Champion", description: "Close $50,000 in total deal value", reward: "$1,000 bonus + Gold Badge", target: 50000, type: "revenue", startDate: new Date("2025-01-01"), endDate: new Date("2025-06-30"), isActive: true } });
  var b3 = await prisma.bounty.create({ data: { title: "Community Builder", description: "Refer 3 new partners to the network", reward: "Priority Support + Swag Pack", target: 3, type: "referrals", startDate: new Date("2025-02-01"), endDate: new Date("2025-04-30"), isActive: true } });
  console.log("Bounties created");

  await prisma.bountyProgress.create({ data: { bounty: { connect: { id: b1.id } }, partner: { connect: { id: p0.id } }, current: 3, completed: false } });
  await prisma.bountyProgress.create({ data: { bounty: { connect: { id: b1.id } }, partner: { connect: { id: p1.id } }, current: 2, completed: false } });
  await prisma.bountyProgress.create({ data: { bounty: { connect: { id: b1.id } }, partner: { connect: { id: p2.id } }, current: 5, completed: true } });
  await prisma.bountyProgress.create({ data: { bounty: { connect: { id: b2.id } }, partner: { connect: { id: p0.id } }, current: 15000, completed: false } });
  await prisma.bountyProgress.create({ data: { bounty: { connect: { id: b2.id } }, partner: { connect: { id: p2.id } }, current: 8000, completed: false } });
  await prisma.bountyProgress.create({ data: { bounty: { connect: { id: b3.id } }, partner: { connect: { id: p0.id } }, current: 1, completed: false } });
  await prisma.bountyProgress.create({ data: { bounty: { connect: { id: b3.id } }, partner: { connect: { id: p3.id } }, current: 3, completed: true } });
  console.log("Bounty progress created");

  await prisma.notification.create({ data: { user: { connect: { id: c1.id } }, type: "deal_registered", title: "New Deal Registered", message: "PixelForge Studios registered FitLife Pro Whop Setup", link: "/am/pipeline" } });
  await prisma.notification.create({ data: { user: { connect: { id: c1.id } }, type: "deal_registered", title: "New Deal Registered", message: "PixelForge Studios registered CryptoEdge Trading Community", link: "/am/pipeline" } });
  await prisma.notification.create({ data: { user: { connect: { id: c2.id } }, type: "deal_registered", title: "New Deal Registered", message: "BuildStack registered FinanceGuru Membership", link: "/am/pipeline" } });
  await prisma.notification.create({ data: { user: { connect: { id: admin.id } }, type: "application", title: "New Partner Application", message: "New application from TechVault Solutions", link: "/admin/submissions" } });
  console.log("Notifications created");

  // PartnerApplication uses: name, email, company, interest (actual schema fields)
  await prisma.partnerApplication.create({ data: { name: "Amanda Foster", email: "amanda@techvault.io", company: "TechVault Solutions", status: "pending", interest: "Enterprise SaaS consulting firm looking to expand into Whop ecosystem." } });
  await prisma.partnerApplication.create({ data: { name: "Carlos Rivera", email: "carlos@digitalnomad.studio", company: "DigitalNomad Studio", status: "pending", interest: "Freelance designer specializing in digital product launches." } });
  await prisma.partnerApplication.create({ data: { name: "Priya Sharma", email: "priya@growthengine.io", company: "GrowthEngine Labs", status: "pending", interest: "Full-stack growth agency with experience in membership platforms." } });
  console.log("Partner applications created");

  console.log("");
  console.log("SEED COMPLETE");
  console.log("  Admin:    admin@whop.com / admin123");
  console.log("  CAM 1:    cam1@whop.com / cam123");
  console.log("  CAM 2:    cam2@whop.com / cam123");
  console.log("  Partner:  jake@pixelforge.io / partner123");
}

main()
  .then(function() { return prisma.$disconnect(); })
  .catch(function(e) { console.error(e); prisma.$disconnect(); process.exit(1); });
