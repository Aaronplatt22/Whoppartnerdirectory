import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AMDashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const assignments = await prisma.camAssignment.findMany({
    where: { camId: userId },
    include: {
      partner: {
        include: {
          deals: true,
          _count: { select: { deals: true } },
        },
      },
    },
  });

  const myDeals = await prisma.deal.findMany({
    where: { camId: userId },
    include: { partner: true },
    orderBy: { updatedAt: "desc" },
  });

  const notifications = await prisma.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const activeDeals = myDeals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
  const totalPipeline = activeDeals.reduce((s, d) => s + d.estimatedValue, 0);
  const wonDeals = myDeals.filter(d => d.stage === "Closed Won");
  const totalWon = wonDeals.reduce((s, d) => s + d.estimatedValue, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{"Welcome back, " + (session?.user?.name?.split(" ")[0] || "CAM")}</h1>
          <p className="text-gray-400 text-sm mt-1">Channel Account Manager</p>
        </div>
        {notifications.length > 0 && (
          <Link href="/am/notifications" className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
            {notifications.length + " new notifications"}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">My Partners</p>
          <p className="text-2xl font-bold text-white mt-1">{assignments.length}</p>
          <p className="text-xs text-gray-500 mt-1">Assigned to you</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Active Pipeline</p>
          <p className="text-2xl font-bold text-white mt-1">{"$" + totalPipeline.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{activeDeals.length + " open deals"}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Deals Won</p>
          <p className="text-2xl font-bold text-white mt-1">{wonDeals.length}</p>
          <p className="text-xs text-gray-500 mt-1">{"$" + totalWon.toLocaleString() + " total"}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Total Deals</p>
          <p className="text-2xl font-bold text-white mt-1">{myDeals.length}</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Deals</h2>
            <Link href="/am/pipeline" className="text-blue-400 text-sm hover:text-blue-300">View pipeline</Link>
          </div>
          <div className="space-y-3">
            {myDeals.slice(0, 5).map(deal => (
              <div key={deal.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">{deal.name}</p>
                  <p className="text-xs text-gray-500">{deal.partner.name}</p>
                </div>
                <div className="text-right">
                  <span className={"px-2 py-1 rounded-full text-xs " + (deal.stage === "Closed Won" ? "bg-emerald-500/20 text-emerald-400" : deal.stage === "Closed Lost" ? "bg-red-500/20 text-red-400" : deal.stage === "Qualified" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400")}>{deal.stage}</span>
                  <p className="text-xs text-gray-500 mt-1">{"$" + deal.estimatedValue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">My Partners</h2>
            <Link href="/am/partners" className="text-blue-400 text-sm hover:text-blue-300">View all</Link>
          </div>
          <div className="space-y-3">
            {assignments.map(a => {
              const partnerActiveDeals = a.partner.deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
              const partnerPipeline = partnerActiveDeals.reduce((s, d) => s + d.estimatedValue, 0);
              return (
                <div key={a.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm text-white font-medium">{a.partner.name}</p>
                    <p className="text-xs text-gray-500">{a.partner.tier + " Tier • " + a.partner.partnerType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">{"$" + partnerPipeline.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{partnerActiveDeals.length + " active deals"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
