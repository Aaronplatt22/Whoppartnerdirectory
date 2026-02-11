import { Suspense } from "react";
import { getPartnersFromDb } from "@/lib/partners-db";
import { PartnersPageClient } from "./PartnersPageClient";

function PartnersFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <p className="text-gray-11">Loading directory…</p>
    </div>
  );
}

export default async function PartnersPage() {
  const partners = await getPartnersFromDb();
  return (
    <Suspense fallback={<PartnersFallback />}>
      <PartnersPageClient initialPartners={partners} />
    </Suspense>
  );
}
