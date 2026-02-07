import type { Partner } from "./types";
import type { PriceRange } from "./types";

/** Challenge -> category mapping for scoring (category match 40%) */
const CHALLENGE_TO_CATEGORIES: Record<string, string[]> = {
  "Low Conversion": ["Sales Page Design", "Paid Acquisition", "Growth Strategy"],
  "High Churn": ["Community Building", "Growth Strategy"],
  "Need Course Content": ["Content & Courses", "Growth Strategy"],
  "Community is Dead": ["Community Building", "Automation & Integrations"],
  "No Paid Traffic": ["Paid Acquisition", "Growth Strategy"],
  "Platform Migration": ["Migration"],
  "Need Automation": ["Automation & Integrations", "Development"],
  "Branding/Design": ["Branding & Creative", "Sales Page Design"],
  "Analytics/Data": ["Automation & Integrations", "Growth Strategy"],
};

export interface MatchInput {
  industry: string;
  monthlyRevenue: string;
  memberCount: string;
  challenges: string[];
  budget: PriceRange | "";
  additionalContext: string;
}

export interface MatchRecommendation {
  partnerId: string;
  partnerName: string;
  matchScore: number;
  reason: string;
  relevantCaseStudy: string;
  suggestedIntro: string;
}

export interface MatchResult {
  analysis: string;
  recommendations: MatchRecommendation[];
}

function categoryMatchScore(partner: Partner, challenges: string[]): number {
  if (challenges.length === 0) return 50; // neutral
  let total = 0;
  let count = 0;
  for (const ch of challenges) {
    const categories = CHALLENGE_TO_CATEGORIES[ch];
    if (!categories) continue;
    for (const cat of categories) {
      if (partner.categories.includes(cat)) {
        total += 100;
        break;
      }
    }
    count++;
  }
  return count === 0 ? 50 : Math.min(100, (total / count));
}

function industryMatchScore(partner: Partner, industry: string): number {
  if (!industry) return 50;
  return partner.industries.includes(industry) ? 100 : 0;
}

function priceCompatibilityScore(
  partner: Partner,
  budget: PriceRange | ""
): number {
  if (!budget) return 50;
  const order: PriceRange[] = ["$", "$$", "$$$", "$$$$"];
  const partnerLevel = order.indexOf(partner.priceRange) + 1;
  const clientLevel = order.indexOf(budget as PriceRange) + 1;
  if (clientLevel >= partnerLevel) return 100; // client can afford
  const diff = partnerLevel - clientLevel;
  return Math.max(0, 100 - diff * 30);
}

function ratingScore(partner: Partner): number {
  return (partner.avgRating / 5) * 100;
}

function reviewCountScore(partner: Partner, maxReviews: number): number {
  if (maxReviews === 0) return 50;
  return Math.min(100, (partner.reviewCount / maxReviews) * 100);
}

function recommendedForScore(partner: Partner, challenges: string[]): number {
  if (partner.recommendedFor.length === 0) return 50;
  const tags = partner.recommendedFor.join(" ").toLowerCase();
  let matches = 0;
  const challengeKeywords: Record<string, string[]> = {
    "Low Conversion": ["conversion", "scaling", "redesign"],
    "High Churn": ["retention", "community"],
    "Need Course Content": ["course", "content", "launch"],
    "Community is Dead": ["community", "retention"],
    "No Paid Traffic": ["paid", "acquisition", "scaling"],
    "Platform Migration": ["migration"],
    "Need Automation": ["automation", "technical"],
    "Branding/Design": ["redesign", "beginners"],
    "Analytics/Data": ["analytics", "retention", "high-revenue"],
  };
  for (const ch of challenges) {
    const keywords = challengeKeywords[ch];
    if (keywords?.some((k) => tags.includes(k))) matches++;
  }
  if (challenges.length === 0) return 50;
  return (matches / challenges.length) * 100;
}

function generateReason(partner: Partner, input: MatchInput): string {
  const parts: string[] = [];
  if (input.industry && partner.industries.includes(input.industry)) {
    parts.push(`Experience in ${input.industry}.`);
  }
  if (input.challenges.length > 0) {
    const matchedCats = input.challenges.flatMap(
      (ch) => CHALLENGE_TO_CATEGORIES[ch] ?? []
    );
    const partnerMatch = matchedCats.filter((c) =>
      partner.categories.includes(c)
    );
    if (partnerMatch.length > 0) {
      parts.push(`Strong in: ${[...new Set(partnerMatch)].join(", ")}.`);
    }
  }
  parts.push(partner.tagline);
  return parts.join(" ");
}

function pickRelevantCaseStudy(partner: Partner, input: MatchInput): string {
  if (partner.caseStudies.length === 0) return "No case study listed.";
  const first = partner.caseStudies[0];
  return `${first.title}: ${first.summary}`;
}

function suggestedIntro(partner: Partner, input: MatchInput): string {
  return `I’d recommend connecting with ${partner.name} — ${partner.tagline} They could be a strong fit for your goals.`;
}

/**
 * Deterministic scoring engine for AM matching bot.
 * Fallback when Anthropic API is not available.
 * Weights: category 40%, industry 20%, price 15%, rating 10%, review count 10%, recommendedFor 5%.
 */
export function scorePartnersForQuery(
  input: MatchInput,
  partners: Partner[]
): { partner: Partner; score: number; reason: string; relevantCaseStudy: string; suggestedIntro: string }[] {
  const maxReviews = Math.max(...partners.map((p) => p.reviewCount), 1);
  const budget = input.budget || ("$$" as PriceRange);

  const scored = partners.map((partner) => {
    const catScore = categoryMatchScore(partner, input.challenges);
    const indScore = industryMatchScore(partner, input.industry);
    const priceScore = priceCompatibilityScore(partner, budget);
    const ratScore = ratingScore(partner);
    const revScore = reviewCountScore(partner, maxReviews);
    const recScore = recommendedForScore(partner, input.challenges);

    const total =
      catScore * 0.4 +
      indScore * 0.2 +
      priceScore * 0.15 +
      ratScore * 0.1 +
      revScore * 0.1 +
      recScore * 0.05;
    const normalized = Math.round(Math.min(100, Math.max(0, total)));

    return {
      partner,
      score: normalized,
      reason: generateReason(partner, input),
      relevantCaseStudy: pickRelevantCaseStudy(partner, input),
      suggestedIntro: suggestedIntro(partner, input),
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ partner, score, reason, relevantCaseStudy, suggestedIntro: intro }) => ({
      partner,
      score,
      reason,
      relevantCaseStudy,
      suggestedIntro: intro,
    }));
}
