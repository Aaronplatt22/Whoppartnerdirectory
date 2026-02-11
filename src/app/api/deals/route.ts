import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any)?.id;
  const partner = await prisma.partner.findFirst({ where: { userId } });
  if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

  const body = await req.json();
  const { name, businessName, businessContact, businessEmail, estimatedValue, monthlyProcessing, notes } = body;

  if (!name || !businessName || !businessContact || !businessEmail || !estimatedValue) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Find assigned CAM for this partner
  const camAssignment = await prisma.camAssignment.findFirst({
    where: { partnerId: partner.id },
    include: { cam: true },
  });

  const deal = await prisma.deal.create({
    data: {
      name,
      businessName,
      businessContact,
      businessEmail,
      estimatedValue: Number(estimatedValue),
      monthlyProcessing: Number(monthlyProcessing) || 0,
      probability: 20,
      stage: "New Opportunity",
      notes: notes || "",
      partnerId: partner.id,
      camId: camAssignment?.camId || null,
    },
  });

  // Create activity
  await prisma.dealActivity.create({
    data: {
      dealId: deal.id,
      authorId: userId,
      type: "message",
      content: "Deal registered: " + name,
    },
  });

  // Notify CAM if assigned
  if (camAssignment) {
    await prisma.notification.create({
      data: {
        userId: camAssignment.camId,
        type: "deal_registered",
        title: "New Deal Registered",
        message: partner.name + " registered a new deal: " + name,
        link: "/am/pipeline",
      },
    });
  }

  return NextResponse.json({ deal }, { status: 201 });
}
