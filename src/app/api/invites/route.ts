import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomBytes } from "crypto";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TOKEN_BYTES = 32;
const EXPIRES_DAYS = 7;

function generateToken() {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const invites = await prisma.invite.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(
    invites.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { email: string; role: string; partnerId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { email, role, partnerId } = body;
  const validRoles = ["admin", "account_manager", "partner"];
  if (!email || typeof email !== "string" || !validRoles.includes(role)) {
    return NextResponse.json(
      { error: "Valid email and role (admin, account_manager, partner) required" },
      { status: 400 }
    );
  }
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + EXPIRES_DAYS);
  const token = generateToken();
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const inviteLink = `${baseUrl}/invite/accept?token=${token}`;

  const existing = await prisma.user.findUnique({ where: { email: email.trim() } });
  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists." },
      { status: 409 }
    );
  }

  const invite = await prisma.invite.create({
    data: {
      email: email.trim(),
      token,
      role,
      expiresAt,
      partnerId: partnerId ?? null,
    },
  });

  return NextResponse.json({
    id: invite.id,
    inviteLink,
    email: invite.email,
    role: invite.role,
    expiresAt: invite.expiresAt.toISOString(),
  });
}
