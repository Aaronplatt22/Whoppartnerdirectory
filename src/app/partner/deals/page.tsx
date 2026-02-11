import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STAGE_COLORS: Record<string, string> = {
  "New Opportunity": "bg-purple-500/20 text-purple-400",
  "In Discussion": "bg-blue-500/20 text-blue-400",
  "Qualified": "bg-green-500/20 text-green-400",
  "Long Term Nurture": "bg-yellow-500/20 text-yellow-400",
  "Closed Won": "bg-emerald-500/20 text-emerald-400",
  "Closed Lost": "bg-red-500/20 text-red-400",
};

export default async function PartnerDealsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const partner = await prisma.partner.findFirst({ where: { userId } });
  if (!partner) return <div className="text-white">Partner not found.</div>;

  const deals = await prisma.deal.findMany({
    where: { partnerId: partner.id },
    include: { cam: true },
    orderBy: { updatedAt: "desc" },
  });

  const activeDeals = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
  const closedDeals = deals.filter(d => ["Closed Won", "Closed Lost"].includes(d.stage));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Deals</h1>
          <p className="text-gray-400 text-sm mt-1">{deals.length + " total deals"}</p>
        </div>
        <Link href="/partner/deals/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          + Register New Deal
        </Link>
      </div>

      {activeDeals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Active Pipeline</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Deal</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Business</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Value</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Stage</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Probability</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">CAM</th>
              </tr></thead>
              <tbody>{activeDeals.map(deal => (
                <tr key={deal.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-white font-medium">{deal.name}</td>
                  <td className="px-6 py-4"><div><p className="text-gray-300">{deal.businessName}</p><p className="text-xs text-gray-500">{deal.businessEmail}</p></div></td>
                  <td className="px-6 py-4 text-white">{"$" + deal.estimatedValue.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={"px-2.5 py-1 rounded-full text-xs font-medium " + (STAGE_COLORS[deal.stage] || "bg-gray-500/20 text-gray-400")}>{deal.stage}</span></td>
                  <td className="px-6 py-4 text-gray-300">{deal.probability + "%"}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{deal.cam?.name || "Unassigned"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {closedDeals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Closed Deals</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Deal</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Business</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Value</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Result</th>
              </tr></thead>
              <tbody>{closedDeals.map(deal => (
                <tr key={deal.id} className="border-b border-gray-800/50">
                  <td className="px-6 py-4 text-white">{deal.name}</td>
                  <td className="px-6 py-4 text-gray-300">{deal.businessName}</td>
                  <td className="px-6 py-4 text-white">{"$" + deal.estimatedValue.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={"px-2.5 py-1 rounded-full text-xs font-medium " + (STAGE_COLORS[deal.stage] || "")}>{deal.stage}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
