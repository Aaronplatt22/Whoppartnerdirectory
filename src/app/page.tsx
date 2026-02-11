import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [partnerCount, dealCount, wonDeals] = await Promise.all([
    prisma.partner.count(),
    prisma.deal.count(),
    prisma.deal.findMany({ where: { stage: "Closed Won" } }),
  ]);
  const totalRevenue = wonDeals.reduce((s, d) => s + d.estimatedValue, 0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Whop Partner Hub</h1>
          <div className="flex gap-4">
            <Link href="/partners" className="text-sm text-gray-400 hover:text-white transition-colors">Directory</Link>
            <Link href="/leaderboard" className="text-sm text-gray-400 hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/login" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">The Partner Relationship<br />Management Platform</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Register deals, track pipeline, earn bounties, and grow your partnership with Whop.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
            Sign In to Your Portal
          </Link>
          <Link href="/partners" className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors">
            Browse Partner Directory
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-4xl font-bold text-white">{partnerCount}</p>
            <p className="text-gray-400 mt-2">Active Partners</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-4xl font-bold text-white">{dealCount}</p>
            <p className="text-gray-400 mt-2">Deals Registered</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <p className="text-4xl font-bold text-white">{"$" + totalRevenue.toLocaleString()}</p>
            <p className="text-gray-400 mt-2">Revenue Generated</p>
          </div>
        </div>
      </section>

      {/* Three Portals */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-2xl font-bold text-white text-center mb-10">Three Portals, One Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">🤝</div>
            <h4 className="text-lg font-semibold text-white mb-2">Partner Portal</h4>
            <p className="text-sm text-gray-400">Register deals, track your pipeline, complete bounties, and monitor your performance and tier progress.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">📊</div>
            <h4 className="text-lg font-semibold text-white mb-2">CAM Portal</h4>
            <p className="text-sm text-gray-400">Manage assigned partners, review deal pipelines, provide support, and track team performance.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h4 className="text-lg font-semibold text-white mb-2">Admin Portal</h4>
            <p className="text-sm text-gray-400">Full oversight of partners, deals, CAMs, bounties, applications, and the entire partner ecosystem.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">Whop Partner Hub</p>
          <div className="flex gap-6">
            <Link href="/partners" className="text-sm text-gray-500 hover:text-gray-300">Directory</Link>
            <Link href="/leaderboard" className="text-sm text-gray-500 hover:text-gray-300">Leaderboard</Link>
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-300">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
