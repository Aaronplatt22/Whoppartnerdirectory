import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let body: { name: string; email: string; company?: string; interest?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { name, email, company, interest } = body;
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }
  await prisma.partnerApplication.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() ?? null,
      interest: interest?.trim() ?? null,
    },
  });
  return NextResponse.json({ success: true });
}
