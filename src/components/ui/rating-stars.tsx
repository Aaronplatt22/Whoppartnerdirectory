"use client";

import { Text } from "frosted-ui";
import { StarFilledIcon } from "@radix-ui/react-icons";

const STAR_COLOR = "#FA4616";
const STAR_EMPTY = "var(--gray-7)";

export interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md";
}

export function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;
  const iconSize = size === "sm" ? 14 : 18;

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          if (i < fullStars) {
            return (
              <StarFilledIcon
                key={i}
                width={iconSize}
                height={iconSize}
                style={{ color: STAR_COLOR, flexShrink: 0 }}
              />
            );
          }
          if (i === fullStars && partial > 0) {
            return (
              <span
                key={i}
                className="relative inline-flex"
                style={{ width: iconSize, height: iconSize }}
              >
                <StarFilledIcon
                  width={iconSize}
                  height={iconSize}
                  style={{ color: STAR_EMPTY, flexShrink: 0 }}
                />
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${partial * 100}%` }}
                >
                  <StarFilledIcon
                    width={iconSize}
                    height={iconSize}
                    style={{ color: STAR_COLOR, flexShrink: 0 }}
                  />
                </span>
              </span>
            );
          }
          return (
            <StarFilledIcon
              key={i}
              width={iconSize}
              height={iconSize}
              style={{ color: STAR_EMPTY, flexShrink: 0 }}
            />
          );
        })}
      </span>
      <Text size={size === "sm" ? "1" : "2"} color="gray" className="ml-0.5">
        {rating.toFixed(1)}
      </Text>
    </span>
  );
}
