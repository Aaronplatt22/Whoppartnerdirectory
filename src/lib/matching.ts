import type { Partner } from "./types";

/**
 * Scoring engine for AM matching bot.
 * Fallback when AI (Anthropic) is not available.
 */
export function scorePartnersForQuery(
  _query: string,
  partners: Partner[]
): { partner: Partner; score: number }[] {
  return partners.map((partner) => ({ partner, score: 0 }));
}
