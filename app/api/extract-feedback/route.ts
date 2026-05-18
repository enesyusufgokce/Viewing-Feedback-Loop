import { NextResponse } from "next/server";
import {
  extractionResponseSchema,
  generateWithRetry,
  getGeminiApiKey,
  getGeminiModel,
} from "@/lib/gemini/server";

const SYSTEM_PROMPT = `Extract structured feedback from a UK property viewing reply. Be objective. Do not invent information not present in the reply. If something is ambiguous, mark requires_agent_attention as true.`;

export async function POST(request: Request) {
  try {
    if (!getGeminiApiKey()) {
      console.error("[extract-feedback] GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { buyerReply, buyerName, propertyAddress } = body as {
      buyerReply?: string;
      buyerName?: string;
      propertyAddress?: string;
    };

    if (!buyerReply?.trim() || !buyerName?.trim() || !propertyAddress?.trim()) {
      return NextResponse.json(
        { error: "buyerReply, buyerName, and propertyAddress are required" },
        { status: 400 }
      );
    }

    const userPrompt = `BUYER: ${buyerName}
PROPERTY: ${propertyAddress}
REPLY: ${buyerReply}

Extract the structured feedback.`;

    const model = getGeminiModel({
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: extractionResponseSchema,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const text = await generateWithRetry(() =>
      model.generateContent(userPrompt)
    );

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[extract-feedback]", error);
    return NextResponse.json(
      { error: "Failed to extract feedback" },
      { status: 500 }
    );
  }
}
