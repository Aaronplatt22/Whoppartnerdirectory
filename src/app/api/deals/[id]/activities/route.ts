import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any)?.id;
  const body = await req.json();
  const { content, type } = body;

  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const activity = await prisma.dealActivity.create({
    data: {
      dealId: params.id,
      authorId: userId,
      type: type || "message",
      content,
    },
    include: { author: { select: { name: true, role: true } } },
  });

  return NextResponse.json({ activity }, { status: 201 });
}
