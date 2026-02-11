"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heading,
  Text,
  TextField,
  TextArea,
  Button,
  Card,
  Select,
} from "frosted-ui";
import {
  CATEGORIES,
  INDUSTRIES,
  PARTNER_TYPE_LABELS,
  PRICE_RANGE_OPTIONS,
  TIMEZONE_OPTIONS,
  LANGUAGE_OPTIONS,
  RESPONSE_TIME_OPTIONS,
} from "@/lib/constants";
import type { PartnerType, PriceRange, ResponseTime } from "@/lib/types";

type ProfileData = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  partnerType: string;
  categories: string[];
  industries: string[];
  priceRange: string;
  location: string;
  timezone: string;
  languages: string[];
  responseTime: string;
  contactEmail: string;
  website: string;
  calendlyLink: string | null;
};

export default function PartnerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ProfileData | null>(null);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [partnerType, setPartnerType] = useState<PartnerType>("agency");
  const [categories, setCategories] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>("$$");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("EST");
  const [languages, setLanguages] = useState<string[]>([]);
  const [responseTime, setResponseTime] = useState<ResponseTime>("< 24 hours");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [calendlyLink, setCalendlyLink] = useState("");

  useEffect(() => {
    fetch("/api/partner/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((d: ProfileData) => {
        setData(d);
        setName(d.name);
        setTagline(d.tagline);
        setDescription(d.description);
        setPartnerType((d.partnerType as PartnerType) || "agency");
        setCategories(d.categories ?? []);
        setIndustries(d.industries ?? []);
        setPriceRange((d.priceRange as PriceRange) || "$$");
        setLocation(d.location ?? "");
        setTimezone(d.timezone ?? "EST");
        setLanguages(d.languages ?? []);
        setResponseTime((d.responseTime as ResponseTime) || "< 24 hours");
        setContactEmail(d.contactEmail ?? "");
        setWebsite(d.website ?? "");
        setCalendlyLink(d.calendlyLink ?? "");
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/partner/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tagline,
          description,
          partnerType,
          categories,
          industries,
          priceRange,
          location,
          timezone,
          languages,
          responseTime,
          contactEmail,
          website,
          calendlyLink: calendlyLink.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Failed to save");
        setSaving(false);
        return;
      }
      setData(await res.json());
    } catch {
      setError("Failed to save");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="p-6">
        <Text color="gray">Loading profile…</Text>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Text color="red">{error || "Profile not found."}</Text>
        <Link href="/partner">
          <Button size="2" className="mt-4">
            Back to dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/partner" className="text-sm text-gray-11 hover:text-gray-12 mb-4 inline-block">
        ← Dashboard
      </Link>
      <Heading size="6" className="mb-2">
        Edit profile
      </Heading>
      <Text size="2" color="gray" className="mb-6">
        Update how you appear in the partner directory.
      </Text>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField.Root>
            <Text size="2" className="mb-2 block">Company name</Text>
            <TextField.Input value={name} onChange={(e) => setName(e.target.value)} required />
          </TextField.Root>
          <TextField.Root>
            <Text size="2" className="mb-2 block">Tagline</Text>
            <TextField.Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              maxLength={120}
            />
          </TextField.Root>
          <div>
            <Text size="2" className="mb-2 block">Description</Text>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
          <div>
            <Text size="2" className="mb-2 block">Partner type</Text>
            <Select.Root value={partnerType} onValueChange={(v) => setPartnerType((v ?? partnerType) as PartnerType)}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {(Object.keys(PARTNER_TYPE_LABELS) as PartnerType[]).map((t) => (
                  <Select.Item key={t} value={t}>
                    {PARTNER_TYPE_LABELS[t]}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <Text size="2" className="mb-2 block">Categories</Text>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Button
                  key={c}
                  type="button"
                  size="1"
                  variant={categories.includes(c) ? "solid" : "soft"}
                  color={categories.includes(c) ? "orange" : "gray"}
                  onClick={() => setCategories((prev) => toggle(prev, c))}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Text size="2" className="mb-2 block">Industries</Text>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((i) => (
                <Button
                  key={i}
                  type="button"
                  size="1"
                  variant={industries.includes(i) ? "solid" : "soft"}
                  color={industries.includes(i) ? "orange" : "gray"}
                  onClick={() => setIndustries((prev) => toggle(prev, i))}
                >
                  {i}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Text size="2" className="mb-2 block">Price range</Text>
            <Select.Root value={priceRange} onValueChange={(v) => setPriceRange((v ?? priceRange) as PriceRange)}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {PRICE_RANGE_OPTIONS.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <TextField.Root>
            <Text size="2" className="mb-2 block">Location</Text>
            <TextField.Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </TextField.Root>
          <div>
            <Text size="2" className="mb-2 block">Timezone</Text>
            <Select.Root value={timezone} onValueChange={(v) => setTimezone(v ?? "")}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {TIMEZONE_OPTIONS.map((t) => (
                  <Select.Item key={t} value={t}>
                    {t}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <Text size="2" className="mb-2 block">Languages</Text>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((l) => (
                <Button
                  key={l}
                  type="button"
                  size="1"
                  variant={languages.includes(l) ? "solid" : "soft"}
                  color={languages.includes(l) ? "orange" : "gray"}
                  onClick={() => setLanguages((prev) => toggle(prev, l))}
                >
                  {l}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Text size="2" className="mb-2 block">Response time</Text>
            <Select.Root value={responseTime} onValueChange={(v) => setResponseTime((v ?? responseTime) as ResponseTime)}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                {RESPONSE_TIME_OPTIONS.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <TextField.Root>
            <Text size="2" className="mb-2 block">Contact email</Text>
            <TextField.Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </TextField.Root>
          <TextField.Root>
            <Text size="2" className="mb-2 block">Website</Text>
            <TextField.Input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </TextField.Root>
          <TextField.Root>
            <Text size="2" className="mb-2 block">Calendly link (optional)</Text>
            <TextField.Input
              type="url"
              value={calendlyLink}
              onChange={(e) => setCalendlyLink(e.target.value)}
            />
          </TextField.Root>
          {error && <Text color="red">{error}</Text>}
          <Button type="submit" size="3" color="orange" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
