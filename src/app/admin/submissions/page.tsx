"use client";
import { useState, useEffect } from "react";

interface Application {
  id: string;
  name: string;
  email: string;
  company: string | null;
  interest: string | null;
  status: string;
  createdAt: string;
}

export default function SubmissionsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/applications")
      .then(r => r.json())
      .then(data => { setApps(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    const res = await fetch("/api/admin/applications/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (res.ok) {
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a));
      if (action === "approve" && data.credentials) {
        setMessage("Partner approved! Login: " + data.credentials.email + " / " + data.credentials.password);
      } else if (action === "reject") {
        setMessage("Application rejected.");
      }
    }
    setTimeout(() => setMessage(""), 5000);
  }

  const pending = apps.filter(a => a.status === "pending");
  const processed = apps.filter(a => a.status !== "pending");

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Partner Applications</h1>

      {message && (
        <div className="mb-6 p-4 rounded-lg bg-green-900/50 border border-green-700 text-green-300">
          {message}
        </div>
      )}

      <h2 className="text-lg font-semibold text-white mb-4">Pending ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="text-gray-500 mb-8">No pending applications.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {pending.map(app => (
            <div key={app.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-lg">{app.name}</h3>
                  {app.company && <p className="text-gray-400">{app.company}</p>}
                  <p className="text-gray-500 text-sm">{app.email}</p>
                  {app.interest && <p className="text-gray-400 mt-2">{app.interest}</p>}
                  <p className="text-gray-600 text-xs mt-2">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(app.id, "approve")} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                    Approve
                  </button>
                  <button onClick={() => handleAction(app.id, "reject")} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold text-white mb-4">Processed ({processed.length})</h2>
      {processed.length === 0 ? (
        <p className="text-gray-500">No processed applications yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">Name</th>
                <th className="pb-3 text-gray-400 font-medium">Company</th>
                <th className="pb-3 text-gray-400 font-medium">Email</th>
                <th className="pb-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {processed.map(app => (
                <tr key={app.id} className="border-b border-gray-800">
                  <td className="py-3 text-white">{app.name}</td>
                  <td className="py-3 text-gray-400">{app.company || "—"}</td>
                  <td className="py-3 text-gray-400">{app.email}</td>
                  <td className="py-3">
                    <span className={"px-2 py-1 rounded text-xs font-medium " + (app.status === "approved" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300")}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
