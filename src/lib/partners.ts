import type { Partner, PartnerFilters } from "./types";
import { CATEGORIES } from "./constants";

function matchesSearch(partner: Partner, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  const searchable = [
    partner.name,
    partner.tagline,
    partner.description,
    ...partner.categories,
    ...partner.industries,
  ].join(" ").toLowerCase();
  return searchable.includes(q) || searchable.split(/\s+/).some((word) => word.startsWith(q));
}

function matchesFilters(partner: Partner, filters: PartnerFilters): boolean {
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
      return copy.sort(
        (a, b) => new Date(b.lastEngagementDate).getTime() - new Date(a.lastEngagementDate).getTime()
      );
    case "relevance":
    default: {
      if (!searchQuery.trim()) return copy;
      const q = searchQuery.toLowerCase();
      return copy.sort((a, b) => {
        const aMatch = [a.name, a.tagline, a.description].join(" ").toLowerCase();
        const bMatch = [b.name, b.tagline, b.description].join(" ").toLowerCase();
        const aScore = aMatch.includes(q) ? 1 : 0;
        const bScore = bMatch.includes(q) ? 1 : 0;
        if (bScore !== aScore) return bScore - aScore;
        return b.avgRating - a.avgRating;
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
