import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let body: { token: string; password: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { token, password } = body;
  if (!token || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Token and password (min 8 characters) required" },
      { status: 400 }
    );
  }
  const invite = await prisma.invite.findUnique({
    where: { token },
  });
  if (!invite) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
  }
  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite expired" }, { status: 410 });
  }
  const existing = await prisma.user.findUnique({
    where: { email: invite.email },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please log in." },
      { status: 409 }
    );
  }
  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: invite.email,
      role: invite.role,
      passwordHash,
    },
  });
  if (invite.role === "partner" && invite.partnerId) {
    await prisma.partner.update({
      where: { id: invite.partnerId },
      data: { userId: user.id },
    });
  } else if (invite.role === "partner") {
    const slug = invite.email.split("@")[0].toLowerCase().replace(/\W/g, "-");
    await prisma.partner.create({
      data: {
        userId: user.id,
        slug: slug + "-" + Date.now().toString(36),
        name: "",
        tagline: "",
        description: "",
        partnerType: "agency",
        categories: "[]",
        industries: "[]",
        featuredWhops: "[]",
        caseStudies: "[]",
        reviews: "[]",
        priceRange: "$$",
        languages: "[]",
        responseTime: "< 24 hours",
        contactEmail: invite.email,
        internalTags: "[]",
        recommendedFor: "[]",
      },
    });
  }
  await prisma.invite.delete({ where: { id: invite.id } });
  return NextResponse.json({ success: true, email: user.email });
}
