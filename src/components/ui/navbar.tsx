"use client";

import Link from "next/link";
import { Heading, Text } from "frosted-ui";

export function Navbar() {
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
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-11 hover:bg-gray-4 hover:text-gray-12"
        >
          Directory
        </Link>
        <Link
          href="/am"
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-11 hover:bg-gray-4 hover:text-gray-12"
        >
          For AMs
        </Link>
        <Link
          href="/admin"
          className="px-4 py-2 rounded-md text-sm font-medium text-gray-11 hover:bg-gray-4 hover:text-gray-12"
        >
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
