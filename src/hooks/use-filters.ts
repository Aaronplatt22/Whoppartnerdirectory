import type { PartnerFilters } from "@/lib/types";

export function useFilters(initial?: Partial<PartnerFilters>): PartnerFilters & { setFilters: (f: Partial<PartnerFilters>) => void } {
  return {
    search: "",
    partnerType: "all",
    categories: [],
    industries: [],
    priceRange: "all",
    minRating: 0,
    sortBy: "relevance",
    ...initial,
    setFilters: () => {},
  } as PartnerFilters & { setFilters: (f: Partial<PartnerFilters>) => void };
}
