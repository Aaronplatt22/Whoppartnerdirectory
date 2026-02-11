import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AMNotificationsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Mark all as read
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Notifications</h1>

      {unread.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">New</h2>
          <div className="space-y-2">
            {unread.map(n => (
              <div key={n.id} className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className="text-sm text-gray-400 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-600 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Earlier</h2>
          <div className="space-y-2">
            {read.map(n => (
              <div key={n.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4">
                <div className="w-2 h-2 rounded-full bg-gray-600 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-300">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-600 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400">No notifications yet.</p>
        </div>
      )}
    </div>
  );
}
