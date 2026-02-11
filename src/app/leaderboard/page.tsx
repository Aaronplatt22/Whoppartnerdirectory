import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LeaderboardPage() {
  const partners = await prisma.partner.findMany({
    include: {
      deals: true,
      bountyProgress: { where: { completed: true } },
    },
  });

  const ranked = partners.map(p => {
    const won = p.deals.filter(d => d.stage === "Closed Won");
    const active = p.deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
    const revenue = won.reduce((s, d) => s + d.estimatedValue, 0);
    const pipeline = active.reduce((s, d) => s + d.estimatedValue, 0);
    const winRate = p.deals.filter(d => ["Closed Won", "Closed Lost"].includes(d.stage)).length > 0
      ? Math.round((won.length / p.deals.filter(d => ["Closed Won", "Closed Lost"].includes(d.stage)).length) * 100)
      : 0;
    const score = revenue + (pipeline * 0.3) + (p.bountyProgress.length * 5000) + (p.avgRating * 2000);
    return { ...p, won: won.length, active: active.length, revenue, pipeline, winRate, bountiesCompleted: p.bountyProgress.length, score };
  }).sort((a, b) => b.score - a.score);

  const tierColors: Record<string, string> = {
    Gold: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",
    Silver: "from-gray-400/20 to-gray-500/5 border-gray-400/30",
    Bronze: "from-orange-500/20 to-orange-600/5 border-orange-500/30",
  };

  const tierBadge: Record<string, string> = {
    Gold: "bg-yellow-500/20 text-yellow-400",
    Silver: "bg-gray-400/20 text-gray-300",
    Bronze: "bg-orange-500/20 text-orange-400",
  };

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Partner Leaderboard</h1>
          <p className="text-gray-400 text-lg">Top performing partners in the Whop Partner Network</p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/partners" className="text-sm text-gray-500 hover:text-gray-300">← Back to Directory</Link>
          </div>
        </div>

        {/* Top 3 Podium */}
        {ranked.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[ranked[1], ranked[0], ranked[2]].map((p, i) => {
              const order = [2, 1, 3];
              const heights = ["h-40", "h-52", "h-36"];
              const rank = order[i];
              return (
                <div key={p.id} className="flex flex-col items-center">
                  <div className={"text-center mb-3 " + (rank === 1 ? "scale-110" : "")}>
                    <span className="text-3xl">{medals[rank - 1]}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                    <span className={"px-2 py-0.5 rounded-full text-xs " + (tierBadge[p.tier] || "")}>{p.tier}</span>
                    <p className="text-sm text-gray-400 mt-1">{"$" + p.revenue.toLocaleString() + " revenue"}</p>
                  </div>
                  <div className={"w-full rounded-t-xl bg-gradient-to-b " + (tierColors[p.tier] || "") + " border border-b-0 flex items-center justify-center " + heights[i]}>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{"#" + rank}</p>
                      <p className="text-xs text-gray-400 mt-1">{Math.round(p.score).toLocaleString() + " pts"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Full Rankings</h2>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-gray-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Rank</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Partner</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Tier</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Revenue</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Pipeline</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Win Rate</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Deals Won</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Bounties</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Rating</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Score</th>
            </tr></thead>
            <tbody>
              {ranked.map((p, i) => (
                <tr key={p.id} className={"border-b border-gray-800/50 hover:bg-gray-800/30 " + (i < 3 ? "bg-gray-800/10" : "")}>
                  <td className="px-6 py-4">
                    <span className="text-white font-bold">{i < 3 ? medals[i] + " " : ""}{i + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.partnerType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={"px-2.5 py-1 rounded-full text-xs font-medium " + (tierBadge[p.tier] || "bg-gray-500/20 text-gray-400")}>{p.tier}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-white font-medium">{"$" + p.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{"$" + p.pipeline.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{p.winRate + "%"}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{p.won}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{p.bountiesCompleted}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{"⭐ " + p.avgRating}</td>
                  <td className="px-6 py-4 text-right text-white font-bold">{Math.round(p.score).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">How Scoring Works</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-400">Revenue</p>
              <p className="text-white font-medium">$1 = 1 pt</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-400">Pipeline</p>
              <p className="text-white font-medium">$1 = 0.3 pts</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-400">Bounties</p>
              <p className="text-white font-medium">+5,000 pts each</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-gray-400">Rating</p>
              <p className="text-white font-medium">× 2,000 pts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
