"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heading, Text, Button, Sheet } from "frosted-ui";
import {
  DashboardIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  PersonIcon,
  ChatBubbleIcon,
  ShieldIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { AdminToastProvider } from "@/contexts/admin-toast-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon },
  { href: "/admin/invites", label: "Invite Partners", icon: EnvelopeClosedIcon },
  { href: "/admin/submissions", label: "Review Submissions", icon: FileTextIcon },
  { href: "/admin/manage", label: "Manage Partners", icon: PersonIcon },
  { href: "/admin/reviews", label: "Moderate Reviews", icon: ChatBubbleIcon },
] as const;

function NavLinks({
  pathname,
  className,
  onLinkClick,
}: {
  pathname: string;
  className?: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className={cn("p-2", className)}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-gray-4 text-gray-12"
                : "text-gray-11 hover:bg-gray-3 hover:text-gray-12"
            )}
          >
            <Icon width={18} height={18} />
            <Text size="2">{label}</Text>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminToastProvider>
      <div className="flex min-h-screen">
        <aside
          className="w-[240px] shrink-0 border-r border-[var(--whop-dark-border)] hidden md:flex flex-col"
          style={{ background: "var(--whop-dark-surface)" }}
        >
          <div className="p-4 border-b border-[var(--whop-dark-border)] flex items-center gap-2">
            <ShieldIcon width={24} height={24} className="text-gray-11" />
            <Heading size="4">Partner Admin</Heading>
          </div>
          <NavLinks pathname={pathname} className="flex-1" />
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 px-2 py-2 border-b border-[var(--whop-dark-border)] md:hidden" style={{ background: "var(--whop-dark-surface)" }}>
            <Button
              variant="ghost"
              size="2"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <HamburgerMenuIcon width={20} height={20} />
            </Button>
            <Heading size="4">Partner Admin</Heading>
          </div>
          <Sheet.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <Sheet.Content className="pt-6 pb-8">
              <Sheet.Header className="px-4 pb-4">
                <Sheet.Title>Menu</Sheet.Title>
              </Sheet.Header>
              <Sheet.Body className="px-4">
                <NavLinks pathname={pathname} onLinkClick={() => setMobileMenuOpen(false)} />
                <Sheet.Close asChild>
                  <Button variant="soft" color="gray" className="w-full mt-4">Close</Button>
                </Sheet.Close>
              </Sheet.Body>
            </Sheet.Content>
          </Sheet.Root>
          <div
            className="flex items-center justify-center gap-2 py-2 px-4 text-center text-sm font-medium text-white"
            style={{ background: "var(--red-9)" }}
            role="status"
          >
            <span aria-hidden>⚠️</span>
            Admin Panel — Changes affect the live directory
          </div>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
