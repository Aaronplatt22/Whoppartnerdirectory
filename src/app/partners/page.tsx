"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heading, Text, Inset, Select } from "frosted-ui";
import { mockPartners } from "@/data/mock-partners";
import type { PartnerFilters, PartnerType, PriceRange } from "@/lib/types";
import { CATEGORIES, CATEGORY_ICONS, PARTNER_TYPE_LABELS } from "@/lib/constants";
import {
  filterAndSortPartners,
  getPartnerCountByCategory,
  getFeaturedPartners,
} from "@/lib/partners";
import { useFilters } from "@/hooks/use-filters";
import { Navbar } from "@/components/ui/navbar";
import { SearchBar } from "@/components/ui/search-bar";
import { CategoryCard } from "@/components/ui/category-card";
import { PartnerCard } from "@/components/ui/partner-card";
import { FilterSidebar } from "@/components/ui/filter-sidebar";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: PartnerFilters["sortBy"]; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Rating" },
  { value: "reviews", label: "Most Reviews" },
  { value: "recent", label: "Recently Added" },
];

function parseFiltersFromSearchParams(params: ReturnType<typeof useSearchParams>): Partial<PartnerFilters> {
  const search = params.get("search") ?? "";
  const type = params.get("type") as PartnerType | "all" | null;
  const category = params.get("category");
  const categories: string[] = [];
  if (category) categories.push(decodeURIComponent(category));
  let i = 1;
  while (params.get(`category_${i}`)) {
    categories.push(decodeURIComponent(params.get(`category_${i}`)!));
    i++;
  }
  const industry = params.get("industry");
  const industries = industry ? [decodeURIComponent(industry)] : [];
  const priceRange = (params.get("priceRange") as PriceRange | "all" | null) ?? "all";
  const minRating = parseInt(params.get("minRating") ?? "0", 10) || 0;
  const sortBy = (params.get("sortBy") as PartnerFilters["sortBy"]) ?? "relevance";

  return {
    search,
    partnerType: type === "agency" || type === "service_provider" || type === "tech_partner" ? type : "all",
    categories,
    industries,
    priceRange: priceRange === "$" || priceRange === "$$" || priceRange === "$$$" || priceRange === "$$$$" ? priceRange : "all",
    minRating: Number.isFinite(minRating) && minRating >= 0 ? minRating : 0,
    sortBy: SORT_OPTIONS.some((o) => o.value === sortBy) ? sortBy : "relevance",
  };
}

function buildSearchParams(filters: PartnerFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.search) p.set("search", filters.search);
  if (filters.partnerType !== "all") p.set("type", filters.partnerType);
  if (filters.categories.length > 0) {
    filters.categories.forEach((c, i) => p.set(i === 0 ? "category" : `category_${i}`, c));
  }
  if (filters.industries.length === 1) p.set("industry", filters.industries[0]);
  if (filters.priceRange !== "all") p.set("priceRange", filters.priceRange);
  if (filters.minRating > 0) p.set("minRating", String(filters.minRating));
  if (filters.sortBy !== "relevance") p.set("sortBy", filters.sortBy);
  return p;
}

