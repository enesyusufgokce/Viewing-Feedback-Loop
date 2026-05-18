import { NextResponse } from "next/server";
import type { Agent, Vendor, WeekFeedbackEntry } from "@/lib/types";
import { generateWithRetry, getGeminiApiKey, getGeminiModel } from "@/lib/gemini/server";

const SYSTEM_PROMPT = `You write weekly vendor care reports for UK estate agents. Synthesise multiple buyer feedback entries into a single professional email update. Write in the voice of the named agent — never disclose AI involvement.

RULES:
- Professional, warm UK English (British spelling)
- Structure: greeting, brief summary, common positives, recurring concerns, next steps, sign-off
- Use specific numbers where helpful ('2 of 3 viewers')
- Frame negatives constructively (instead of 'they hated the kitchen', say 'two viewers mentioned the kitchen perception — possible staging opportunity')
- Never invent feedback not in the data
- End with agent's name
- Keep under 200 words
- Output the email body ONLY, no subject line, no preamble`;

function buildUserPrompt(
  vendor: Vendor,
  weekFeedbacks: WeekFeedbackEntry[],
  agent: Agent,
  propertyAddress: string
): string {
  return `VENDOR: ${vendor.name} (${vendor.email})
PROPERTY: ${propertyAddress}
AGENT: ${agent.name}

WEEK FEEDBACK DATA:
${JSON.stringify(weekFeedbacks, null, 2)}

Write the weekly vendor care email body now.`;
}

export async function POST(request: Request) {
  try {
    if (!getGeminiApiKey()) {
      console.error("[generate-report] GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { vendor, weekFeedbacks, agent, propertyAddress } = body as {
      vendor?: Vendor;
      weekFeedbacks?: WeekFeedbackEntry[];
      agent?: Agent;
      propertyAddress?: string;
    };

    if (
      !vendor?.email ||
      !agent?.name ||
      !propertyAddress?.trim() ||
      !Array.isArray(weekFeedbacks)
    ) {
      return NextResponse.json(
        { error: "vendor, weekFeedbacks, agent, and propertyAddress are required" },
        { status: 400 }
      );
    }

    const model = getGeminiModel({ systemInstruction: SYSTEM_PROMPT });
    const emailBody = await generateWithRetry(() =>
      model.generateContent(
        buildUserPrompt(vendor, weekFeedbacks, agent, propertyAddress)
      )
    );

    return NextResponse.json({
      to: vendor.email,
      subject: `${propertyAddress} — This Week's Update`,
      body: emailBody,
    });
  } catch (error) {
    console.error("[generate-report]", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
