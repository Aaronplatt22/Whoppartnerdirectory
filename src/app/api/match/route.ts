import { NextRequest, NextResponse } from "next/server";
import { mockPartners } from "@/data/mock-partners";

const SYSTEM_PROMPT = `You are an AI assistant for Whop Account Managers. You help match Whop creators with the best partners from our directory based on their specific needs.
Here is our complete partner directory data:
${JSON.stringify(mockPartners, null, 2)}
When given a client's details, analyze their situation and recommend the top 3-5 partners. For each recommendation, provide:

The partner's ID and name
A "matchScore" (0-100) indicating how well they fit
A "reason" explaining why this partner is ideal for THIS specific client
A "relevantCaseStudy" referencing a specific case study from their profile that's relevant
A "suggestedIntro" — a one-sentence introduction the AM could use

Respond ONLY with valid JSON in this exact format, no markdown, no backticks:
{
  "analysis": "Brief analysis of the client's situation and key needs",
  "recommendations": [
    {
      "partnerId": "1",
      "partnerName": "...",
      "matchScore": 95,
      "reason": "...",
      "relevantCaseStudy": "...",
      "suggestedIntro": "..."
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ fallback: true }, { status: 200 });
    }

    const userContent = `Match partners for this client:
- Industry: ${body.industry ?? ""}
- Monthly Revenue: ${body.monthlyRevenue ?? ""}
- Member Count: ${body.memberCount ?? ""}
- Primary Challenges: ${Array.isArray(body.challenges) ? body.challenges.join(", ") : ""}
- Budget for Partner Services: ${body.budget ?? ""}
- Additional Context: ${body.additionalContext ?? ""}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", response.status, err);
      return NextResponse.json({ fallback: true }, { status: 200 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) {
      return NextResponse.json({ fallback: true }, { status: 200 });
    }

    const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as {
      analysis?: string;
      recommendations?: Array<{
        partnerId: string;
        partnerName: string;
        matchScore: number;
        reason: string;
        relevantCaseStudy: string;
        suggestedIntro: string;
      }>;
    };

    return NextResponse.json({
      analysis: parsed.analysis ?? "",
      recommendations: parsed.recommendations ?? [],
    });
  } catch (e) {
    console.error("Match API error:", e);
    return NextResponse.json({ fallback: true }, { status: 200 });
  }
}
