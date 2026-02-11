import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [partners, deals, cams, applications] = await Promise.all([
    prisma.partner.findMany(),
    prisma.deal.findMany(),
    prisma.user.findMany({ where: { role: "account_manager" } }),
    prisma.partnerApplication.findMany(),
  ]);

  const activeDeals = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
  const pipelineValue = activeDeals.reduce((s, d) => s + d.estimatedValue, 0);
  const wonDeals = deals.filter(d => d.stage === "Closed Won");
  const lostDeals = deals.filter(d => d.stage === "Closed Lost");
  const revenue = wonDeals.reduce((s, d) => s + d.estimatedValue, 0);
  const winRate = (wonDeals.length + lostDeals.length) > 0
    ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0;

  const stages = ["New Opportunity", "In Discussion", "Qualified", "Long Term Nurture", "Closed Won", "Closed Lost"];
  const pendingApps = applications.filter(a => a.status === "pending");
  const goldPartners = partners.filter(p => p.tier === "Gold");
  const silverPartners = partners.filter(p => p.tier === "Silver");
  const bronzePartners = partners.filter(p => p.tier === "Bronze");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Total Partners</p>
          <p className="text-2xl font-bold text-white mt-1">{partners.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active in directory</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Active Pipeline</p>
          <p className="text-2xl font-bold text-white mt-1">{"$" + pipelineValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{activeDeals.length + " open deals"}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Revenue (Won)</p>
          <p className="text-2xl font-bold text-white mt-1">{"$" + revenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{wonDeals.length + " deals closed"}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400">Win Rate</p>
          <p className="text-2xl font-bold text-white mt-1">{winRate + "%"}</p>
          <p className="text-xs text-gray-500 mt-1">Of closed deals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Pipeline by Stage</h2>
          <div className="space-y-3">
            {stages.map(stage => {
              const count = deals.filter(d => d.stage === stage).length;
              return (
                <div key={stage} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{stage}</span>
                  <span className="text-sm font-medium text-white">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Team Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">CAMs Active</span>
              <span className="text-sm font-medium text-white">{cams.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Pending Applications</span>
              <span className="text-sm font-medium text-white">{pendingApps.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Gold Partners</span>
              <span className="text-sm font-medium text-white">{goldPartners.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Silver Partners</span>
              <span className="text-sm font-medium text-white">{silverPartners.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Bronze Partners</span>
              <span className="text-sm font-medium text-white">{bronzePartners.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
