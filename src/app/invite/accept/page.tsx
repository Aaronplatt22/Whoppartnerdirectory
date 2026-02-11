"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heading, Text, TextField, Button, Card } from "frosted-ui";

function InviteAcceptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setError("Missing invite token.");
      return;
    }
    fetch(`/api/invite/validate?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired invite");
        return res.json();
      })
      .then((data: { email: string; role: string }) => {
        setEmail(data.email);
        setRole(data.role);
      })
      .catch(() => setError("Invalid or expired invite. Please request a new link."))
      .finally(() => setValidating(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push("/login?message=account-created");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-2">
        <Text color="gray">Checking invite…</Text>
      </div>
    );
  }

  if (error && !email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-2">
        <Card className="p-6 max-w-md text-center">
          <Heading size="5" className="mb-2">
            Invalid invite
          </Heading>
          <Text color="gray" className="mb-4">
            {error}
          </Text>
          <Link href="/partners">
            <Button size="2" color="gray">
              Back to directory
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-2">
      <div className="w-full max-w-sm">
        <Card className="p-6 space-y-6">
          <div>
            <Heading size="5" className="mb-1">
              Create your account
            </Heading>
            <Text size="2" color="gray">
              {role === "partner"
                ? "You’ve been invited to the partner directory."
                : "You’ve been invited to the Whop team."}
            </Text>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField.Root>
              <TextField.Input
                placeholder="Email"
                type="email"
                value={email ?? ""}
                readOnly
                disabled
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                placeholder="Password (min 8 characters)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </TextField.Root>
            {error && (
              <Text size="2" color="red">
                {error}
              </Text>
            )}
            <Button
              type="submit"
              size="3"
              color="orange"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </Card>
        <div className="mt-4 text-center">
          <Link href="/partners" className="text-sm text-gray-11 hover:text-gray-12">
            ← Back to directory
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-2"><p className="text-gray-11">Loading…</p></div>}>
      <InviteAcceptContent />
    </Suspense>
  );
}
