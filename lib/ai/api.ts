import type {
  Agent,
  Buyer,
  Property,
  Vendor,
  WeekFeedbackEntry,
} from "@/lib/types";
import type { ExtractionRaw } from "@/lib/mockAIResponses";

export async function fetchGenerateMessage(
  buyer: Buyer,
  property: Property,
  agent: Agent
): Promise<string | null> {
  try {
    const res = await fetch("/api/generate-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyer, property, agent }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { message?: string };
    return data.message?.trim() || null;
  } catch {
    return null;
  }
}

export async function fetchExtractFeedback(
  buyerReply: string,
  buyerName: string,
  propertyAddress: string
): Promise<ExtractionRaw | null> {
  try {
    const res = await fetch("/api/extract-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerReply, buyerName, propertyAddress }),
    });
    if (!res.ok) return null;
    return (await res.json()) as ExtractionRaw;
  } catch {
    return null;
  }
}

export async function fetchGenerateReport(payload: {
  vendor: Vendor;
  weekFeedbacks: WeekFeedbackEntry[];
  agent: Agent;
  propertyAddress: string;
}): Promise<{ to: string; subject: string; body: string } | null> {
  try {
    const res = await fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      to?: string;
      subject?: string;
      body?: string;
    };
    if (!data.to || !data.subject || !data.body) return null;
    return { to: data.to, subject: data.subject, body: data.body };
  } catch {
    return null;
  }
}
