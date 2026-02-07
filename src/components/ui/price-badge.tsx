"use client";

import { Badge } from "frosted-ui";
import type { PriceRange } from "@/lib/types";

export interface PriceBadgeProps {
  range: PriceRange;
}

const RANGES: PriceRange[] = ["$", "$$", "$$$", "$$$$"];

export function PriceBadge({ range }: PriceBadgeProps) {
  const level = RANGES.indexOf(range) + 1;

  return (
    <Badge variant="soft" color="gray" size="1" className="gap-0 font-medium">
      {RANGES.map((_, i) => (
        <span
          key={i}
          style={{
            color: i < level ? "var(--gray-12)" : "var(--gray-8)",
          }}
        >
          $
        </span>
      ))}
    </Badge>
  );
}
