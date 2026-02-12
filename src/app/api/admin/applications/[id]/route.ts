import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { action } = await req.json();

  const app = await prisma.partnerApplication.findUnique({ where: { id } });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    const passwordHash = await bcrypt.hash("partner123", 10);
    const slug = (app.company || app.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const user = await prisma.user.create({
      data: {
        name: app.name,
        email: app.email,
        passwordHash,
        role: "partner",
      },
    });

    await prisma.partner.create({
      data: {
        name: app.company || app.name,
        slug: slug + "-" + Date.now(),
        user: { connect: { id: user.id } },
        tagline: app.interest || "New Whop partner",
        description: app.interest || "New partner in the Whop ecosystem.",
        partnerType: "Agency",
        categories: "General",
        industries: "General",
        featuredWhops: "",
        caseStudies: "",
        reviews: "",
        priceRange: "TBD",
        languages: "English",
        responseTime: "Within 48 hours",
        contactEmail: app.email,
        internalTags: "new-partner",
        recommendedFor: "General",
        tier: "Bronze",
      },
    });

    await prisma.partnerApplication.update({
      where: { id },
      data: { status: "approved" },
    });

    return NextResponse.json({
      success: true,
      credentials: { email: app.email, password: "partner123" },
    });
  }

  if (action === "reject") {
    await prisma.partnerApplication.update({
      where: { id },
      data: { status: "rejected" },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
