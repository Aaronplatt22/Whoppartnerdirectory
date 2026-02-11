"use client";

import { useState, useCallback } from "react";
import {
  Heading,
  Text,
  Select,
  Button,
  Checkbox,
  Skeleton,
  Card,
} from "frosted-ui";
import type { Partner } from "@/lib/types";
import type { MatchInput, MatchResult, MatchRecommendation } from "@/lib/matching";
import {
  INDUSTRIES,
  REVENUE_OPTIONS,
  MEMBER_COUNT_OPTIONS,
  CHALLENGE_OPTIONS,
  BUDGET_OPTIONS,
} from "@/lib/constants";
import { scorePartnersForQuery } from "@/lib/matching";
import { MatchResultCard } from "./match-result-card";
import { RecommendDialog } from "./recommend-dialog";

export function MatchingBot({ allPartners }: { allPartners: Partner[] }) {
  const [industry, setIndustry] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [challenges, setChallenges] = useState<string[]>([]);
  const [budget, setBudget] = useState<MatchInput["budget"]>("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [recommendOpen, setRecommendOpen] = useState(false);
  const [recommendPartner, setRecommendPartner] = useState<Partner | null>(null);
  const [recommendIntro, setRecommendIntro] = useState("");

  const toggleChallenge = (ch: string) => {
    setChallenges((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const runMatch = useCallback(async () => {
    setLoading(true);
    setError(false);
    setResult(null);
    const input: MatchInput = {
      industry,
      monthlyRevenue,
      memberCount,
      challenges,
      budget,
      additionalContext,
    };

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      let data: { fallback?: boolean; analysis?: string; recommendations?: MatchResult["recommendations"] };
      try {
        data = await res.json();
      } catch {
        data = { fallback: true };
      }
      if (!res.ok || data.fallback) {
        const scored = scorePartnersForQuery(input, allPartners);
        setResult({
          analysis: "Match based on your criteria (scoring engine).",
          recommendations: scored.map((s) => ({
            partnerId: s.partner.id,
            partnerName: s.partner.name,
            matchScore: s.score,
            reason: s.reason,
            relevantCaseStudy: s.relevantCaseStudy,
            suggestedIntro: s.suggestedIntro,
          })),
        });
        if (!res.ok) setError(true);
      } else {
        setResult({
          analysis: data.analysis ?? "",
          recommendations: data.recommendations ?? [],
        });
      }
    } catch {
      setError(true);
      const scored = scorePartnersForQuery(input, allPartners);
      setResult({
        analysis: "Fallback results (API unavailable).",
        recommendations: scored.map((s) => ({
          partnerId: s.partner.id,
          partnerName: s.partner.name,
          matchScore: s.score,
          reason: s.reason,
          relevantCaseStudy: s.relevantCaseStudy,
          suggestedIntro: s.suggestedIntro,
        })),
      });
    } finally {
      setLoading(false);
    }
  }, [industry, monthlyRevenue, memberCount, challenges, budget, additionalContext, allPartners]);

  const openRecommend = (rec: MatchRecommendation) => {
    const partner = allPartners.find((p) => p.id === rec.partnerId) ?? null;
    setRecommendPartner(partner);
    setRecommendIntro(rec.suggestedIntro);
    setRecommendOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <Heading size="5" className="mb-4">
          Client details
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-11 mb-1">
              Client Industry
            </label>
            <Select.Root value={industry} onValueChange={(v) => setIndustry(v ?? "")}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {INDUSTRIES.map((ind) => (
                  <Select.Item key={ind} value={ind}>
                    {ind}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-11 mb-1">
              Monthly Revenue
            </label>
            <Select.Root value={monthlyRevenue} onValueChange={(v) => setMonthlyRevenue(v ?? "")}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {REVENUE_OPTIONS.map((rev) => (
                  <Select.Item key={rev} value={rev}>
                    {rev}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-11 mb-1">
              Member Count
            </label>
            <Select.Root value={memberCount} onValueChange={(v) => setMemberCount(v ?? "")}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {MEMBER_COUNT_OPTIONS.map((m) => (
                  <Select.Item key={m} value={m}>
                    {m}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-11 mb-1">
              Budget for Partner Services
            </label>
            <Select.Root value={budget} onValueChange={(v) => setBudget((v ?? budget) as MatchInput["budget"])}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {BUDGET_OPTIONS.map((b) => (
                  <Select.Item key={b.value} value={b.value}>
                    {b.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-11 mb-2">
            Primary Challenges
          </label>
          <div className="flex flex-wrap gap-3">
            {CHALLENGE_OPTIONS.map((ch) => (
              <Checkbox
                key={ch}
                size="2"
                checked={challenges.includes(ch)}
                onCheckedChange={() => toggleChallenge(ch)}
              >
                <Text size="2">{ch}</Text>
              </Checkbox>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-11 mb-1">
            Additional Context
          </label>
          <textarea
            className="w-full min-h-[80px] rounded-md border border-gray-6 bg-gray-2 px-3 py-2 text-sm text-gray-12 placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-orange-8"
            placeholder="Any other details about the client..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <Button
            size="3"
            color="orange"
            variant="solid"
            onClick={runMatch}
            disabled={loading}
            className="btn-press"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
                Finding partners...
              </>
            ) : (
              "Find Matching Partners"
            )}
          </Button>
        </div>
      </section>

      {loading && (
        <section className="flex flex-col gap-4">
          <Heading size="5">Recommendations</Heading>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} size="3" variant="surface" className="p-5">
                <div className="flex gap-4">
                  <Skeleton.Avatar className="w-14 h-14 rounded-full skeleton-pulse" />
                  <div className="flex-1 space-y-2">
                    <Skeleton.Rect className="h-5 w-48 skeleton-pulse" />
                    <Skeleton.Rect className="h-4 w-full skeleton-pulse" />
                    <Skeleton.Rect className="h-4 w-3/4 skeleton-pulse" />
                    <Skeleton.Rect className="h-10 w-24 skeleton-pulse mt-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {error && !loading && (
        <Card size="3" variant="surface" className="p-6 border-red-6 bg-red-2/20">
          <Heading size="4" className="mb-2">
            Something went wrong
          </Heading>
          <Text size="2" color="gray" className="mb-4">
            We couldn&apos;t reach the matching service. You can try again or use the results below if we have fallback suggestions.
          </Text>
          <Button
            size="2"
            color="red"
            variant="soft"
            className="btn-press"
            onClick={() => { setError(false); runMatch(); }}
          >
            Try again
          </Button>
        </Card>
      )}

      {result && !loading && (
        <section className="partners-result-fade">
          <Heading size="5" className="mb-2">
            Recommendations
          </Heading>
          {result.analysis && (
            <Text size="2" color="gray" className="mb-4">
              {result.analysis}
            </Text>
          )}
          <div className="flex flex-col gap-4">
            {result.recommendations.map((rec, index) => (
              <div
                key={rec.partnerId}
                className="match-card-stagger"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MatchResultCard
                  recommendation={rec}
                  partner={allPartners.find((p) => p.id === rec.partnerId) ?? null}
                  onSendIntroduction={() => openRecommend(rec)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <RecommendDialog
        open={recommendOpen}
        onOpenChange={setRecommendOpen}
        partner={recommendPartner}
        suggestedIntro={recommendIntro}
        onSuccess={() => {}}
      />
    </div>
  );
}
