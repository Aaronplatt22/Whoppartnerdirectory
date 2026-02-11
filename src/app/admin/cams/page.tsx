import { prisma } from "@/lib/prisma";

export default async function AdminCamsPage() {
  const cams = await prisma.user.findMany({
    where: { role: "account_manager" },
    include: {
      camAssignments: { include: { partner: { include: { _count: { select: { deals: true } } } } } },
      camDeals: true,
    },
  });
  const unassigned = await prisma.partner.findMany({ where: { camAssignments: { none: {} } } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">CAM Management</h1>
      {unassigned.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <p className="text-yellow-400 text-sm font-medium">{unassigned.length + " partners without a CAM"}</p>
          <p className="text-yellow-400/60 text-xs mt-1">{unassigned.map(p => p.name).join(", ")}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cams.map(cam => {
          const active = cam.camDeals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage));
          const pv = active.reduce((s, d) => s + d.estimatedValue, 0);
          return (
            <div key={cam.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div><h2 className="text-lg font-semibold text-white">{cam.name}</h2><p className="text-sm text-gray-400">{cam.email}</p></div>
                <div className="text-right"><p className="text-sm text-gray-400">Pipeline</p><p className="text-lg font-bold text-white">{"$" + pv.toLocaleString()}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-white">{cam.camAssignments.length}</p><p className="text-xs text-gray-400">Partners</p></div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-white">{active.length}</p><p className="text-xs text-gray-400">Active Deals</p></div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-white">{cam.camDeals.filter(d => d.stage === "Closed Won").length}</p><p className="text-xs text-gray-400">Won</p></div>
              </div>
              <p className="text-sm text-gray-400 mb-2">Assigned Partners</p>
              <div className="space-y-2">{cam.camAssignments.map((a: any) => (
                <div key={a.id} className="flex justify-between items-center bg-gray-800/30 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-300">{a.partner.name}</span>
                  <span className="text-xs text-gray-500">{a.partner._count.deals + " deals"}</span>
                </div>
              ))}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