export default function PartnersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directoryRef = useRef<HTMLDivElement>(null);

  const { filters, setFilters } = useFilters();

  useEffect(() => {
    const parsed = parseFiltersFromSearchParams(searchParams);
    setFilters(parsed);
  }, [searchParams, setFilters]);

  const updateFiltersAndUrl = useCallback(
    (update: Partial<PartnerFilters>) => {
      setFilters(update);
      const next = { ...filters, ...update };
      const query = buildSearchParams(next).toString();
      const path = query ? `/partners?${query}` : "/partners";
      router.replace(path, { scroll: false });
    },
    [filters, setFilters, router]
  );

  const filteredAndSorted = useMemo(
    () => filterAndSortPartners(mockPartners, filters),
    [filters]
  );

  const categoryCounts = useMemo(() => getPartnerCountByCategory(mockPartners), []);
  const featuredPartners = useMemo(() => getFeaturedPartners(mockPartners, 4), []);

  const handleCategoryClick = useCallback(
    (category: string) => {
      updateFiltersAndUrl({
        categories: [category],
        partnerType: "all",
        industries: [],
        priceRange: "all",
        minRating: 0,
      });
      directoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [updateFiltersAndUrl]
  );

  const handleQuickTypeClick = useCallback(
    (type: PartnerType | "all") => {
      updateFiltersAndUrl({
        partnerType: type,
        categories: [],
      });
    },
    [updateFiltersAndUrl]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 1. Hero */}
      <section
        className="w-full py-16 px-4 md:py-20"
        style={{
          background: "linear-gradient(180deg, var(--whop-dark) 0%, var(--whop-dark-surface) 100%)",
        }}
      >
        <Inset side="all" clip="padding-box" className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <Heading size="8" className="max-w-2xl">
              Find the perfect partner to grow your Whop
            </Heading>
            <Text size="3" color="gray" className="max-w-xl">
              Browse vetted agencies, specialists, and tools trusted by the top Whop creators.
            </Text>
            <div className="w-full max-w-[600px]">
              <SearchBar
                value={filters.search}
                onChange={(value) => updateFiltersAndUrl({ search: value })}
                placeholder="Search by name, category, industry..."
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickTypeClick("all")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  filters.partnerType === "all"
                    ? "bg-orange-9 text-white"
                    : "bg-gray-4 text-gray-11 hover:bg-gray-5"
                )}
              >
                All
              </button>
              {(["agency", "service_provider", "tech_partner"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleQuickTypeClick(type)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    filters.partnerType === type
                      ? "bg-orange-9 text-white"
                      : "bg-gray-4 text-gray-11 hover:bg-gray-5"
                  )}
                >
                  {PARTNER_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </Inset>
      </section>

      {/* 2. Category Cards */}
      <section className="w-full py-12 px-4 border-t border-gray-6">
        <Inset side="all" clip="padding-box" className="max-w-6xl mx-auto">
          <Heading size="5" className="mb-6">
            Browse by Service
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((name) => (
              <CategoryCard
                key={name}
                name={name}
                icon={CATEGORY_ICONS[name] ?? "BarChartIcon"}
                count={categoryCounts[name] ?? 0}
                onClick={() => handleCategoryClick(name)}
                selected={filters.categories.includes(name)}
              />
            ))}
          </div>
        </Inset>
      </section>

      {/* 3. Featured Partners */}
      <section className="w-full py-12 px-4 border-t border-gray-6 bg-gray-2/50">
        <Inset side="all" clip="padding-box" className="max-w-6xl mx-auto">
          <Heading size="5" className="mb-6">
            Featured Partners
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2">
            {featuredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} featured />
            ))}
          </div>
        </Inset>
      </section>

      {/* 4. Full Directory with Filters */}
      <section
        ref={directoryRef}
        className="w-full flex-1 py-12 px-4 border-t border-gray-6"
      >
        <Inset side="all" clip="padding-box" className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <div className="w-[280px] shrink-0 hidden lg:block">
              <FilterSidebar
                filters={filters}
                onFilterChange={(next) => updateFiltersAndUrl(next)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <Text size="2" color="gray">
                  Showing {filteredAndSorted.length} partner{filteredAndSorted.length !== 1 ? "s" : ""}
                </Text>
                <Select.Root
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    updateFiltersAndUrl({ sortBy: value as PartnerFilters["sortBy"] })
                  }
                >
                  <Select.Trigger size="2" variant="surface" color="gray" />
                  <Select.Content>
                    {SORT_OPTIONS.map((opt) => (
                      <Select.Item key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              {filteredAndSorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg border border-gray-6 bg-gray-2/50 text-center">
                  <div
                    className="w-24 h-24 rounded-full bg-gray-4 flex items-center justify-center mb-4"
                    aria-hidden
                  >
                    <svg
                      className="w-12 h-12 text-gray-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <Heading size="4" className="mb-2">
                    No partners match your filters
                  </Heading>
                  <Text size="2" color="gray">
                    Try broadening your search or clear some filters.
                  </Text>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredAndSorted.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Inset>
      </section>
    </div>
  );
}
