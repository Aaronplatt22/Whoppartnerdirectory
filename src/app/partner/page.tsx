import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PartnerDashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const partner = await prisma.partner.findFirst({
    where: { userId },
    include: {
      deals: { include: { activities: { orderBy: { createdAt: "desc" }, take: 5 } } },
      bountyProgress: { include: { bounty: true } },
    },
  });

  if (!partner) {
    return <div className="text-white">Partner profile not found. Contact admin.</div>;
  }

  const activeDeals = partner.deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
  const wonDeals = partner.deals.filter(d => d.stage === "Closed Won");
  const totalPipeline = activeDeals.reduce((s, d) => s + d.estimatedValue, 0);
  const totalWon = wonDeals.reduce((s, d) => s + d.estimatedValue, 0);
  const recentActivities = partner.deals.flatMap(d => d.activities.map(a => ({ ...a, dealName: d.name }))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{"Welcome back, " + (session?.user?.name?.split(" ")[0] || "Partner")}</h1>
          <p className="text-gray-400 text-sm mt-1">{partner.name + " • " + partner.tier + " Tier"}</p>
        </div>
        <Link href="/partner/deals/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          + Register New Deal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Active Deals</p>
          <p className="text-2xl font-bold text-white mt-1">{activeDeals.length}</p>
          <p className="text-xs text-gray-500 mt-1">In pipeline</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Pipeline Value</p>
          <p className="text-2xl font-bold text-white mt-1">{"$" + totalPipeline.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Estimated</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Deals Won</p>
          <p className="text-2xl font-bold text-white mt-1">{wonDeals.length}</p>
          <p className="text-xs text-gray-500 mt-1">{"$" + totalWon.toLocaleString() + " total"}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Partner Tier</p>
          <p className="text-2xl font-bold text-white mt-1">{partner.tier}</p>
          <p className="text-xs text-gray-500 mt-1">{"Rating: ⭐ " + partner.avgRating}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Active Deals</h2>
            <Link href="/partner/deals" className="text-blue-400 text-sm hover:text-blue-300">View all</Link>
          </div>
          <div className="space-y-3">
            {activeDeals.slice(0, 5).map(deal => (
              <div key={deal.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">{deal.name}</p>
                  <p className="text-xs text-gray-500">{deal.businessName}</p>
                </div>
                <div className="text-right">
                  <span className={"px-2 py-1 rounded-full text-xs " + (deal.stage === "Qualified" ? "bg-green-500/20 text-green-400" : deal.stage === "In Discussion" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400")}>{deal.stage}</span>
                  <p className="text-xs text-gray-500 mt-1">{"$" + deal.estimatedValue.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {activeDeals.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No active deals. Register your first deal!</p>}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex gap-3 p-3 bg-gray-800/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">{activity.content}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.dealName + " • " + new Date(activity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
