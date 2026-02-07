"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Heading,
  Text,
  TextField,
  TextArea,
  Button,
  Checkbox,
  RadioGroup,
  Select,
  Card,
} from "frosted-ui";
import { CheckIcon } from "@radix-ui/react-icons";
import {
  CATEGORIES,
  INDUSTRIES,
  PARTNER_TYPE_LABELS,
  PRICE_RANGE_OPTIONS,
  TIMEZONE_OPTIONS,
  LANGUAGE_OPTIONS,
  RESPONSE_TIME_OPTIONS,
} from "@/lib/constants";
import type { Partner, PartnerType, PriceRange, ResponseTime, CaseStudy, FeaturedWhop } from "@/lib/types";
import { PartnerCard } from "@/components/ui/partner-card";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "About & Services" },
  { id: 3, label: "Pricing & Logistics" },
  { id: 4, label: "Social Proof" },
  { id: 5, label: "Review & Submit" },
];

type CaseStudyDraft = {
  title: string;
  whopName: string;
  summary: string;
  metrics: { key: string; label: string; value: string }[];
};

function buildDraftPartner(form: {
  name: string;
  tagline: string;
  partnerType: PartnerType;
  description: string;
  categories: string[];
  industries: string[];
  priceRange: PriceRange;
  location: string;
  timezone: string;
  languages: string[];
  responseTime: ResponseTime;
  contactEmail: string;
  website: string;
  calendlyLink: string | null;
  caseStudies: CaseStudyDraft[];
  featuredWhopNames: string[];
  logoPreview?: string | null;
}): Partner {
  const caseStudies: CaseStudy[] = form.caseStudies
    .filter((c) => c.title.trim())
    .map((c) => ({
      title: c.title,
      whopName: c.whopName,
      summary: c.summary,
      metrics: c.metrics.reduce((acc, m) => {
        if (m.label.trim()) acc[m.label.trim().replace(/\s+/g, "")] = m.value;
        return acc;
      }, {} as Record<string, string>),
    }));
  const featuredWhops: FeaturedWhop[] = form.featuredWhopNames
    .filter((n) => n.trim())
    .map((name) => ({ name, logo: "" }));
  return {
    id: "preview",
    slug: "preview",
    name: form.name || "Your Company",
    logo: form.logoPreview || "",
    coverImage: "",
    tagline: form.tagline || "Your tagline",
    description: form.description || "",
    partnerType: form.partnerType,
    categories: form.categories,
    industries: form.industries,
    featuredWhops,
    caseStudies,
    reviews: [],
    avgRating: 0,
    reviewCount: 0,
    priceRange: form.priceRange,
    location: form.location,
    timezone: form.timezone,
    languages: form.languages,
    responseTime: form.responseTime,
    contactEmail: form.contactEmail,
    website: form.website,
    calendlyLink: form.calendlyLink,
    internalNotes: "",
    internalTags: [],
    whopContactPerson: "",
    lastEngagementDate: "",
    recommendedFor: [],
  };
}

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState(emailParam);

  const [partnerType, setPartnerType] = useState<PartnerType>("agency");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  const [priceRange, setPriceRange] = useState<PriceRange>("$$");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("EST");
  const [languages, setLanguages] = useState<string[]>([]);
  const [responseTime, setResponseTime] = useState<ResponseTime>("< 24 hours");
  const [calendlyLink, setCalendlyLink] = useState("");

  const [caseStudies, setCaseStudies] = useState<CaseStudyDraft[]>([
    { title: "", whopName: "", summary: "", metrics: [{ key: "1", label: "", value: "" }, { key: "2", label: "", value: "" }, { key: "3", label: "", value: "" }] },
  ]);
  const [featuredWhopNames, setFeaturedWhopNames] = useState<string[]>([""]);

  useEffect(() => {
    setContactEmail((prev) => (emailParam && !prev ? emailParam : prev));
  }, [emailParam]);

  const toggleCategory = (c: string) => {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };
  const toggleIndustry = (i: string) => {
    setIndustries((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };
  const toggleLanguage = (l: string) => {
    setLanguages((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  };

  const addCaseStudy = () => {
    setCaseStudies((prev) => [
      ...prev,
      { title: "", whopName: "", summary: "", metrics: [{ key: "1", label: "", value: "" }, { key: "2", label: "", value: "" }, { key: "3", label: "", value: "" }] },
    ]);
  };
  const updateCaseStudy = (index: number, field: keyof CaseStudyDraft, value: string | { key: string; label: string; value: string }[]) => {
    setCaseStudies((prev) => {
      const next = [...prev];
      if (field === "metrics") next[index].metrics = value as { key: string; label: string; value: string }[];
      else (next[index] as Record<string, unknown>)[field] = value;
      return next;
    });
  };
  const updateCaseStudyMetric = (caseIndex: number, metricIndex: number, field: "label" | "value", value: string) => {
    setCaseStudies((prev) => {
      const next = [...prev];
      next[caseIndex].metrics[metricIndex] = { ...next[caseIndex].metrics[metricIndex], [field]: value };
      return next;
    });
  };

  const addFeaturedWhop = () => setFeaturedWhopNames((prev) => [...prev, ""]);
  const setFeaturedWhopName = (index: number, value: string) => {
    setFeaturedWhopNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!name.trim()) e.name = "Company name is required";
      if (!tagline.trim()) e.tagline = "Tagline is required";
      if (tagline.length > 120) e.tagline = "Tagline must be 120 characters or less";
      if (!contactEmail.trim()) e.contactEmail = "Contact email is required";
    }
    if (s === 2) {
      if (!description.trim()) e.description = "Description is required";
      if (categories.length < 1) e.categories = "Select at least one category";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [stepDirection, setStepDirection] = useState<"next" | "prev">("next");
  const canNext = () => validateStep(step);
  const goNext = () => {
    if (!canNext()) return;
    setStepDirection("next");
    setStep((prev) => Math.min(prev + 1, 5));
  };
  const goBack = () => {
    setStepDirection("prev");
    setStep((prev) => Math.max(prev - 1, 1));
  };
  const stepTransitionClass = stepDirection === "next" ? "onboarding-step-enter-next" : "onboarding-step-enter-prev";

  const draftPartner = useMemo(
    () =>
      buildDraftPartner({
        name,
        tagline,
        partnerType,
        description,
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
        caseStudies,
        featuredWhopNames,
        logoPreview,
      }),
    [
      name,
      tagline,
      partnerType,
      description,
      categories,
      industries,
      priceRange,
      location,
      timezone,
      languages,
      responseTime,
      contactEmail,
      website,
      calendlyLink,
      caseStudies,
      featuredWhopNames,
      logoPreview,
    ]
  );

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-2">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-9 text-white mb-6">
            <CheckIcon width={32} height={32} />
          </div>
          <Heading size="6" className="mb-2">
            Your profile has been submitted for review!
          </Heading>
          <Text size="3" color="gray" className="mb-8">
            Our team will review your submission within 48 hours. You&apos;ll
            receive an email when your profile goes live.
          </Text>
          <Link href="/partners">
            <Button size="3" color="orange">
              Return to Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-2 py-8 px-4">
      <div className="max-w-[680px] mx-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0",
                  step > s.id && "bg-green-9 text-white",
                  step === s.id && "bg-orange-9 text-white",
                  step < s.id && "bg-gray-5 text-gray-10"
                )}
              >
                {step > s.id ? <CheckIcon width={16} height={16} /> : s.id}
              </div>
              <Text size="1" color="gray" className="ml-2 hidden sm:inline">
                {s.label}
              </Text>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-6 mx-2 min-w-[8px]" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Welcome & Basics */}
        {step === 1 && (
          <div className={cn("space-y-6", stepTransitionClass)}>
            <div>
              <Heading size="6" className="mb-2">
                You&apos;ve been invited to join the Whop Partner Directory
              </Heading>
              <Text size="3" color="gray">
                Complete your profile to be listed in our directory and start
                connecting with Whop creators.
              </Text>
            </div>
            <Card className="p-6 space-y-4">
              <TextField.Root color={errors.name ? "red" : undefined}>
                <TextField.Input
                  placeholder="Company / Partner Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <Text size="1" color="red" className="mt-1">
                    {errors.name}
                  </Text>
                )}
              </TextField.Root>

              <div>
                <Text size="2" color="gray" className="mb-2 block">
                  Logo
                </Text>
                <label className="block border-2 border-dashed border-gray-6 rounded-lg p-8 text-center text-gray-10 hover:border-gray-7 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () =>
                          setLogoPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Text size="2">
                    Drag and drop your logo here, or click to browse (preview
                    only in v1)
                  </Text>
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="mt-3 h-16 w-16 object-contain mx-auto"
                    />
                  )}
                </label>
              </div>

              <div>
                <TextField.Root color={errors.tagline ? "red" : undefined}>
                  <TextField.Input
                    placeholder="Tagline (max 120 characters)"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    maxLength={120}
                  />
                </TextField.Root>
                <div className="flex justify-between mt-1">
                  <Text size="1" color="red">
                    {errors.tagline}
                  </Text>
                  <Text size="1" color="gray">
                    {tagline.length}/120
                  </Text>
                </div>
              </div>

              <TextField.Root>
                <TextField.Input
                  placeholder="Website URL"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </TextField.Root>

              <TextField.Root color={errors.contactEmail ? "red" : undefined}>
                <TextField.Input
                  placeholder="Contact Email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                {errors.contactEmail && (
                  <Text size="1" color="red" className="mt-1">
                    {errors.contactEmail}
                  </Text>
                )}
              </TextField.Root>
            </Card>
            <div className="flex justify-end">
              <Button size="3" color="orange" onClick={goNext} className="btn-press">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: About & Services */}
        {step === 2 && (
          <div className={cn("space-y-6", stepTransitionClass)}>
            <Heading size="5">About & Services</Heading>
            <Card className="p-6 space-y-6">
              <div>
                <Text size="2" className="mb-2 block">
                  Partner Type
                </Text>
                <RadioGroup.Root
                  value={partnerType}
                  onValueChange={(v) => setPartnerType(v as PartnerType)}
                >
                  {(Object.keys(PARTNER_TYPE_LABELS) as PartnerType[]).map(
                    (t) => (
                      <RadioGroup.Item key={t} value={t}>
                        {PARTNER_TYPE_LABELS[t]}
                      </RadioGroup.Item>
                    )
                  )}
                </RadioGroup.Root>
              </div>

              <div>
                <Text size="2" className="mb-2 block">
                  Description
                </Text>
                <TextArea
                  placeholder="Tell creators what you do and why they should work with you"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className={cn("w-full", errors.description && "border-red-8")}
                />
                {errors.description && (
                  <Text size="1" color="red" className="mt-1">
                    {errors.description}
                  </Text>
                )}
              </div>

              <div>
                <Text size="2" className="mb-2 block">
                  Service Categories (select at least one)
                </Text>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map((c) => (
                    <Checkbox
                      key={c}
                      checked={categories.includes(c)}
                      onCheckedChange={() => toggleCategory(c)}
                    >
                      {c}
                    </Checkbox>
                  ))}
                </div>
                {errors.categories && (
                  <Text size="1" color="red" className="mt-1">
                    {errors.categories}
                  </Text>
                )}
              </div>

              <div>
                <Text size="2" className="mb-2 block">
                  Industries Served
                </Text>
                <div className="flex flex-wrap gap-3">
                  {INDUSTRIES.map((i) => (
                    <Checkbox
                      key={i}
                      checked={industries.includes(i)}
                      onCheckedChange={() => toggleIndustry(i)}
                    >
                      {i}
                    </Checkbox>
                  ))}
                </div>
              </div>
            </Card>
            <div className="flex justify-between">
              <Button size="3" variant="soft" color="gray" onClick={goBack}>
                Back
              </Button>
              <Button size="3" color="orange" onClick={goNext}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Logistics */}
        {step === 3 && (
          <div className={cn("space-y-6", stepTransitionClass)}>
            <Heading size="5">Pricing & Logistics</Heading>
            <Card className="p-6 space-y-6">
              <div>
                <Text size="2" className="mb-2 block">
                  Price Range
                </Text>
                <RadioGroup.Root
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as PriceRange)}
                >
                  {PRICE_RANGE_OPTIONS.map((opt) => (
                    <RadioGroup.Item key={opt.value} value={opt.value}>
                      <span className="font-medium">{opt.label}</span>
                      <span className="text-gray-11 block text-sm">
                        {opt.description}
                      </span>
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              </div>

              <TextField.Root>
                <TextField.Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </TextField.Root>

              <div>
                <Text size="2" className="mb-2 block">
                  Timezone
                </Text>
                <Select.Root value={timezone} onValueChange={setTimezone}>
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
                <Text size="2" className="mb-2 block">
                  Languages
                </Text>
                <div className="flex flex-wrap gap-3">
                  {LANGUAGE_OPTIONS.map((l) => (
                    <Checkbox
                      key={l}
                      checked={languages.includes(l)}
                      onCheckedChange={() => toggleLanguage(l)}
                    >
                      {l}
                    </Checkbox>
                  ))}
                </div>
              </div>

              <div>
                <Text size="2" className="mb-2 block">
                  Typical Response Time
                </Text>
                <RadioGroup.Root
                  value={responseTime}
                  onValueChange={(v) => setResponseTime(v as ResponseTime)}
                >
                  {RESPONSE_TIME_OPTIONS.map((opt) => (
                    <RadioGroup.Item key={opt.value} value={opt.value}>
                      {opt.label}
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              </div>

              <TextField.Root>
                <TextField.Input
                  placeholder="Calendly Link (optional)"
                  type="url"
                  value={calendlyLink}
                  onChange={(e) => setCalendlyLink(e.target.value)}
                />
              </TextField.Root>
            </Card>
            <div className="flex justify-between">
              <Button size="3" variant="soft" color="gray" onClick={goBack}>
                Back
              </Button>
              <Button size="3" color="orange" onClick={goNext}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Social Proof */}
        {step === 4 && (
          <div className={cn("space-y-6", stepTransitionClass)}>
            <div>
              <Heading size="5">Show creators what you can do</Heading>
              <Text size="2" color="gray">
                Case studies and featured Whops are optional but dramatically
                increase your chances of getting contacted.
              </Text>
            </div>
            <Card className="p-6 space-y-6">
              {caseStudies.map((cs, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-lg bg-gray-3">
                  <Text size="2" weight="medium">
                    Case Study {idx + 1}
                  </Text>
                  <TextField.Root>
                    <TextField.Input
                      placeholder="Title"
                      value={cs.title}
                      onChange={(e) =>
                        updateCaseStudy(idx, "title", e.target.value)
                      }
                    />
                  </TextField.Root>
                  <TextField.Root>
                    <TextField.Input
                      placeholder="Whop Name"
                      value={cs.whopName}
                      onChange={(e) =>
                        updateCaseStudy(idx, "whopName", e.target.value)
                      }
                    />
                  </TextField.Root>
                  <TextArea
                    placeholder="Summary"
                    value={cs.summary}
                    onChange={(e) =>
                      updateCaseStudy(idx, "summary", e.target.value)
                    }
                    rows={2}
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {cs.metrics.map((m, mi) => (
                      <div key={m.key} className="flex gap-2">
                        <TextField.Root>
                          <TextField.Input
                            placeholder="Label"
                            value={m.label}
                            onChange={(e) =>
                              updateCaseStudyMetric(idx, mi, "label", e.target.value)
                            }
                          />
                        </TextField.Root>
                        <TextField.Root>
                          <TextField.Input
                            placeholder="Value"
                            value={m.value}
                            onChange={(e) =>
                              updateCaseStudyMetric(idx, mi, "value", e.target.value)
                            }
                          />
                        </TextField.Root>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button size="2" variant="soft" onClick={addCaseStudy}>
                Add Another Case Study
              </Button>

              <div>
                <Text size="2" className="mb-2 block">
                  Add Whops you&apos;ve worked with
                </Text>
                <Text size="1" color="gray" className="mb-2">
                  These will appear on your profile as social proof.
                </Text>
                {featuredWhopNames.map((n, idx) => (
                  <TextField.Root key={idx} className="mb-2">
                    <TextField.Input
                      placeholder="Whop name"
                      value={n}
                      onChange={(e) => setFeaturedWhopName(idx, e.target.value)}
                    />
                  </TextField.Root>
                ))}
                <Button size="2" variant="soft" onClick={addFeaturedWhop}>
                  Add another
                </Button>
              </div>
            </Card>
            <div className="flex justify-between">
              <Button size="3" variant="soft" color="gray" onClick={goBack}>
                Back
              </Button>
              <Button size="3" color="orange" onClick={goNext}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className={cn("space-y-6", stepTransitionClass)}>
            <Heading size="5">Review & Submit</Heading>

            <div>
              <Text size="2" color="gray" className="mb-2 block">
                Your directory card
              </Text>
              <div className="pointer-events-none [&_a]:pointer-events-none [&_a]:cursor-default">
                <PartnerCard partner={draftPartner} />
              </div>
            </div>

            <Card className="p-4">
              <Text size="2" weight="medium" className="mb-2">
                Profile preview
              </Text>
              <div className="text-sm space-y-2">
                <p>
                  <strong>Tagline:</strong> {draftPartner.tagline || "—"}
                </p>
                <p className="line-clamp-3">
                  <strong>Description:</strong>{" "}
                  {draftPartner.description || "—"}
                </p>
                <p>
                  <strong>Categories:</strong>{" "}
                  {draftPartner.categories.length
                    ? draftPartner.categories.join(", ")
                    : "—"}
                </p>
                <p>
                  <strong>Price range:</strong> {draftPartner.priceRange}
                </p>
                <p>
                  <strong>Case studies:</strong>{" "}
                  {draftPartner.caseStudies.filter((c) => c.title).length}
                </p>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <Text size="2" weight="medium" className="mb-2">
                Completion
              </Text>
              <div className="flex items-center gap-2">
                <CheckIcon className="text-green-9 shrink-0" />
                <Text size="2">Basic info complete</Text>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="text-green-9 shrink-0" />
                <Text size="2">Services selected</Text>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="text-green-9 shrink-0" />
                <Text size="2">Pricing set</Text>
              </div>
              <div className="flex items-center gap-2">
                {draftPartner.caseStudies.filter((c) => c.title).length > 0 ? (
                  <CheckIcon className="text-green-9 shrink-0" />
                ) : (
                  <span className="text-amber-9 shrink-0" aria-hidden>
                    ⚠
                  </span>
                )}
                <Text size="2">
                  {draftPartner.caseStudies.filter((c) => c.title).length > 0
                    ? "Case studies added"
                    : "No case studies (optional but recommended)"}
                </Text>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button size="3" variant="soft" color="gray" onClick={goBack}>
                Back
              </Button>
              <Button size="3" color="orange" onClick={handleSubmit}>
                Submit for Review
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
