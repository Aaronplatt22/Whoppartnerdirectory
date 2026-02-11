"use client";

import { useState } from "react";
import Link from "next/link";
import { Heading, Text, TextField, TextArea, Button, Card } from "frosted-ui";
import { CheckIcon } from "@radix-ui/react-icons";

export default function ApplyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company: company || undefined, interest: interest || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-2">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-9 text-white mb-6">
            <CheckIcon width={32} height={32} />
          </div>
          <Heading size="6" className="mb-2">
            Application received
          </Heading>
          <Text size="3" color="gray" className="mb-8">
            Thanks for your interest in becoming a Whop partner. We&apos;ll review your
            application and get in touch if you&apos;re a good fit for the program.
          </Text>
          <Link href="/partners">
            <Button size="3" color="orange">
              Back to directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-2">
      <div className="w-full max-w-md">
        <Card className="p-6 space-y-6">
          <div>
            <Heading size="5" className="mb-1">
              Apply to become a partner
            </Heading>
            <Text size="2" color="gray">
              Join the Whop partner program. If you progress in the program, we&apos;ll
              invite you to the partner directory.
            </Text>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField.Root>
              <TextField.Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                placeholder="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </TextField.Root>
            <TextArea
              placeholder="Tell us about your interest (optional)"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              rows={3}
              className="w-full"
            />
            {error && (
              <Text size="2" color="red">
                {error}
              </Text>
            )}
            <Button type="submit" size="3" color="orange" className="w-full" disabled={loading}>
              {loading ? "Submitting…" : "Submit application"}
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
