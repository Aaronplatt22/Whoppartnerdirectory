"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heading, Text, Inset, Select, Button, Sheet } from "frosted-ui";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { mockPartners } from "@/data/mock-partners";
import type { PartnerFilters, PartnerType } from "@/lib/types";
import { CATEGORIES, CATEGORY_ICONS, PARTNER_TYPE_LABELS } from "@/lib/constants";
import { getPartnerCountByCategory, getFeaturedPartners } from "@/lib/partners";
import { useFilters } from "@/hooks/use-filters";
import { useSearch } from "@/hooks/use-search";
import { Navbar } from "@/components/ui/navbar";
import { SearchBar } from "@/components/ui/search-bar";
import { CategoryCard } from "@/components/ui/category-card";
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

export default function PartnersPage() {
  const directoryRef = useRef<HTMLDivElement>(null);
  const searchFromFilterRef = useRef(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const {
    filters,
    setFilter,
    clearFilters,
    filteredPartners,
    totalCount,
  } = useFilters();

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

  const categoryCounts = getPartnerCountByCategory(mockPartners);
  const featuredPartners = getFeaturedPartners(mockPartners, 4);

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
            <div className="w-full max-w-[600px] search-bar-expand rounded-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
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
                onFilterChange={(next) => setFilter(next)}
                allPartners={mockPartners}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="lg:hidden mb-4">
                <Button
                  variant="soft"
                  size="2"
                  color="gray"
                  onClick={() => setFilterDrawerOpen(true)}
                >
                  Filters
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <Text size="2" color="gray">
                  Showing {totalCount} partner{totalCount !== 1 ? "s" : ""}
                </Text>
                <Select.Root
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilter({ sortBy: value as PartnerFilters["sortBy"] })
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

              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeFilterChips.map(({ key, label, onRemove }) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-4 px-3 py-1 text-sm text-gray-12"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={onRemove}
                        className="rounded-full p-0.5 hover:bg-gray-6 transition-colors"
                        aria-label={`Remove ${label}`}
                      >
                        <Cross2Icon width={12} height={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {totalCount === 0 ? (
                <div
                  className="partners-result-fade flex flex-col items-center justify-center py-16 px-4 rounded-lg border border-gray-6 bg-[var(--whop-dark-surface)] text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div
                    className="w-28 h-28 rounded-full bg-gray-4 flex items-center justify-center mb-6 text-gray-8"
                    aria-hidden
                  >
                    <MagnifyingGlassIcon width={56} height={56} />
                  </div>
                  <Heading size="5" weight="medium" className="mb-2">
                    No partners found
                  </Heading>
                  <Text size="2" color="gray" className="mb-6 max-w-sm">
                    Try adjusting your filters or search terms to find the right partner.
                  </Text>
                  <Button
                    size="3"
                    color="orange"
                    onClick={clearFilters}
                    className="btn-press"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div
                  className="partners-result-fade grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
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

      <Sheet.Root open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
        <Sheet.Content className="max-h-[85vh] overflow-auto">
          <Sheet.Header className="p-4 border-b border-gray-6">
            <Sheet.Title>Filters</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body className="p-4 overflow-auto">
            <FilterSidebar
              filters={filters}
              onFilterChange={(next) => setFilter(next)}
              allPartners={mockPartners}
            />
            <Sheet.Close asChild>
              <Button variant="soft" color="gray" className="w-full mt-4 btn-press">
                Done
              </Button>
            </Sheet.Close>
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>

      <ScrollToTop />
    </div>
  );
}
