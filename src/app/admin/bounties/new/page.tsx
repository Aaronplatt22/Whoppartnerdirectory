"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBountyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title"),
      description: form.get("description"),
      reward: form.get("reward"),
      target: Number(form.get("target")),
      metric: form.get("metric"),
      endDate: form.get("endDate"),
    };

    try {
      const res = await fetch("/api/admin/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create bounty");
      router.push("/admin/bounties");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Create New Bounty</h1>
      <p className="text-gray-400 text-sm mb-8">Set up a new challenge for partners to compete in.</p>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Bounty Details</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input name="title" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. February Deal Blitz" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description *</label>
            <textarea name="description" required rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none" placeholder="Describe the challenge and rules..." />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Reward *</label>
            <input name="reward" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. $500 bonus + Gold Badge" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Goal & Timeline</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Target Number *</label>
              <input name="target" type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Metric *</label>
              <select name="metric" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none">
                <option value="deals_registered">Deals Registered</option>
                <option value="deals_closed">Deals Closed</option>
                <option value="revenue">Revenue Generated</option>
                <option value="referrals">Referrals Made</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">End Date *</label>
            <input name="endDate" type="date" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors">
            {loading ? "Creating..." : "Create Bounty"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
