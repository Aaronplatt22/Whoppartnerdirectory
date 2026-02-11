import { prisma } from "@/lib/prisma";

export default async function AdminInvitesPage() {
  const invites = await prisma.invite.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Invites</h1>
      {invites.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400">No invites sent yet.</p>
          <p className="text-gray-500 text-sm mt-2">Invites will appear here once created.</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full"><thead><tr className="border-b border-gray-800">
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Email</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Role</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Sent</th>
          </tr></thead>
          <tbody>{invites.map(invite => (
            <tr key={invite.id} className="border-b border-gray-800/50">
              <td className="px-6 py-4 text-white">{invite.email}</td>
              <td className="px-6 py-4 text-gray-300 capitalize">{invite.role}</td>
              <td className="px-6 py-4"><span className={new Date(invite.expiresAt) < new Date() ? "text-red-400 text-sm" : "text-green-400 text-sm"}>{new Date(invite.expiresAt) < new Date() ? "Expired" : "Pending"}</span></td>
              <td className="px-6 py-4 text-gray-500 text-sm">{new Date(invite.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
