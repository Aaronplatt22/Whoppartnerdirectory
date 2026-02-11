import { notFound } from "next/navigation";
import { getPartnerBySlugFromDb } from "@/lib/partners-db";
import { PartnerSlugPageClient } from "./PartnerSlugPageClient";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ am?: string }>;
};

export default async function PartnerSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { am } = await searchParams;
  const partner = await getPartnerBySlugFromDb(slug);
  if (!partner) notFound();
  return (
    <PartnerSlugPageClient
      partner={partner}
      isAMView={am === "1"}
    />
  );
}
