import type { Partner, PartnerFilters } from "./types";
import { CATEGORIES } from "./constants";

/** Build searchable text for a partner (case-insensitive). */
function getSearchableText(partner: Partner): string {
  return [
    partner.name,
    partner.tagline,
    partner.description,
    ...partner.categories,
    ...partner.industries,
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Fuzzy match: query is split by words; each word must match somewhere
 * (case-insensitive, word boundary or start-of-token).
 */
export function matchesSearch(partner: Partner, query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return true;
  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const searchable = getSearchableText(partner);
  return words.every((word) => {
    if (searchable.includes(word)) return true;
    return searchable.split(/\s+/).some((token) => token.startsWith(word) || word.startsWith(token));
  });
}

export function matchesFilters(partner: Partner, filters: PartnerFilters): boolean {
  if (filters.partnerType !== "all" && partner.partnerType !== filters.partnerType) return false;
  if (filters.categories.length > 0 && !filters.categories.some((c) => partner.categories.includes(c))) return false;
  if (filters.industries.length > 0 && !filters.industries.some((i) => partner.industries.includes(i))) return false;
  if (filters.priceRange !== "all" && partner.priceRange !== filters.priceRange) return false;
  if (filters.minRating > 0 && partner.avgRating < filters.minRating) return false;
  return true;
}

export function filterPartners(partners: Partner[], filters: PartnerFilters): Partner[] {
  return partners.filter(
    (p) => matchesSearch(p, filters.search) && matchesFilters(p, filters)
  );
}

/** Relevance score for sorting: higher = better match when search is active. */
function relevanceScore(partner: Partner, searchQuery: string): number {
  if (!searchQuery.trim()) return 0;
  const q = searchQuery.toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);
  const text = getSearchableText(partner);
  let score = 0;
  for (const word of words) {
    if (text.includes(word)) score += 2;
    else if (text.split(/\s+/).some((t) => t.startsWith(word) || word.startsWith(t))) score += 1;
  }
  return score;
}

export function sortPartners(
  partners: Partner[],
  sortBy: PartnerFilters["sortBy"],
  searchQuery: string
): Partner[] {
  const copy = [...partners];
  switch (sortBy) {
    case "rating":
      return copy.sort((a, b) => b.avgRating - a.avgRating);
    case "reviews":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case "recent":
      return copy.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    case "relevance":
    default: {
      if (searchQuery.trim()) {
        return copy.sort((a, b) => {
          const aScore = relevanceScore(a, searchQuery);
          const bScore = relevanceScore(b, searchQuery);
          if (bScore !== aScore) return bScore - aScore;
          return b.avgRating - a.avgRating;
        });
      }
      // No search: featured first (Top Performer), then by reviewCount
      return copy.sort((a, b) => {
        const aFeatured = a.internalTags.includes("Top Performer") ? 1 : 0;
        const bFeatured = b.internalTags.includes("Top Performer") ? 1 : 0;
        if (bFeatured !== aFeatured) return bFeatured - aFeatured;
        return b.reviewCount - a.reviewCount;
      });
    }
  }
}

export function filterAndSortPartners(
  partners: Partner[],
  filters: PartnerFilters
): Partner[] {
  const filtered = filterPartners(partners, filters);
  return sortPartners(filtered, filters.sortBy, filters.search);
}

export function getPartnerCountByCategory(partners: Partner[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    counts[cat] = partners.filter((p) => p.categories.includes(cat)).length;
  }
  return counts;
}

export function getFeaturedPartners(partners: Partner[], limit = 4): Partner[] {
  return partners
    .filter((p) => p.internalTags.includes("Top Performer"))
    .slice(0, limit);
}

/** Count partners that would match if we only changed one filter dimension. */
export function countWithPartnerType(
  partners: Partner[],
  filters: PartnerFilters,
  partnerType: PartnerFilters["partnerType"]
): number {
  return filterPartners(partners, { ...filters, partnerType }).length;
}

export function countWithCategory(
  partners: Partner[],
  filters: PartnerFilters,
  category: string
): number {
  const nextCategories = filters.categories.includes(category)
    ? filters.categories
    : [...filters.categories, category];
  return filterPartners(partners, { ...filters, categories: nextCategories }).length;
}

export function countWithIndustry(
  partners: Partner[],
  filters: PartnerFilters,
  industry: string
): number {
  const nextIndustries = filters.industries.includes(industry)
    ? filters.industries
    : [...filters.industries, industry];
  return filterPartners(partners, { ...filters, industries: nextIndustries }).length;
}

export function countWithPriceRange(
  partners: Partner[],
  filters: PartnerFilters,
  priceRange: PartnerFilters["priceRange"]
): number {
  return filterPartners(partners, { ...filters, priceRange }).length;
}

export function countWithMinRating(
  partners: Partner[],
  filters: PartnerFilters,
  minRating: number
): number {
  return filterPartners(partners, { ...filters, minRating }).length;
}
