"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Heading, Text, Button, Sheet } from "frosted-ui";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const navLinkClass =
  "px-4 py-2 rounded-md text-sm font-medium text-gray-11 hover:bg-gray-4 hover:text-gray-12 transition-colors";
const navLinkActiveClass = "bg-gray-5 text-gray-12";

export function Navbar({ isAMActive }: { isAMActive?: boolean } = {}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const isDirectory = pathname === "/partners" || pathname.startsWith("/partners/");
  const isAM = pathname.startsWith("/am");
  const isAdmin = pathname.startsWith("/admin");

  const navLinks = (
    <>
      <Link
        href="/partners"
        className={cn(navLinkClass, isDirectory && navLinkActiveClass)}
        onClick={() => setMobileOpen(false)}
      >
        Directory
      </Link>
      {(role === "admin" || role === "account_manager") && (
        <Link
          href="/am"
          className={cn(navLinkClass, isAM && navLinkActiveClass)}
          onClick={() => setMobileOpen(false)}
        >
          AM Dashboard
        </Link>
      )}
      {role === "admin" && (
        <Link
          href="/admin"
          className={cn(navLinkClass, isAdmin && navLinkActiveClass)}
          onClick={() => setMobileOpen(false)}
        >
          Admin
        </Link>
      )}
      {role === "partner" && (
        <Link
          href="/partner"
          className={cn(navLinkClass, pathname.startsWith("/partner") && navLinkActiveClass)}
          onClick={() => setMobileOpen(false)}
        >
          Partner dashboard
        </Link>
      )}
    </>
  );

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-gray-6"
      style={{ background: "var(--whop-dark)" }}
    >
      <Link href="/partners" className="flex items-center gap-1 shrink-0">
        <Heading size="4" weight="bold">
          whop
        </Heading>
        <Text size="3" color="gray" className="hidden sm:inline">
          /partners
        </Text>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {navLinks}
      </div>

      <div className="flex items-center gap-2">
        {!session ? (
          <>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium bg-orange-9 text-white hover:bg-orange-10 transition-transform btn-press cta-glow"
              onClick={() => setMobileOpen(false)}
            >
              Become a Partner
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md px-3 sm:px-4 py-2 text-sm font-medium text-gray-11 hover:bg-gray-4 hover:text-gray-12 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Log in
            </Link>
          </>
        ) : (
          <Button
            size="2"
            variant="soft"
            color="gray"
            onClick={() => signOut({ callbackUrl: "/partners" })}
          >
            Log out
          </Button>
        )}
        <Button
          variant="ghost"
          size="2"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <HamburgerMenuIcon width={20} height={20} />
        </Button>
      </div>

      <Sheet.Root
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        {...({ direction: "top" } as object)}
      >
        <Sheet.Content className="pt-6 pb-8 px-4">
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            <Sheet.Title className="sr-only">Menu</Sheet.Title>
            {navLinks}
            {!session ? (
              <>
                <Link href="/apply" onClick={() => setMobileOpen(false)}>
                  <Button size="2" color="orange" className="w-full mt-2">
                    Become a Partner
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button size="2" variant="soft" className="w-full">
                    Log in
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                size="2"
                variant="soft"
                color="gray"
                className="w-full mt-2"
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: "/partners" });
                }}
              >
                Log out
              </Button>
            )}
            <Sheet.Close>
              <Button variant="soft" color="gray" className="mt-4 w-full">
                Close
              </Button>
            </Sheet.Close>
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </nav>
  );
}
