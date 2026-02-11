import { prisma } from "@/lib/prisma";

export default async function AdminSubmissionsPage() {
  const apps = await prisma.partnerApplication.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Partner Applications</h1>
        <span className="text-sm text-gray-400">{apps.length + " pending"}</span>
      </div>
      <div className="space-y-4">{apps.map(app => (
        <div key={app.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div><h3 className="text-lg font-semibold text-white">{app.name}</h3><p className="text-sm text-gray-400 mt-1">{app.email}</p>
            {app.company && <p className="text-sm text-gray-500 mt-1">{"Company: " + app.company}</p>}</div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm cursor-pointer hover:bg-green-500/30">Approve</span>
              <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm cursor-pointer hover:bg-red-500/30">Reject</span>
            </div>
          </div>
          {app.interest && <div className="mt-4 p-3 bg-gray-800/50 rounded-lg"><p className="text-xs text-gray-400 mb-1">Interest</p><p className="text-sm text-gray-300">{app.interest}</p></div>}
          <p className="text-xs text-gray-600 mt-3">{"Applied: " + new Date(app.createdAt).toLocaleDateString()}</p>
        </div>
      ))}</div>
    </div>
  );
}
