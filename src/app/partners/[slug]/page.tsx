"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, notFound } from "next/navigation";
import {
  Heading,
  Text,
  Card,
  Badge,
  Avatar,
  Button,
  Inset,
  Separator,
} from "frosted-ui";
import {
  StarFilledIcon,
  Link2Icon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { mockPartners } from "@/data/mock-partners";
import type { Partner, PartnerType, CaseStudy, Review } from "@/lib/types";
import { Navbar } from "@/components/ui/navbar";
import { PartnerTypeBadge } from "@/components/ui/partner-type-badge";
import { PriceBadge } from "@/components/ui/price-badge";
import { RatingStars } from "@/components/ui/rating-stars";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { cn } from "@/lib/utils";

const COVER_GRADIENTS: Record<PartnerType, string> = {
  agency: "linear-gradient(135deg, var(--orange-11) 0%, var(--orange-8) 50%, var(--orange-6) 100%)",
  service_provider: "linear-gradient(135deg, var(--blue-11) 0%, var(--blue-8) 50%, var(--blue-6) 100%)",
  tech_partner: "linear-gradient(135deg, var(--purple-11) 0%, var(--purple-8) 50%, var(--purple-6) 100%)",
};

function formatMetricLabel(key: string): string {
  const labels: Record<string, string> = {
    revenue: "Revenue Growth",
    members: "Members",
    timeframe: "Timeframe",
    retention: "Retention",
    churn: "Churn",
    conversion: "Conversion",
    roas: "ROAS",
    dailyActive: "Daily Active",
    completion: "Completion",
    deliveryTime: "Delivery",
    accuracy: "Accuracy",
    timeSaved: "Time Saved",
    automations: "Automations",
    users: "Users",
    followers: "Followers",
    signups: "Signups",
    churnReduction: "Churn Reduction",
    revenueRetained: "Revenue Retained",
    conversionIncrease: "Conversion",
    failureRate: "Failure Rate",
    countries: "Countries",
  };
  return labels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarFilledIcon
          key={i}
          width={16}
          height={16}
          style={{ color: i <= rating ? "#FA4616" : "var(--gray-7)" }}
        />
      ))}
    </span>
  );
}

