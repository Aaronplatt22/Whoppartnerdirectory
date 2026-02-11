import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBountiesPage() {
  const bounties = await prisma.bounty.findMany({
    include: {
      progress: { include: { partner: true } },
      _count: { select: { progress: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bounty Management</h1>
          <p className="text-gray-400 text-sm mt-1">{bounties.length + " total bounties"}</p>
        </div>
        <Link href="/admin/bounties/new" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          + Create Bounty
        </Link>
      </div>

      <div className="space-y-4">
        {bounties.map(bounty => {
          const completedCount = bounty.progress.filter(p => p.completed).length;
          const daysLeft = Math.max(0, Math.ceil((new Date(bounty.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const isExpired = daysLeft === 0;

          return (
            <div key={bounty.id} className={"bg-gray-900 border rounded-xl p-6 " + (bounty.isActive && !isExpired ? "border-gray-800" : "border-gray-800/50 opacity-70")}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">{bounty.title}</h2>
                    {bounty.isActive && !isExpired ? (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full text-xs">Ended</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{bounty.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-medium text-yellow-400">{bounty.reward}</p>
                  <p className="text-xs text-gray-500 mt-1">{"Target: " + bounty.target}</p>
                  <p className="text-xs text-gray-500">{isExpired ? "Expired" : daysLeft + " days left"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-white">{bounty._count.progress}</p>
                  <p className="text-xs text-gray-400">Participating</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-emerald-400">{completedCount}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-white">{bounty._count.progress > 0 ? Math.round((completedCount / bounty._count.progress) * 100) + "%" : "0%"}</p>
                  <p className="text-xs text-gray-400">Completion Rate</p>
                </div>
              </div>

              {bounty.progress.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Partner Progress</p>
                  <div className="space-y-2">
                    {bounty.progress.map(prog => {
                      const pct = Math.min(100, Math.round((prog.current / bounty.target) * 100));
                      return (
                        <div key={prog.id} className="flex items-center gap-3 bg-gray-800/30 rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-300 w-36 shrink-0">{prog.partner.name}</span>
                          <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div className={"h-2 rounded-full " + (prog.completed ? "bg-emerald-500" : "bg-blue-500")} style={{ width: pct + "%" }} />
                          </div>
                          <span className="text-xs text-gray-500 w-16 text-right">{prog.current + "/" + bounty.target}</span>
                          {prog.completed && <span className="text-emerald-400 text-xs">✓</span>}
                        </div>
                      );
                    })}
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
