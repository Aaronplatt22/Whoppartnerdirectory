"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heading, Text, Inset, Select, Button, Sheet } from "frosted-ui";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { Partner, PartnerFilters, PartnerType } from "@/lib/types";
import { CATEGORIES, CATEGORY_ICONS, PARTNER_TYPE_LABELS } from "@/lib/constants";
import { getPartnerCountByCategory, getFeaturedPartners } from "@/lib/partners";
import { useFilters } from "@/hooks/use-filters";
import { useSearch } from "@/hooks/use-search";
import { Navbar } from "@/components/ui/navbar";
import { SearchBar } from "@/components/ui/search-bar";
import { CategoryCard } from "@/components/ui/category-card";
import { HeroGlobe } from "@/components/ui/hero-globe";
import { PartnerCard } from "@/components/ui/partner-card";
import { FilterSidebar } from "@/components/ui/filter-sidebar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: PartnerFilters["sortBy"]; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Rating" },
  { value: "reviews", label: "Most Reviews" },
  { value: "recent", label: "Recently Added" },
];

export function PartnersPageClient({ initialPartners }: { initialPartners: Partner[] }) {
  const directoryRef = useRef<HTMLDivElement>(null);
  const searchFromFilterRef = useRef(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const {
    filters,
    setFilter,
    clearFilters,
    filteredPartners,
    totalCount,
  } = useFilters(initialPartners);

  const { searchQuery, debouncedQuery, setSearchQuery } = useSearch(filters.search);

  useEffect(() => {
    if (searchFromFilterRef.current) {
      searchFromFilterRef.current = false;
      return;
    }
    setSearchQuery(filters.search);
  }, [filters.search, setSearchQuery]);

  useEffect(() => {
    if (debouncedQuery === filters.search) return;
    searchFromFilterRef.current = true;
    setFilter({ search: debouncedQuery });
  }, [debouncedQuery, filters.search, setFilter]);

  const categoryCounts = getPartnerCountByCategory(initialPartners);
  const featuredPartners = getFeaturedPartners(initialPartners, 4);

  const handleCategoryClick = useCallback(
    (category: string) => {
      setFilter({
        categories: [category],
        partnerType: "all",
        industries: [],
        priceRange: "all",
        minRating: 0,
      });
      directoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [setFilter]
  );

  const handleQuickTypeClick = useCallback(
    (type: PartnerType | "all") => {
      setFilter({ partnerType: type, categories: [] });
    },
    [setFilter]
  );

  const removeCategory = useCallback(
    (category: string) => {
      setFilter({
        categories: filters.categories.filter((c) => c !== category),
      });
    },
    [filters.categories, setFilter]
  );

  const removeIndustry = useCallback(
    (industry: string) => {
      setFilter({
        industries: filters.industries.filter((i) => i !== industry),
      });
    },
    [filters.industries, setFilter]
  );

  const activeFilterChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.partnerType !== "all") {
    activeFilterChips.push({
      key: "type",
      label: `Type: ${PARTNER_TYPE_LABELS[filters.partnerType]}`,
      onRemove: () => setFilter({ partnerType: "all" }),
    });
  }
  filters.categories.forEach((c) => {
    activeFilterChips.push({
      key: `cat-${c}`,
      label: `Category: ${c}`,
      onRemove: () => removeCategory(c),
    });
  });
  filters.industries.forEach((i) => {
    activeFilterChips.push({
      key: `ind-${i}`,
      label: `Industry: ${i}`,
      onRemove: () => removeIndustry(i),
    });
  });
  if (filters.priceRange !== "all") {
    activeFilterChips.push({
      key: "price",
      label: `Price: ${filters.priceRange}`,
      onRemove: () => setFilter({ priceRange: "all" }),
    });
  }
  if (filters.minRating > 0) {
    activeFilterChips.push({
      key: "rating",
      label: `Min. rating: ${filters.minRating}+`,
      onRemove: () => setFilter({ minRating: 0 }),
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section
        className="relative w-full overflow-hidden pt-12 pb-8 px-4"
        style={{
          background: "#141212",
          border: "none",
          outline: "none",
          boxShadow: "none",
        }}
      >
        <div
          className="relative z-0 w-full"
          style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
        >
          <HeroGlobe partnerNames={initialPartners.map((p) => p.name)} />
        </div>
        <Inset
          side="all"
          clip="padding-box"
          className="relative z-10 max-w-4xl mx-auto mt-0"
          style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
        >
          <div
            className="flex flex-col items-center text-center"
            style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none" }}
          >
            <Heading
              size="8"
              className="max-w-2xl tracking-tight font-extrabold mb-[12px] text-[2.25rem] sm:text-[2.7rem] md:text-[3rem]"
              style={{ textShadow: "0 0 40px rgba(250, 70, 22, 0.15)" }}
            >
              Find The Perfect Partner To Grow Your Business
            </Heading>
            <Text size="3" color="gray" className="max-w-xl mb-5">
              Browse vetted agencies, specialists, and tools trusted by the top Whop creators.
            </Text>
            <div className="w-full max-w-[600px] search-bar-expand rounded-md mb-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, category, industry..."
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-0">
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

      <div
        className="w-full h-px flex-shrink-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent 100%)",
        }}
      />

      <section className="w-full pt-[48px] pb-12 px-4 border-gray-6">
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

      <section
        ref={directoryRef}
        className="w-full py-12 px-4 border-t border-gray-6"
      >
        <Inset side="all" clip="padding-box" className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="hidden md:block">
              <FilterSidebar
                filters={filters}
                onFilterChange={(f) => {
                  setFilter(f);
                  setSearchQuery(f.search);
                }}
                allPartners={initialPartners}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <Text size="2" color="gray">
                  {totalCount} partner{totalCount !== 1 ? "s" : ""}
                </Text>
                <div className="flex items-center gap-2">
                  <Button
                    size="2"
                    variant="soft"
                    color="gray"
                    className="md:hidden"
                    onClick={() => setFilterDrawerOpen(true)}
                  >
                    <MagnifyingGlassIcon width={16} height={16} className="mr-1" />
                    Filters
                    {activeFilterChips.length > 0 && ` (${activeFilterChips.length})`}
                  </Button>
                  <Select.Root
                    value={filters.sortBy}
                    onValueChange={(v) => setFilter({ sortBy: v as PartnerFilters["sortBy"] })}
                  >
                    <Select.Trigger className="min-w-[140px]" />
                    <Select.Content>
                      {SORT_OPTIONS.map(({ value, label }) => (
                        <Select.Item key={value} value={value}>
                          {label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeFilterChips.map(({ key, label, onRemove }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={onRemove}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-4 px-3 py-1.5 text-sm text-gray-11 hover:bg-gray-5"
                    >
                      {label}
                      <Cross2Icon width={12} height={12} />
                    </button>
                  ))}
                </div>
              )}
              {filteredPartners.length === 0 ? (
                <div className="rounded-lg border border-gray-6 bg-gray-2/50 p-12 text-center">
                  <Heading size="5" className="mb-2">
                    No partners match
                  </Heading>
                  <Text size="2" color="gray" className="mb-4">
                    Try adjusting your filters or search terms to find the right partner.
                  </Text>
                  <Button size="2" variant="soft" color="gray" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 partners-result-fade"
                  key={`${filters.search}-${filters.sortBy}-${filters.categories.join(",")}-${filters.industries.join(",")}-${filters.partnerType}-${filters.priceRange}-${filters.minRating}`}
                >
                  {filteredPartners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Inset>
      </section>

      <Sheet.Root
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        {...({ direction: "right" } as object)}
      >
        <Sheet.Content className="w-full max-w-sm overflow-y-auto">
          <Sheet.Title className="sr-only">Filters</Sheet.Title>
          <div className="p-4">
            <FilterSidebar
              filters={filters}
              onFilterChange={(f) => {
                setFilter(f);
                setSearchQuery(f.search);
              }}
              allPartners={initialPartners}
            />
          </div>
        </Sheet.Content>
      </Sheet.Root>

      <ScrollToTop />
    </div>
  );
}
