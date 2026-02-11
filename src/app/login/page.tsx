"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role;
      if (role === "admin") router.push("/admin");
      else if (role === "account_manager") router.push("/am");
      else if (role === "partner") router.push("/partner");
      else router.push("/partners");
    }
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Whop Partner Hub</h1>
          <p className="text-gray-400 mt-2">Sign in to your portal</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Log in</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center mb-3">Demo Accounts</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                <span className="text-gray-400">Admin</span>
                <span className="text-gray-300">admin@whop.com / admin123</span>
              </div>
              <div className="flex justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                <span className="text-gray-400">CAM</span>
                <span className="text-gray-300">cam1@whop.com / cam123</span>
              </div>
              <div className="flex justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                <span className="text-gray-400">Partner</span>
                <span className="text-gray-300">jake@pixelforge.io / partner123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/partners" className="text-sm text-gray-500 hover:text-gray-300">
            ← Browse Public Directory
          </Link>
          <span className="text-gray-700 mx-3">•</span>
          <Link href="/leaderboard" className="text-sm text-gray-500 hover:text-gray-300">
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
