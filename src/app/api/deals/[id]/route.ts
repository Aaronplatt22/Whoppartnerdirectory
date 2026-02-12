import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any)?.id;
  const role = (session.user as any)?.role;
  const body = await req.json();
  const { stage, probability, notes } = body;

  const deal = await prisma.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  // Build update data
  const updateData: any = {};
  if (stage !== undefined) updateData.stage = stage;
  if (probability !== undefined) updateData.probability = Number(probability);
  if (notes !== undefined) updateData.notes = notes;

  const updated = await prisma.deal.update({
    where: { id: params.id },
    data: updateData,
  });

  // Log stage change activity
  if (stage && stage !== deal.stage) {
    await prisma.dealActivity.create({
      data: {
        dealId: deal.id,
        authorId: userId,
        type: "stage_change",
        content: "Moved from " + deal.stage + " to " + stage,
      },
    });
  }

  return NextResponse.json({ deal: updated });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
    include: {
      partner: true,
      cam: true,
      activities: {
        include: { author: { select: { name: true, role: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  return NextResponse.json({ deal });
}
