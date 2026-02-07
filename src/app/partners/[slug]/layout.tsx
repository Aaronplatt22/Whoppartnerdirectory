import type { Metadata } from "next";
import { mockPartners } from "@/data/mock-partners";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const partner = mockPartners.find((p) => p.slug === slug);
  if (!partner) return { title: "Partner — Whop Partners" };
  return {
    title: `${partner.name} — Whop Partners`,
    description: partner.tagline || `${partner.name} is a partner in the Whop directory.`,
  };
}

export default function PartnerSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
