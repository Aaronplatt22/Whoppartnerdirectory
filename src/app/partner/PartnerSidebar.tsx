"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/partner", label: "Dashboard", icon: "📊" },
  { href: "/partner/deals", label: "My Deals", icon: "💰" },
  { href: "/partner/bounties", label: "Bounties", icon: "🎯" },
];

export default function PartnerSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Whop Partner Hub</h1>
        <p className="text-sm text-gray-400 mt-1">Partner Portal</p>
      </div>
      <div className="px-6 py-4 border-b border-gray-800">
        <p className="text-sm text-white font-medium">{userName}</p>
        <p className="text-xs text-gray-500">Partner</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/partner" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors " + (active ? "bg-blue-600/20 text-blue-400 font-medium" : "text-gray-400 hover:text-white hover:bg-gray-800")}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link href="/partners" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-2">
          🌐 Public Directory
        </Link>
        <Link href="/api/auth/signout" className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400">
          🚪 Sign Out
        </Link>
      </div>
    </aside>
  );
}
