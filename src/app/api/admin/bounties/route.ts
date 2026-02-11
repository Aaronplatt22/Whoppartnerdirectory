import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, reward, target, metric, endDate } = body;

  if (!title || !description || !reward || !target || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const bounty = await prisma.bounty.create({
    data: {
      title,
      description,
      reward,
      target: Number(target),
      metric: metric || "deals_registered",
      endDate: new Date(endDate),
      isActive: true,
    },
  });

  // Auto-enroll all partners
  const partners = await prisma.partner.findMany();
  for (const p of partners) {
    await prisma.bountyProgress.create({
      data: {
        bountyId: bounty.id,
        partnerId: p.id,
        current: 0,
        completed: false,
      },
    });
  }

  return NextResponse.json({ bounty }, { status: 201 });
}
