"use client";

import Link from "next/link";
import { Card, Avatar, Heading, Text, Badge } from "frosted-ui";
import type { Partner } from "@/lib/types";
import { RatingStars } from "./rating-stars";
import { PriceBadge } from "./price-badge";
import { PartnerTypeBadge } from "./partner-type-badge";
import { cn } from "@/lib/utils";

export interface PartnerCardProps {
  partner: Partner;
  showInternalFields?: boolean;
}

const MAX_VISIBLE_CATEGORIES = 3;

export function PartnerCard({ partner, showInternalFields = false }: PartnerCardProps) {
  const categoriesToShow = partner.categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const remainingCount = partner.categories.length - MAX_VISIBLE_CATEGORIES;

  return (
    <Link href={`/partners/${partner.slug}`} className="block h-full">
      <Card
        size="2"
        variant="surface"
        className={cn(
          "h-full transition-[border-color,box-shadow] duration-150",
          "hover:border-gray-6 hover:shadow-sm"
        )}
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-start gap-3">
            <Avatar
              size="5"
              src={partner.logo}
              fallback={partner.name.slice(0, 2).toUpperCase()}
              className="shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Heading size="3" trim="both" className="truncate">
                  {partner.name}
                </Heading>
                <PartnerTypeBadge type={partner.partnerType} />
              </div>
              <Text size="2" color="gray" className="line-clamp-2 mt-0.5">
                {partner.tagline}
              </Text>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {categoriesToShow.map((cat) => (
              <Badge key={cat} variant="soft" color="gray" size="1">
                {cat}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Text size="1" color="gray">
                +{remainingCount} more
              </Text>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-1 border-t border-gray-6">
            <span className="flex items-center gap-2">
              <RatingStars rating={partner.avgRating} size="sm" />
              <Text size="1" color="gray">
                {partner.reviewCount} reviews
              </Text>
            </span>
            <PriceBadge range={partner.priceRange} />
          </div>

          {showInternalFields && partner.internalTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-6">
              {partner.internalTags.map((tag) => (
                <Badge key={tag} variant="outline" color="orange" size="1">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
