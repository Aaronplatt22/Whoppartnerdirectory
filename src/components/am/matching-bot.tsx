"use client";

import { useState, useCallback } from "react";
import {
  Heading,
  Text,
  Select,
  Button,
  Checkbox,
  Spinner,
  Inset,
} from "frosted-ui";
import { mockPartners } from "@/data/mock-partners";
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

export function MatchingBot() {
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
      const data = await res.json();

      if (data.fallback) {
        const scored = scorePartnersForQuery(input, mockPartners);
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
      } else {
        setResult({
          analysis: data.analysis ?? "",
          recommendations: data.recommendations ?? [],
        });
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [industry, monthlyRevenue, memberCount, challenges, budget, additionalContext]);

  const openRecommend = (rec: MatchRecommendation) => {
    const partner = mockPartners.find((p) => p.id === rec.partnerId) ?? null;
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
            <Select.Root value={industry} onValueChange={setIndustry}>
              <Select.Trigger size="2" variant="surface" className="w-full" placeholder="Select industry" />
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
            <Select.Root value={monthlyRevenue} onValueChange={setMonthlyRevenue}>
              <Select.Trigger size="2" variant="surface" className="w-full" placeholder="Select revenue" />
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
            <Select.Root value={memberCount} onValueChange={setMemberCount}>
              <Select.Trigger size="2" variant="surface" className="w-full" placeholder="Select range" />
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
            <Select.Root value={budget} onValueChange={(v) => setBudget(v as MatchInput["budget"])}>
              <Select.Trigger size="2" variant="surface" className="w-full" placeholder="Select budget" />
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
          >
            {loading ? (
              <>
                <Spinner size="2" className="mr-2" />
                Finding partners...
              </>
            ) : (
              "Find Matching Partners"
            )}
          </Button>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-6 bg-red-2 p-4 text-center">
          <Text size="2" color="red">
            Something went wrong. Please try again.
          </Text>
          <Button
            size="2"
            variant="soft"
            color="red"
            className="mt-3"
            onClick={() => { setError(false); runMatch(); }}
          >
            Try again
          </Button>
        </div>
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
            {result.recommendations.map((rec) => (
              <MatchResultCard
                key={rec.partnerId}
                recommendation={rec}
                partner={mockPartners.find((p) => p.id === rec.partnerId) ?? null}
                onSendIntroduction={() => openRecommend(rec)}
              />
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
