"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      businessName: form.get("businessName") as string,
      businessContact: form.get("businessContact") as string,
      businessEmail: form.get("businessEmail") as string,
      estimatedValue: Number(form.get("estimatedValue")),
      monthlyProcessing: Number(form.get("monthlyProcessing")),
      notes: form.get("notes") as string,
    };

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create deal");
      }
      router.push("/partner/deals");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Register New Deal</h1>
      <p className="text-gray-400 text-sm mb-8">Submit a new business opportunity to the pipeline.</p>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Deal Information</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Deal Name *</label>
            <input name="name" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. FitLife Pro Whop Setup" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Estimated Value ($) *</label>
              <input name="estimatedValue" type="number" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="15000" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Monthly Processing ($)</label>
              <input name="monthlyProcessing" type="number" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="8000" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Business Contact</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Business Name *</label>
            <input name="businessName" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="FitLife Pro" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact Name *</label>
              <input name="businessContact" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="Mike Chen" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact Email *</label>
              <input name="businessEmail" type="email" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none" placeholder="mike@fitlifepro.com" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Additional Notes</h2>
          <textarea name="notes" rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none resize-none" placeholder="Describe the opportunity, client needs, timeline..." />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors">
            {loading ? "Submitting..." : "Register Deal"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
