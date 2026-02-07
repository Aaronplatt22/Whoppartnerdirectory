"use client";

import {
  Accordion,
  Button,
  Checkbox,
  RadioGroup,
  Separator,
  Text,
  Heading,
} from "frosted-ui";
import type { Partner, PartnerFilters, PartnerType, PriceRange } from "@/lib/types";
import { CATEGORIES, INDUSTRIES, PARTNER_TYPE_LABELS } from "@/lib/constants";
import {
  countWithPartnerType,
  countWithCategory,
  countWithIndustry,
  countWithPriceRange,
  countWithMinRating,
} from "@/lib/partners";
import { RatingStars } from "./rating-stars";
import { cn } from "@/lib/utils";

export interface FilterSidebarProps {
  filters: PartnerFilters;
  onFilterChange: (filters: PartnerFilters) => void;
  /** All partners (mockPartners) for computing option counts */
  allPartners: Partner[];
}

const PARTNER_TYPES: { value: PartnerType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "agency", label: PARTNER_TYPE_LABELS.agency },
  { value: "service_provider", label: PARTNER_TYPE_LABELS.service_provider },
  { value: "tech_partner", label: PARTNER_TYPE_LABELS.tech_partner },
];

const PRICE_OPTIONS: { value: PriceRange | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
  { value: "$$$$", label: "$$$$" },
];

const RATING_OPTIONS = [0, 1, 2, 3, 4, 5];

function updateFilters(
  current: PartnerFilters,
  update: Partial<PartnerFilters>
): PartnerFilters {
  return { ...current, ...update };
}

function countActiveFilters(filters: PartnerFilters): number {
  let n = 0;
  if (filters.partnerType !== "all") n++;
  n += filters.categories.length;
  n += filters.industries.length;
  if (filters.priceRange !== "all") n++;
  if (filters.minRating > 0) n++;
  return n;
}

export function FilterSidebar({ filters, onFilterChange, allPartners }: FilterSidebarProps) {
  const handlePartnerTypeChange = (value: string) => {
    onFilterChange(
      updateFilters(filters, { partnerType: value as PartnerFilters["partnerType"] })
    );
  };

  const handleCategoryToggle = (category: string) => {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange(updateFilters(filters, { categories: next }));
  };

  const handleIndustryToggle = (industry: string) => {
    const next = filters.industries.includes(industry)
      ? filters.industries.filter((i) => i !== industry)
      : [...filters.industries, industry];
    onFilterChange(updateFilters(filters, { industries: next }));
  };

  const handlePriceChange = (value: string) => {
    onFilterChange(
      updateFilters(filters, { priceRange: value as PartnerFilters["priceRange"] })
    );
  };

  const handleMinRatingChange = (rating: number) => {
    onFilterChange(updateFilters(filters, { minRating: rating }));
  };

  const clearAll = () => {
    onFilterChange({
      ...filters,
      partnerType: "all",
      categories: [],
      industries: [],
      priceRange: "all",
      minRating: 0,
    });
  };

  const activeCount = countActiveFilters(filters);
  const hasActiveFilters = activeCount > 0;

  return (
    <aside className="flex flex-col gap-2 w-64 shrink-0">
      <div className="flex items-center justify-between">
        <Heading size="3">Filters</Heading>
        {hasActiveFilters && (
          <Button size="1" variant="ghost" color="gray" onClick={clearAll}>
            Clear all ({activeCount})
          </Button>
        )}
      </div>
      <Separator size="4" />

      <Accordion.Root type="multiple" defaultValue={["type", "categories", "industries", "price", "rating"]}>
        <Accordion.Item value="type">
          <Accordion.Trigger>
            <Text size="2" weight="bold">
              Partner Type
            </Text>
          </Accordion.Trigger>
          <Accordion.Content>
            <RadioGroup.Root
              value={filters.partnerType}
              onValueChange={handlePartnerTypeChange}
              size="2"
              className="flex flex-col gap-2 pt-2"
            >
              {PARTNER_TYPES.map(({ value, label }) => {
                const count = countWithPartnerType(allPartners, filters, value);
                const disabled = count === 0;
                return (
                  <RadioGroup.Item
                    key={value}
                    value={value}
                    className={cn(disabled && "opacity-50 cursor-not-allowed pointer-events-none")}
                  >
                    <Text size="2">
                      {label} ({count})
                    </Text>
                  </RadioGroup.Item>
                );
              })}
            </RadioGroup.Root>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="categories">
          <Accordion.Trigger>
            <Text size="2" weight="bold">
              Categories
            </Text>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="flex flex-col gap-2 pt-2">
              {CATEGORIES.map((cat) => {
                const count = countWithCategory(allPartners, filters, cat);
                const disabled = count === 0;
                return (
                  <Checkbox
                    key={cat}
                    size="2"
                    checked={filters.categories.includes(cat)}
                    onCheckedChange={() => !disabled && handleCategoryToggle(cat)}
                    className={cn(disabled && "opacity-50 cursor-not-allowed pointer-events-none")}
                  >
                    <Text size="2">
                      {cat} ({count})
                    </Text>
                  </Checkbox>
                );
              })}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="industries">
          <Accordion.Trigger>
            <Text size="2" weight="bold">
              Industries
            </Text>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="flex flex-col gap-2 pt-2">
              {INDUSTRIES.map((ind) => {
                const count = countWithIndustry(allPartners, filters, ind);
                const disabled = count === 0;
                return (
                  <Checkbox
                    key={ind}
                    size="2"
                    checked={filters.industries.includes(ind)}
                    onCheckedChange={() => !disabled && handleIndustryToggle(ind)}
                    className={cn(disabled && "opacity-50 cursor-not-allowed pointer-events-none")}
                  >
                    <Text size="2">
                      {ind} ({count})
                    </Text>
                  </Checkbox>
                );
              })}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="price">
          <Accordion.Trigger>
            <Text size="2" weight="bold">
              Price Range
            </Text>
          </Accordion.Trigger>
          <Accordion.Content>
            <RadioGroup.Root
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              size="2"
              className="flex flex-col gap-2 pt-2"
            >
              {PRICE_OPTIONS.map(({ value, label }) => {
                const count = countWithPriceRange(allPartners, filters, value);
                const disabled = count === 0;
                return (
                  <RadioGroup.Item
                    key={value}
                    value={value}
                    className={cn(disabled && "opacity-50 cursor-not-allowed pointer-events-none")}
                  >
                    <Text size="2">
                      {label} ({count})
                    </Text>
                  </RadioGroup.Item>
                );
              })}
            </RadioGroup.Root>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="rating">
          <Accordion.Trigger>
            <Text size="2" weight="bold">
              Minimum Rating
            </Text>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="flex flex-wrap gap-2 pt-2">
              {RATING_OPTIONS.map((r) => {
                const count = countWithMinRating(allPartners, filters, r);
                const disabled = count === 0;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => !disabled && handleMinRatingChange(r)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-sm transition-colors",
                      disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                      filters.minRating === r
                        ? "border-orange-9 bg-orange-3 text-orange-11"
                        : "border-gray-6 bg-gray-2 text-gray-11 hover:bg-gray-4"
                    )}
                  >
                    {r === 0 ? `Any (${count})` : <RatingStars rating={r} size="sm" />}
                  </button>
                );
              })}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      {hasActiveFilters && (
        <>
          <Separator size="4" />
          <Button
            size="2"
            variant="soft"
            color="gray"
            className="w-full"
            onClick={clearAll}
          >
            Clear All ({activeCount})
          </Button>
        </>
      )}
    </aside>
  );
}
