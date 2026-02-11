import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AMLayoutClient } from "./layout-client";

export const metadata: Metadata = {
  title: "AM Dashboard — Whop Partner Directory",
  description:
    "Account Manager tools: AI Partner Matcher and directory view with internal fields.",
};

export default async function AMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/am");
  if (session.user.role === "partner") redirect("/partner");
  return <AMLayoutClient>{children}</AMLayoutClient>;
}
