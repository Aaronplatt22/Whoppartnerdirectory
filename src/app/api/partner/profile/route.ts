import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function partnerToJson(partner: {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  partnerType: string;
  categories: string;
  industries: string;
  priceRange: string;
  location: string;
  timezone: string;
  languages: string;
  responseTime: string;
  contactEmail: string;
  website: string;
  calendlyLink: string | null;
  featuredWhops: string;
  caseStudies: string;
  internalNotes: string;
  internalTags: string;
  recommendedFor: string;
}) {
  return {
    id: partner.id,
    slug: partner.slug,
    name: partner.name,
    tagline: partner.tagline,
    description: partner.description,
    partnerType: partner.partnerType,
    categories: JSON.parse(partner.categories || "[]") as string[],
    industries: JSON.parse(partner.industries || "[]") as string[],
    priceRange: partner.priceRange,
    location: partner.location,
    timezone: partner.timezone,
    languages: JSON.parse(partner.languages || "[]") as string[],
    responseTime: partner.responseTime,
    contactEmail: partner.contactEmail,
    website: partner.website,
    calendlyLink: partner.calendlyLink,
    featuredWhops: JSON.parse(partner.featuredWhops || "[]"),
    caseStudies: JSON.parse(partner.caseStudies || "[]"),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const partner = await prisma.partner.findFirst({
    where: { userId: session.user.id },
  });
  if (!partner) {
    return NextResponse.json({ error: "Partner profile not found" }, { status: 404 });
  }
  return NextResponse.json(partnerToJson(partner));
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "partner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const partner = await prisma.partner.findFirst({
    where: { userId: session.user.id },
  });
  if (!partner) {
    return NextResponse.json({ error: "Partner profile not found" }, { status: 404 });
  }
  const allowed = [
    "name", "tagline", "description", "partnerType", "categories", "industries",
    "priceRange", "location", "timezone", "languages", "responseTime",
    "contactEmail", "website", "calendlyLink", "featuredWhops", "caseStudies",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === "categories" || key === "industries" || key === "languages") {
        data[key] = JSON.stringify(Array.isArray(body[key]) ? body[key] : []);
      } else if (key === "featuredWhops" || key === "caseStudies") {
        data[key] = JSON.stringify(Array.isArray(body[key]) ? body[key] : []);
      } else {
        data[key] = body[key];
      }
    }
  }
  await prisma.partner.update({
    where: { id: partner.id },
    data,
  });
  const updated = await prisma.partner.findUnique({ where: { id: partner.id } });
  return NextResponse.json(partnerToJson(updated!));
}