export default function PartnerProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];
  const isAMView = searchParams.get("am") === "1";

  const partner = useMemo(
    () => (slug ? mockPartners.find((p) => p.slug === slug) : null),
    [slug]
  );

  const [copied, setCopied] = useState(false);
  const copyLink = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => setCopied(true));
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (!partner) notFound();

  const coverGradient = COVER_GRADIENTS[partner.partnerType];

  const ctaBar = (
    <div className="flex flex-wrap items-center gap-3 py-3 px-4 border-b border-gray-6 bg-gray-2/80 backdrop-blur-sm">
      <a
        href={`mailto:${partner.contactEmail}`}
        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-orange-9 text-white hover:bg-orange-10 transition-colors"
      >
        Contact Partner
      </a>
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-gray-4 text-gray-11 hover:bg-gray-5 transition-colors"
      >
        Visit Website
      </a>
      {partner.calendlyLink && (
        <a
          href={partner.calendlyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-gray-4 text-gray-11 hover:bg-gray-5 transition-colors"
        >
          Book a Call
        </a>
      )}
    </div>
  );

  const sidebarCtas = (
    <div className="flex flex-col gap-2">
      <a
        href={`mailto:${partner.contactEmail}`}
        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-orange-9 text-white hover:bg-orange-10 transition-colors w-full"
      >
        Contact Partner
      </a>
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-gray-4 text-gray-11 hover:bg-gray-5 transition-colors w-full"
      >
        Visit Website
      </a>
      {partner.calendlyLink && (
        <a
          href={partner.calendlyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-gray-4 text-gray-11 hover:bg-gray-5 transition-colors w-full"
        >
          Book a Call
        </a>
      )}
      <Button
        size="2"
        variant="ghost"
        color="gray"
        className="w-full"
        onClick={copyLink}
      >
        {copied ? (
          <>
            <CheckIcon width={16} height={16} /> Copied!
          </>
        ) : (
          <>
            <Link2Icon width={16} height={16} /> Share this partner
          </>
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumbs + Back */}
      <Inset side="all" clip="padding-box" className="max-w-6xl mx-auto px-4 py-3 border-b border-gray-6 bg-[var(--whop-dark-surface)]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <Link href="/partners" className="text-gray-11 hover:text-gray-12 transition-colors">
            Partners
          </Link>
          <ChevronRightIcon width={14} height={14} className="text-gray-8" />
          <span className="text-gray-12 font-medium truncate">{partner.name}</span>
        </nav>
        <Link
          href="/partners"
          className="inline-flex items-center gap-1 mt-2 text-sm text-orange-11 hover:text-orange-12 transition-colors"
        >
          ← Back to Directory
        </Link>
      </Inset>

      {/* Cover & overlapping header */}
      <section className="relative">
        <div
          className="h-48 md:h-56 w-full bg-cover bg-center"
          style={{
            backgroundImage: partner.coverImage
              ? `url(${partner.coverImage})`
              : undefined,
            background: partner.coverImage ? undefined : coverGradient,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-1 to-transparent pt-8 pb-4">
          <Inset side="all" clip="padding-box" className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Avatar
                size="8"
                src={partner.logo}
                fallback={partner.name.slice(0, 2).toUpperCase()}
                className="shrink-0 rounded-xl border-4 border-gray-2 shadow-lg w-20 h-20"
              />
              <div className="flex-1 min-w-0">
                <Heading size="7" className="mb-1">
                  {partner.name}
                </Heading>
                <Text size="3" color="gray" className="mb-3">
                  {partner.tagline}
                </Text>
                <div className="flex flex-wrap items-center gap-2">
                  <PartnerTypeBadge type={partner.partnerType} />
                  <Text size="2" color="gray">
                    {partner.location} · {partner.timezone}
                  </Text>
                  <Badge variant="soft" color="gray" size="1">
                    {partner.responseTime}
                  </Badge>
                  <Text size="2" color="gray">
                    {partner.languages.join(", ")}
                  </Text>
                </div>
              </div>
            </div>
          </Inset>
        </div>
      </section>

      {/* Sticky CTA bar */}
      <div className="sticky z-40 top-[57px]">{ctaBar}</div>

      <div className="flex flex-col lg:flex-row gap-8 py-8 px-4 max-w-6xl mx-auto w-full">
        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-10">
          {/* About */}
          <section>
            <Heading size="5" className="mb-4">
              About
            </Heading>
            <Text size="2" className="block mb-4">
              {partner.description}
            </Text>
            <div className="flex flex-wrap gap-2 mb-3">
              <Text size="2" weight="bold" color="gray" className="w-full">
                Services
              </Text>
              {partner.categories.map((cat) => (
                <Badge key={cat} variant="soft" color="gray" size="2">
                  {cat}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Text size="2" weight="bold" color="gray" className="w-full">
                Industries
              </Text>
              {partner.industries.map((ind) => (
                <Badge key={ind} variant="outline" color="gray" size="2">
                  {ind}
                </Badge>
              ))}
            </div>
          </section>

          {/* AM-only: Internal info */}
          {isAMView && (
            <section>
              <Heading size="5" className="mb-4">
                Internal (AM)
              </Heading>
              <Card
                size="3"
                variant="surface"
                className="p-5 border-amber-6 bg-amber-2/30"
              >
                {partner.internalNotes && (
                  <div className="mb-4">
                    <Text size="2" weight="bold" className="mb-1">
                      Internal Notes
                    </Text>
                    <Text size="2" color="gray">
                      {partner.internalNotes}
                    </Text>
                  </div>
                )}
                {partner.internalTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Text size="2" weight="bold" className="w-full">
                      Internal Tags
                    </Text>
                    {partner.internalTags.map((tag) => (
                      <Badge key={tag} variant="outline" color="amber" size="2">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <Text size="1" color="gray">
                      Whop Contact
                    </Text>
                    <Text size="2">{partner.whopContactPerson}</Text>
                  </div>
                  <div>
                    <Text size="1" color="gray">
                      Last Engagement
                    </Text>
                    <Text size="2">{partner.lastEngagementDate}</Text>
                  </div>
                </div>
                {partner.recommendedFor.length > 0 && (
                  <div className="mt-4">
                    <Text size="2" weight="bold" className="mb-2">
                      Recommended For
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {partner.recommendedFor.map((tag) => (
                        <Badge key={tag} variant="soft" color="orange" size="1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </section>
          )}

          {/* Case Studies */}
          <section>
            <Heading size="5" className="mb-4">
              Case Studies
            </Heading>
            {partner.caseStudies.length > 0 ? (
              <div className="flex flex-col gap-6">
                {partner.caseStudies.map((cs: CaseStudy, idx: number) => (
                  <Card key={idx} size="3" variant="surface" className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Heading size="4">{cs.title}</Heading>
                      <Badge variant="soft" color="orange" size="1">
                        {cs.whopName}
                      </Badge>
                    </div>
                    <Text size="2" color="gray" className="mb-4">
                      {cs.summary}
                    </Text>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {Object.entries(cs.metrics).map(([key, value]) => (
                        <Card
                          key={key}
                          size="2"
                          variant="classic"
                          className="p-4 text-center"
                        >
                          <div className="text-2xl font-bold text-orange-11">
                            {value}
                          </div>
                          <Text size="1" color="gray">
                            {formatMetricLabel(key)}
                          </Text>
                        </Card>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card size="2" variant="surface" className="p-6 bg-[var(--whop-dark-surface)]">
                <Text size="2" color="gray">
                  No case studies yet.
                </Text>
              </Card>
            )}
          </section>

          {/* Featured Whops */}
          {partner.featuredWhops.length > 0 && (
            <section>
              <Heading size="5" className="mb-4">
                Whops They&apos;ve Worked With
              </Heading>
              <div className="flex flex-wrap gap-6">
                {partner.featuredWhops.map((fw) => (
                  <div
                    key={fw.name}
                    className="flex flex-col items-center gap-2"
                  >
                    <Avatar
                      size="6"
                      src={fw.logo}
                      fallback={fw.name.slice(0, 2).toUpperCase()}
                      className="rounded-full"
                    />
                    <Text size="2" weight="medium">
                      {fw.name}
                    </Text>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <Heading size="5" className="mb-2">
              Reviews
            </Heading>
            <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-[var(--whop-dark-elevated)]">
              <span className="text-4xl font-bold tabular-nums text-[var(--whop-snow)]">
                {partner.avgRating.toFixed(1)}
              </span>
              <div className="flex flex-col gap-0.5">
                <RatingStars rating={partner.avgRating} size="md" />
                <Text size="2" color="gray">
                  based on {partner.reviewCount} reviews
                </Text>
              </div>
            </div>
            {partner.reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {partner.reviews.map((review: Review, idx: number) => (
                  <Card key={idx} size="2" variant="surface" className="p-4 bg-[var(--whop-dark-surface)]">
                    <div className="flex items-center gap-2 mb-2">
                      <ReviewStars rating={review.rating} />
                    </div>
                    <Text size="2" className="mb-3">
                      {review.text}
                    </Text>
                    <Text size="1" color="gray">
                      {review.reviewerName} · {review.whopName} · {review.date}
                    </Text>
                  </Card>
                ))}
              </div>
            ) : (
              <Card size="2" variant="surface" className="p-6 bg-[var(--whop-dark-surface)]">
                <Text size="2" color="gray">
                  No reviews yet — be the first to work with this partner.
                </Text>
              </Card>
            )}
          </section>
        </main>

        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0 lg:sticky lg:top-[120px] lg:self-start">
          <Card size="3" variant="surface" className="p-5">
            <Heading size="3" className="mb-4">
              Quick stats
            </Heading>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <Text size="2" color="gray">
                  Rating
                </Text>
                <span className="font-semibold">{partner.avgRating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <Text size="2" color="gray">
                  Reviews
                </Text>
                <span className="font-semibold">{partner.reviewCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <Text size="2" color="gray">
                  Price
                </Text>
                <PriceBadge range={partner.priceRange} />
              </div>
              <div className="flex justify-between">
                <Text size="2" color="gray">
                  Response
                </Text>
                <Text size="2">{partner.responseTime}</Text>
              </div>
              <div className="flex justify-between">
                <Text size="2" color="gray">
                  Languages
                </Text>
                <Text size="2">{partner.languages.join(", ")}</Text>
              </div>
            </dl>
            <Separator size="4" className="my-4" />
            {sidebarCtas}
          </Card>
        </aside>
      </div>
      <ScrollToTop />
    </div>
  );
}
