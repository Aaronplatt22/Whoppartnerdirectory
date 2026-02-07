import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join the Directory — Whop Partner Directory",
  description:
    "Complete your partner profile to be listed in the Whop Partner Directory and connect with Whop creators.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
