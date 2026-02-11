import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AMPartnersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const assignments = await prisma.camAssignment.findMany({
    where: { camId: userId },
    include: {
      partner: {
        include: {
          deals: true,
          _count: { select: { deals: true } },
          user: { select: { email: true } },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">My Partners</h1>
      <p className="text-gray-400 text-sm mb-8">{assignments.length + " partners assigned to you"}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.map(a => {
          const p = a.partner;
          const activeDeals = p.deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
          const wonDeals = p.deals.filter(d => d.stage === "Closed Won");
          const pipeline = activeDeals.reduce((s, d) => s + d.estimatedValue, 0);

          return (
            <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">{p.name}</h2>
                  <p className="text-sm text-gray-400">{p.partnerType + " • " + p.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.user?.email}</p>
                </div>
                <span className={"px-2.5 py-1 rounded-full text-xs font-medium " + (p.tier === "Gold" ? "bg-yellow-500/20 text-yellow-400" : p.tier === "Silver" ? "bg-gray-400/20 text-gray-300" : "bg-orange-500/20 text-orange-400")}>{p.tier}</span>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-white">{activeDeals.length}</p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-white">{wonDeals.length}</p>
                  <p className="text-xs text-gray-400">Won</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-white">{"$" + (pipeline / 1000).toFixed(0) + "k"}</p>
                  <p className="text-xs text-gray-400">Pipeline</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-white">{"⭐ " + p.avgRating}</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
              </div>

              {activeDeals.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Active Deals</p>
                  <div className="space-y-2">
                    {activeDeals.map(deal => (
                      <div key={deal.id} className="flex justify-between items-center bg-gray-800/30 rounded-lg px-3 py-2">
                        <div>
                          <span className="text-sm text-gray-300">{deal.name}</span>
                          <span className="text-xs text-gray-600 ml-2">{deal.businessName}</span>
                        </div>
                        <span className="text-xs text-gray-500">{"$" + deal.estimatedValue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
