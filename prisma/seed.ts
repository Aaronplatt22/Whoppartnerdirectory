import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const passwordHash = await hash("admin-changeme", 10);
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin",
        role: "admin",
        passwordHash,
      },
    });
    console.log("Seeded first admin: admin@example.com / admin-changeme");
  }

  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    await prisma.partner.create({
      data: {
        slug: "whop-growth-labs",
        name: "Whop Growth Labs",
        logo: "/logos/wgl.svg",
        coverImage: "",
        tagline: "We turn Whops into money machines. Period.",
        description:
          "Full-service growth agency specializing exclusively in the Whop ecosystem. We've helped 50+ creators scale from $0 to $50K/mo.",
        partnerType: "agency",
        categories: JSON.stringify(["Growth Strategy", "Paid Acquisition", "Community Building"]),
        industries: JSON.stringify(["Trading", "Education", "Fitness"]),
        featuredWhops: JSON.stringify([{ name: "Alpha Signals", logo: "" }, { name: "FitnessPro Academy", logo: "" }]),
        caseStudies: JSON.stringify([
          { title: "Alpha Signals: $3K to $47K MRR in 90 Days", summary: "Rebuilt sales page, launched TikTok ad funnel.", metrics: { revenue: "+1,467%" }, whopName: "Alpha Signals" },
        ]),
        reviews: JSON.stringify([
          { rating: 5, text: "These guys literally changed my life.", reviewerName: "Marcus T.", whopName: "Alpha Signals", date: "2025-01-15" },
        ]),
        avgRating: 4.7,
        reviewCount: 23,
        priceRange: "$$$",
        location: "Miami, FL",
        timezone: "EST",
        languages: JSON.stringify(["English", "Spanish"]),
        responseTime: "< 24 hours",
        contactEmail: "hello@whopgrowthlabs.com",
        website: "https://whopgrowthlabs.com",
        calendlyLink: "https://calendly.com/whop-growth-labs",
        internalNotes: "Top performer.",
        internalTags: JSON.stringify(["Top Performer"]),
        recommendedFor: JSON.stringify(["high-revenue", "scaling"]),
      },
    });
    await prisma.partner.create({
      data: {
        slug: "pixel-forge-studio",
        name: "Pixel Forge Studio",
        logo: "/logos/pixel.svg",
        coverImage: "",
        tagline: "Sales pages that convert browsers into buyers.",
        description: "We design high-converting Whop sales pages and brand identities.",
        partnerType: "service_provider",
        categories: JSON.stringify(["Sales Page Design", "Branding & Creative"]),
        industries: JSON.stringify(["Trading", "Education", "SaaS"]),
        featuredWhops: JSON.stringify([{ name: "TradingHub Pro", logo: "" }]),
        caseStudies: JSON.stringify([]),
        reviews: JSON.stringify([]),
        avgRating: 4.9,
        reviewCount: 12,
        priceRange: "$$",
        location: "Remote",
        timezone: "EST",
        languages: JSON.stringify(["English"]),
        responseTime: "< 24 hours",
        contactEmail: "hello@pixelforge.com",
        website: "https://pixelforge.com",
        calendlyLink: null,
        internalNotes: "",
        internalTags: JSON.stringify([]),
        recommendedFor: JSON.stringify([]),
      },
    });
    console.log("Seeded 2 sample partners");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
