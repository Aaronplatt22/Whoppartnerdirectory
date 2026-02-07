import type { Metadata } from "next";
import { AMLayoutClient } from "./layout-client";

export const metadata: Metadata = {
  title: "AM Dashboard — Whop Partner Directory",
  description:
    "Account Manager tools: AI Partner Matcher and directory view with internal fields.",
};

export default function AMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AMLayoutClient>{children}</AMLayoutClient>;
}
