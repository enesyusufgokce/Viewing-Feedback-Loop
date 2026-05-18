import { NextResponse } from "next/server";
import type { Agent, Buyer, Property } from "@/lib/types";
import { generateWithRetry, getGeminiApiKey, getGeminiModel } from "@/lib/gemini/server";

const SYSTEM_PROMPT = `You are an AI writing assistant helping UK estate agents draft personalised post-viewing feedback messages to buyers. Write in the voice of the named agent — never disclose you are AI. The message will be sent via WhatsApp from the agent's number.

RULES:
- Maximum 3 sentences
- Reference ONE specific property feature
- Tie into something specific the buyer mentioned (family, needs, situation)
- Friendly but professional UK English (British spelling)
- No sales pressure, no urgency
- End with the agent's first name as signature
- Output ONLY the message text, no preamble or explanation`;

function buildUserPrompt(buyer: Buyer, property: Property, agent: Agent): string {
  return `Write a viewing feedback message.

BUYER: ${buyer.name}
Family situation: ${buyer.family}
Budget: ${buyer.budget}
Their motivation: ${buyer.motivation}
Looking for: ${buyer.criteria.join(", ")}
Agent notes: ${buyer.agentNotes}

PROPERTY: ${property.address}
Features: ${property.features.join(", ")}
Price: ${property.price}

AGENT: ${agent.name}

Write the WhatsApp message now.`;
}

export async function POST(request: Request) {
  try {
    if (!getGeminiApiKey()) {
      console.error("[generate-message] GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { buyer, property, agent } = body as {
      buyer?: Buyer;
      property?: Property;
      agent?: Agent;
    };

    if (!buyer?.name || !property?.address || !agent?.name) {
      return NextResponse.json(
        { error: "buyer, property, and agent are required" },
        { status: 400 }
      );
    }

    const model = getGeminiModel({ systemInstruction: SYSTEM_PROMPT });
    const message = await generateWithRetry(() =>
      model.generateContent(buildUserPrompt(buyer, property, agent))
    );

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[generate-message]", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}
