import { prisma } from "@/lib/prisma";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({
    include: {
      _count: { select: { deals: true } },
      camAssignments: { include: { cam: true } },
    },
    orderBy: { totalRevenue: "desc" },
  });
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Partner Management</h1>
        <span className="text-sm text-gray-400">{partners.length + " partners"}</span>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-gray-800">
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Partner</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Tier</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Revenue</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Deals</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rating</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">CAM</th>
          </tr></thead>
          <tbody>{partners.map((partner) => (
            <tr key={partner.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="px-6 py-4"><div><p className="text-white font-medium">{partner.name}</p><p className="text-sm text-gray-500">{partner.partnerType + " • " + partner.location}</p></div></td>
              <td className="px-6 py-4"><span className={"px-2.5 py-1 rounded-full text-xs font-medium " + (partner.tier === "Gold" ? "bg-yellow-500/20 text-yellow-400" : partner.tier === "Silver" ? "bg-gray-400/20 text-gray-300" : "bg-orange-500/20 text-orange-400")}>{partner.tier}</span></td>
              <td className="px-6 py-4 text-white font-medium">{"$" + partner.totalRevenue.toLocaleString()}</td>
              <td className="px-6 py-4 text-gray-300">{partner._count.deals}</td>
              <td className="px-6 py-4 text-gray-300">{"⭐ " + partner.avgRating}</td>
              <td className="px-6 py-4 text-gray-400 text-sm">{partner.camAssignments.map((a: any) => a.cam.name).join(", ") || "Unassigned"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
