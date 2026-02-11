"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  Text,
  Heading,
  Badge,
  Button,
  Avatar,
  CircularProgress,
  Tooltip,
} from "frosted-ui";
import { CopyIcon } from "@radix-ui/react-icons";
import type { Partner } from "@/lib/types";
import type { MatchRecommendation } from "@/lib/matching";
import { PartnerTypeBadge } from "@/components/ui/partner-type-badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { cn } from "@/lib/utils";

export interface MatchResultCardProps {
  recommendation: MatchRecommendation;
  partner: Partner | null;
  onSendIntroduction: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const color = score > 80 ? "success" : score > 60 ? "warning" : "danger";
  return (
    <div className="relative inline-flex items-center justify-center w-14 h-14">
      <CircularProgress
        size="5"
        value={score}
        max={100}
        color={color}
      />
      <span className="absolute text-sm font-bold tabular-nums text-gray-12">
        {score}
      </span>
    </div>
  );
}

export function MatchResultCard({
  recommendation,
  partner,
  onSendIntroduction,
}: MatchResultCardProps) {
  const [copied, setCopied] = useState(false);
  const copyIntro = useCallback(() => {
    navigator.clipboard.writeText(recommendation.suggestedIntro);
    setCopied(true);
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [recommendation.suggestedIntro]);

  return (
    <Card size="3" variant="surface" className="p-5 bg-[var(--whop-dark-surface)]">
      <div className="flex gap-4">
        <div className="shrink-0">
          <ScoreRing score={recommendation.matchScore} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {partner && (
              <Avatar
                size="4"
                src={partner.logo}
                fallback={partner.name.slice(0, 2).toUpperCase()}
                className="rounded-lg shrink-0"
              />
            )}
            <Heading size="4">{recommendation.partnerName}</Heading>
            {partner && (
              <>
                <PartnerTypeBadge type={partner.partnerType} />
                <RatingStars rating={partner.avgRating} size="sm" />
              </>
            )}
          </div>

          <Text size="2" weight="medium" className="mb-1">
            Why they&apos;re a match
          </Text>
          <Text size="2" color="gray" className="mb-3">
            {recommendation.reason}
          </Text>

          {recommendation.relevantCaseStudy && (
            <>
              <Text size="2" weight="medium" className="mb-1">
                Relevant case study
              </Text>
              <Text size="1" color="gray" className="mb-3">
                {recommendation.relevantCaseStudy}
              </Text>
            </>
          )}

          <div className="rounded-lg bg-gray-3 border border-[var(--whop-dark-border)] p-3 mb-4">
            <Text size="1" color="gray" className="mb-1">
              Suggested intro
            </Text>
            <p className="text-sm text-[var(--whop-snow)] mb-2">{recommendation.suggestedIntro}</p>
            <Tooltip content={copied ? "Copied!" : "Copy to clipboard"}>
              <button
                type="button"
                onClick={copyIntro}
                className="inline-flex items-center gap-1 text-xs text-orange-11 hover:text-orange-12 transition-colors"
              >
                <CopyIcon width={12} height={12} /> {copied ? "Copied!" : "Copy"}
              </button>
            </Tooltip>
          </div>

          <div className="flex flex-wrap gap-2">
            {partner && (
              <Link href={`/partners/${partner.slug}?am=1`}>
                <Button size="2" variant="soft" color="gray">
                  View Full Profile
                </Button>
              </Link>
            )}
            <Button size="2" color="orange" variant="solid" onClick={onSendIntroduction}>
              Send Introduction
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
