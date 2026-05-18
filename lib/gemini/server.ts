import {
  GoogleGenerativeAI,
  SchemaType,
  type GenerativeModel,
  type Schema,
} from "@google/generative-ai";

export const GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY?.trim() || undefined;
}

type GeminiModelOptions = Omit<
  Parameters<GoogleGenerativeAI["getGenerativeModel"]>[0],
  "model"
>;

export function getGeminiModel(options?: GeminiModelOptions): GenerativeModel {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    ...options,
  });
}

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { status?: number; message?: string };
  if (err.status === 429) return true;
  const msg = err.message?.toLowerCase() ?? "";
  return msg.includes("429") || msg.includes("rate limit") || msg.includes("quota");
}

export async function generateWithRetry(
  generate: () => Promise<{ response: { text: () => string } }>
): Promise<string> {
  try {
    const result = await generate();
    const text = result.response.text();
    if (!text?.trim()) {
      throw new Error("Gemini returned empty response");
    }
    return text.trim();
  } catch (error) {
    if (isRateLimitError(error)) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = await generate();
      const text = result.response.text();
      if (!text?.trim()) {
        throw new Error("Gemini returned empty response after retry");
      }
      return text.trim();
    }
    throw error;
  }
}

export const extractionResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    positive_aspects: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    negative_aspects: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    interest_level: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["low", "medium", "high"],
    },
    next_action: {
      type: SchemaType.STRING,
      format: "enum",
      enum: [
        "consulting_partner",
        "wants_second_viewing",
        "lost_interest",
        "wants_to_offer",
        "undecided",
        "needs_more_info",
      ],
    },
    sentiment_score: { type: SchemaType.NUMBER },
    requires_agent_attention: { type: SchemaType.BOOLEAN },
    attention_reason: { type: SchemaType.STRING, nullable: true },
    suggested_followup: { type: SchemaType.STRING },
  },
  required: [
    "positive_aspects",
    "negative_aspects",
    "interest_level",
    "next_action",
    "sentiment_score",
    "requires_agent_attention",
    "suggested_followup",
  ],
};
