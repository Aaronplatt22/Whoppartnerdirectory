"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Partner, PartnerFilters, PartnerType, PriceRange } from "@/lib/types";
import { filterAndSortPartners } from "@/lib/partners";

const SORT_OPTIONS = ["relevance", "rating", "reviews", "recent"] as const;

function parseFiltersFromSearchParams(params: URLSearchParams): PartnerFilters {
  const search = params.get("search") ?? "";
  const type = params.get("type") as PartnerType | null;
  const categories: string[] = [];
  const cat0 = params.get("category");
  if (cat0) categories.push(decodeURIComponent(cat0));
  let i = 1;
  while (params.get(`category_${i}`)) {
    categories.push(decodeURIComponent(params.get(`category_${i}`)!));
    i++;
  }
  const industry = params.get("industry");
  const industries = industry ? [decodeURIComponent(industry)] : [];
  let industriesMulti: string[] = industries;
  let j = 1;
  while (params.get(`industry_${j}`)) {
    industriesMulti = [...industriesMulti, decodeURIComponent(params.get(`industry_${j}`)!)];
    j++;
  }
  const priceRange = params.get("priceRange") as PriceRange | null;
  const minRating = parseInt(params.get("minRating") ?? "0", 10) || 0;
  const sortBy = params.get("sortBy") as PartnerFilters["sortBy"] | null;

  return {
    search,
    partnerType: type === "agency" || type === "service_provider" || type === "tech_partner" ? type : "all",
    categories,
    industries: industriesMulti,
    priceRange: priceRange === "$" || priceRange === "$$" || priceRange === "$$$" || priceRange === "$$$$" ? priceRange : "all",
    minRating: Number.isFinite(minRating) && minRating >= 0 ? minRating : 0,
    sortBy: sortBy && SORT_OPTIONS.includes(sortBy) ? sortBy : "relevance",
  };
}

function buildSearchParams(filters: PartnerFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.partnerType !== "all") p.set("type", filters.partnerType);
  filters.categories.forEach((c, i) => p.set(i === 0 ? "category" : `category_${i}`, c));
  filters.industries.forEach((ind, i) => p.set(i === 0 ? "industry" : `industry_${i}`, ind));
  if (filters.priceRange !== "all") p.set("priceRange", filters.priceRange);
  if (filters.minRating > 0) p.set("minRating", String(filters.minRating));
  if (filters.sortBy !== "relevance") p.set("sortBy", filters.sortBy);
  return p;
}

const DEFAULT_FILTERS: PartnerFilters = {
  search: "",
  partnerType: "all",
  categories: [],
  industries: [],
  priceRange: "all",
  minRating: 0,
  sortBy: "relevance",
};

export function useFilters(partners: Partner[]) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFiltersState] = useState<PartnerFilters>(() =>
    parseFiltersFromSearchParams(searchParams)
  );

  useEffect(() => {
    setFiltersState(parseFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  const updateUrl = useCallback(
    (next: PartnerFilters) => {
      const query = buildSearchParams(next).toString();
      const path = query ? `/partners?${query}` : "/partners";
      router.replace(path, { scroll: false });
    },
    [router]
  );

  const setFilter = useCallback(
    (update: Partial<PartnerFilters>) => {
      setFiltersState((prev) => {
        const next = { ...prev, ...update };
        updateUrl(next);
        return next;
      });
    },
    [updateUrl]
  );

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    updateUrl(DEFAULT_FILTERS);
  }, [updateUrl]);

  const filteredPartners = useMemo(
    () => filterAndSortPartners(partners, filters),
    [partners, filters]
  );

  const totalCount = filteredPartners.length;

  return {
    filters,
    setFilter,
    clearFilters,
    filteredPartners,
    totalCount,
  };
}
