"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heading, Text, TextField, Button, Card } from "frosted-ui";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/partners";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      if (res?.url) window.location.href = res.url;
      else window.location.href = callbackUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-2">
      <div className="w-full max-w-sm">
        <Card className="p-6 space-y-6">
          <div>
            <Heading size="5" className="mb-1">
              Log in
            </Heading>
            <Text size="2" color="gray">
              Whop team or partner directory
            </Text>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField.Root>
              <TextField.Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <Text size="1" color="gray">
            No account? You need an invite from an admin to join the team or
            partner directory.
          </Text>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-2"><p className="text-gray-11">Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
