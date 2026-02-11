import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PartnerBountiesPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const partner = await prisma.partner.findFirst({ where: { userId } });
  if (!partner) return <div className="text-white">Partner not found.</div>;

  const bounties = await prisma.bounty.findMany({
    where: { isActive: true },
    include: {
      progress: { where: { partnerId: partner.id } },
    },
    orderBy: { endDate: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Bounties & Challenges</h1>
      <p className="text-gray-400 text-sm mb-8">Complete challenges to earn rewards and climb the leaderboard.</p>

      <div className="space-y-4">
        {bounties.map(bounty => {
          const progress = bounty.progress[0];
          const current = progress?.current || 0;
          const pct = Math.min(100, Math.round((current / bounty.target) * 100));
          const completed = progress?.completed || false;
          const daysLeft = Math.max(0, Math.ceil((new Date(bounty.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

          return (
            <div key={bounty.id} className={"bg-gray-900 border rounded-xl p-6 " + (completed ? "border-emerald-500/30" : "border-gray-800")}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{bounty.title}</h3>
                    {completed && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">Completed!</span>}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{bounty.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-medium text-yellow-400">{bounty.reward}</p>
                  <p className="text-xs text-gray-500 mt-1">{daysLeft + " days left"}</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{current + " / " + bounty.target}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div className={"h-3 rounded-full transition-all " + (completed ? "bg-emerald-500" : "bg-blue-500")} style={{ width: pct + "%" }} />
                </div>
              </div>
              <p className="text-xs text-gray-600">{"Ends: " + new Date(bounty.endDate).toLocaleDateString()}</p>
            </div>
          );
        })}
        {bounties.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400">No active bounties right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
