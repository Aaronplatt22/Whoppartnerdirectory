"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const STAGES = ["New Opportunity", "In Discussion", "Qualified", "Long Term Nurture", "Closed Won", "Closed Lost"];
const STAGE_COLORS: Record<string, string> = {
  "New Opportunity": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "In Discussion": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Qualified": "bg-green-500/20 text-green-400 border-green-500/30",
  "Long Term Nurture": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Closed Won": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Closed Lost": "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadDeal(); }, []);

  async function loadDeal() {
    const res = await fetch("/api/deals/" + params.id);
    const data = await res.json();
    setDeal(data.deal);
    setLoading(false);
  }

  async function updateStage(newStage: string) {
    await fetch("/api/deals/" + params.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });
    loadDeal();
  }

  async function updateProbability(prob: number) {
    await fetch("/api/deals/" + params.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ probability: prob }),
    });
    loadDeal();
  }

  async function addComment() {
    if (!comment.trim()) return;
    setSubmitting(true);
    await fetch("/api/deals/" + params.id + "/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment, type: "message" }),
    });
    setComment("");
    setSubmitting(false);
    loadDeal();
  }

  if (loading) return <div className="text-gray-400">Loading deal...</div>;
  if (!deal) return <div className="text-red-400">Deal not found.</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-300 mb-4">← Back to Deals</button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{deal.name}</h1>
          <p className="text-gray-400 mt-1">{deal.partner?.name + " • " + deal.businessName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{"$" + deal.estimatedValue.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{"Processing: $" + deal.monthlyProcessing.toLocaleString() + "/mo"}</p>
        </div>
      </div>

      {/* Stage Pipeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Deal Stage</h2>
        <div className="flex gap-2">
          {STAGES.map(stage => (
            <button key={stage} onClick={() => updateStage(stage)}
              className={"flex-1 py-2.5 rounded-lg text-xs font-medium border transition-all " +
                (deal.stage === stage
                  ? STAGE_COLORS[stage] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  : "bg-gray-800/50 text-gray-500 border-gray-800 hover:bg-gray-800 hover:text-gray-300")}>
              {stage}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Deal Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Deal Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Business</span><span className="text-white">{deal.businessName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Contact</span><span className="text-white">{deal.businessContact}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-blue-400">{deal.businessEmail}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Partner</span><span className="text-white">{deal.partner?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">CAM</span><span className="text-white">{deal.cam?.name || "Unassigned"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Created</span><span className="text-white">{new Date(deal.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Probability</h2>
            <div className="grid grid-cols-5 gap-2">
              {[10, 25, 50, 75, 90].map(p => (
                <button key={p} onClick={() => updateProbability(p)}
                  className={"py-2 rounded-lg text-xs font-medium transition-all " + (deal.probability === p ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700")}>
                  {p + "%"}
                </button>
              ))}
            </div>
            <p className="text-center mt-3 text-lg font-bold text-white">{deal.probability + "%"}</p>
          </div>

          {deal.notes && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-gray-400 mb-2">Notes</h2>
              <p className="text-sm text-gray-300">{deal.notes}</p>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Activity Timeline</h2>

            {/* Add Comment */}
            <div className="flex gap-3 mb-6">
              <input value={comment} onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addComment()}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Add a comment..." />
              <button onClick={addComment} disabled={submitting || !comment.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                {submitting ? "..." : "Send"}
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {deal.activities?.map((activity: any) => (
                <div key={activity.id} className="flex gap-3">
                  <div className={"w-2 h-2 rounded-full mt-2 shrink-0 " + (activity.type === "stage_change" ? "bg-yellow-400" : "bg-blue-400")} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-300">{activity.content}</p>
                      <span className="text-xs text-gray-600 shrink-0 ml-3">{new Date(activity.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.author?.name + " • " + (activity.type === "stage_change" ? "Stage Change" : "Comment")}
                    </p>
                  </div>
                </div>
              ))}
              {(!deal.activities || deal.activities.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-8">No activity yet. Add the first comment!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
