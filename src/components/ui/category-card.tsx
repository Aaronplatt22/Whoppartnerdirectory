"use client";

import { Card, Text } from "frosted-ui";
import {
  ChatBubbleIcon,
  DesktopIcon,
  RocketIcon,
  VideoIcon,
  LightningBoltIcon,
  BarChartIcon,
  ColorWheelIcon,
  CodeIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ width?: number; height?: number; className?: string }>> = {
  ChatBubbleIcon,
  DesktopIcon,
  RocketIcon,
  VideoIcon,
  LightningBoltIcon,
  BarChartIcon,
  ColorWheelIcon,
  CodeIcon,
  ArrowRightIcon,
};

export interface CategoryCardProps {
  name: string;
  icon: string;
  count: number;
  onClick?: () => void;
  selected?: boolean;
}

export function CategoryCard({ name, icon, count, onClick, selected }: CategoryCardProps) {
  const IconComponent = ICON_MAP[icon] ?? BarChartIcon;

  return (
    <Card
      size="2"
      variant="surface"
      className={cn(
        "cursor-pointer category-card-hover bg-[var(--whop-dark-surface)] border-[var(--whop-dark-border)]",
        selected && "ring-2 ring-orange-9 border-orange-9"
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      role="button"
    >
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <IconComponent width={28} height={28} className="text-gray-11" />
        <Text size="2" weight="bold">
          {name}
        </Text>
        <Text size="1" color="gray">
          {count} partners
        </Text>
      </div>
    </Card>
  );
}
