import { prisma } from "@/lib/prisma";
import type { Partner } from "@/lib/types";

function dbRowToPartner(row: {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  tagline: string;
  description: string;
  partnerType: string;
  categories: string;
  industries: string;
  featuredWhops: string;
  caseStudies: string;
  reviews: string;
  avgRating: number;
  reviewCount: number;
  priceRange: string;
  location: string;
  timezone: string;
  languages: string;
  responseTime: string;
  contactEmail: string;
  website: string;
  calendlyLink: string | null;
  internalNotes: string;
  internalTags: string;
  whopContactPerson: string;
  lastEngagementDate: string;
  recommendedFor: string;
}): Partner {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logo: row.logo,
    coverImage: row.coverImage,
    tagline: row.tagline,
    description: row.description,
    partnerType: row.partnerType as Partner["partnerType"],
    categories: JSON.parse(row.categories || "[]"),
    industries: JSON.parse(row.industries || "[]"),
    featuredWhops: JSON.parse(row.featuredWhops || "[]"),
    caseStudies: JSON.parse(row.caseStudies || "[]"),
    reviews: JSON.parse(row.reviews || "[]"),
    avgRating: row.avgRating,
    reviewCount: row.reviewCount,
    priceRange: row.priceRange as Partner["priceRange"],
    location: row.location,
    timezone: row.timezone,
    languages: JSON.parse(row.languages || "[]"),
    responseTime: row.responseTime as Partner["responseTime"],
    contactEmail: row.contactEmail,
    website: row.website,
    calendlyLink: row.calendlyLink,
    internalNotes: row.internalNotes,
    internalTags: JSON.parse(row.internalTags || "[]"),
    whopContactPerson: row.whopContactPerson,
    lastEngagementDate: row.lastEngagementDate,
    recommendedFor: JSON.parse(row.recommendedFor || "[]"),
  };
}

export async function getPartnersFromDb(): Promise<Partner[]> {
  const rows = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(dbRowToPartner);
}

export async function getPartnerBySlugFromDb(slug: string): Promise<Partner | null> {
  const row = await prisma.partner.findUnique({
    where: { slug },
  });
  return row ? dbRowToPartner(row) : null;
}
