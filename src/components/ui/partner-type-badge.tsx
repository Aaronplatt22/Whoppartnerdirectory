"use client";

import { Badge } from "frosted-ui";
import type { PartnerType } from "@/lib/types";
import { PARTNER_TYPE_LABELS } from "@/lib/constants";

export interface PartnerTypeBadgeProps {
  type: PartnerType;
}

const BADGE_COLORS: Record<PartnerType, "orange" | "blue" | "purple"> = {
  agency: "orange",
  service_provider: "blue",
  tech_partner: "purple",
};

export function PartnerTypeBadge({ type }: PartnerTypeBadgeProps) {
  return (
    <Badge variant="soft" color={BADGE_COLORS[type]} size="1">
      {PARTNER_TYPE_LABELS[type]}
    </Badge>
  );
}
