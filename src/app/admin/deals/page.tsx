import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STAGES = ["New Opportunity", "In Discussion", "Qualified", "Long Term Nurture", "Closed Won", "Closed Lost"];

export default async function AdminDealsPage() {
  const deals = await prisma.deal.findMany({
    include: { partner: true, cam: true },
    orderBy: { updatedAt: "desc" },
  });

  const totalPipeline = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage)).reduce((s, d) => s + d.estimatedValue, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Deal Pipeline</h1>
      <p className="text-gray-400 text-sm mt-1 mb-8">{"Active pipeline: $" + totalPipeline.toLocaleString() + " • Click any deal to manage"}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAGES.map(stage => {
          const sd = deals.filter(d => d.stage === stage);
          const sv = sd.reduce((s, d) => s + d.estimatedValue, 0);
          return (
            <div key={stage} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-300">{stage}</h3>
                <span className="text-xs text-gray-500">{sd.length}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{"$" + sv.toLocaleString()}</p>
              <div className="space-y-2">{sd.map(deal => (
                <Link href={"/admin/deals/" + deal.id} key={deal.id} className="block bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors cursor-pointer">
                  <p className="text-sm text-white font-medium">{deal.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{deal.partner.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{"$" + deal.estimatedValue.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">{deal.probability + "%"}</span>
                  </div>
                </Link>
              ))}{sd.length === 0 && <p className="text-xs text-gray-600 text-center py-4">No deals</p>}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
