import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [partners, deals, cams, applications] = await Promise.all([
    prisma.partner.findMany(),
    prisma.deal.findMany(),
    prisma.user.findMany({ where: { role: "account_manager" } }),
    prisma.partnerApplication.findMany(),
  ]);

  const totalRevenue = deals.filter(d => d.stage === "Closed Won").reduce((sum, d) => sum + d.estimatedValue, 0);
  const activePipeline = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage)).reduce((sum, d) => sum + d.estimatedValue, 0);
  const closedDeals = deals.filter(d => ["Closed Won", "Closed Lost"].includes(d.stage));
  const winRate = closedDeals.length > 0 ? Math.round((deals.filter(d => d.stage === "Closed Won").length / closedDeals.length) * 100) : 0;
  const stages = ["New Opportunity", "In Discussion", "Qualified", "Long Term Nurture", "Closed Won", "Closed Lost"];
  const stageCounts = stages.map(s => ({ stage: s, count: deals.filter(d => d.stage === s).length }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Partners" value={partners.length} sub="Active in directory" />
        <StatCard label="Active Pipeline" value={"$" + activePipeline.toLocaleString()} sub={deals.filter(d => !["Closed Won","Closed Lost"].includes(d.stage)).length + " open deals"} />
        <StatCard label="Revenue (Won)" value={"$" + totalRevenue.toLocaleString()} sub={deals.filter(d => d.stage === "Closed Won").length + " deals closed"} />
        <StatCard label="Win Rate" value={winRate + "%"} sub="Of closed deals" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Pipeline by Stage</h2>
          <div className="space-y-3">
            {stageCounts.map(({ stage, count }) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{stage}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: Math.min(100, (count / Math.max(1, deals.length)) * 300) + "%" }} />
                  </div>
                  <span className="text-sm font-medium text-white w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Team Overview</h2>
          <div className="space-y-3">
            <InfoRow label="CAMs Active" value={cams.length} />
            <InfoRow label="Pending Applications" value={applications.length} />
            <InfoRow label="Gold Partners" value={partners.filter(p => p.tier === "Gold").length} />
            <InfoRow label="Silver Partners" value={partners.filter(p => p.tier === "Silver").length} />
            <InfoRow label="Bronze Partners" value={partners.filter(p => p.tier === "Bronze").length} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
      <span className="text-gray-300">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
