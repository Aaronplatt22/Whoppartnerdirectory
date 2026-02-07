"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heading, Text } from "frosted-ui";
import {
  DashboardIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  PersonIcon,
  ChatBubbleIcon,
  ShieldIcon,
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminToastProvider>
      <div className="flex min-h-screen">
        <aside
          className="w-[240px] shrink-0 border-r border-gray-6 bg-gray-2 flex flex-col"
          style={{ width: 240 }}
        >
          <div className="p-4 border-b border-gray-6 flex items-center gap-2">
            <ShieldIcon width={24} height={24} className="text-gray-11" />
            <Heading size="4">Partner Admin</Heading>
          </div>
          <nav className="flex-1 p-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
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
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
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
