"use client";

import Link from "next/link";
import { Heading, Text } from "frosted-ui";
import { cn } from "@/lib/utils";

const navLinkClass =
  "px-4 py-2 rounded-md text-sm font-medium text-gray-11 hover:bg-gray-4 hover:text-gray-12";
const navLinkActiveClass = "bg-gray-5 text-gray-12";

export function Navbar({ isAMActive }: { isAMActive?: boolean } = {}) {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between gap-6 px-6 py-3 border-b border-gray-6"
      style={{ background: "var(--whop-dark)" }}
    >
      <Link href="/partners" className="flex items-center gap-1 shrink-0">
        <Heading size="4" weight="bold">
          whop
        </Heading>
        <Text size="3" color="gray">
          /partners
        </Text>
      </Link>

      <div className="flex items-center gap-1">
        <Link
          href="/partners"
          className={cn(navLinkClass, isAMActive && "text-gray-11")}
        >
          Directory
        </Link>
        <Link
          href="/am"
          className={cn(navLinkClass, isAMActive && navLinkActiveClass)}
        >
          AM Dashboard
        </Link>
        <Link href="/admin" className={navLinkClass}>
          Admin
        </Link>
      </div>

      <div className="shrink-0">
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-orange-9 text-white hover:bg-orange-10 transition-colors"
        >
          Become a Partner
        </Link>
      </div>
    </nav>
  );
}
