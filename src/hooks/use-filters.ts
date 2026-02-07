"use client";

import { useCallback, useState } from "react";
import type { PartnerFilters } from "@/lib/types";

export function useFilters(initial?: Partial<PartnerFilters>) {
  const [filters, setFiltersState] = useState<PartnerFilters>({
    search: "",
    partnerType: "all",
    categories: [],
    industries: [],
    priceRange: "all",
    minRating: 0,
    sortBy: "relevance",
    ...initial,
  });

  const setFilters = useCallback((update: Partial<PartnerFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...update }));
  }, []);

  return { filters, setFilters };
}
