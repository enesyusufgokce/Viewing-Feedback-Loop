"use client";

import { useState } from "react";
import { AILoading } from "@/components/AILoading";
import { Button } from "@/components/ui/button";
import { fetchExtractFeedback } from "@/lib/ai/api";
import { property, viewings } from "@/lib/mockData";
import {
  drawerReplySimulations,
  extractionResults,
  mapExtraction,
  mockAICallVariant,
} from "@/lib/mockAIResponses";
import type { StructuredFeedback } from "@/lib/types";

export interface ProcessedReplyData {
  buyerReply: string;
  feedback: StructuredFeedback;
  processedAt: string;
  extractionIndex: number;
  extractionKey: string;
}

interface InlineReplySimulationProps {
  viewingId: string;
  buyerFirstName: string;
  onProcessed: (data: ProcessedReplyData) => void;
}

export function InlineReplySimulation({
  viewingId,
  buyerFirstName,
  onProcessed,
}: InlineReplySimulationProps) {
  const simulation = drawerReplySimulations[viewingId];
  const [isLoading, setIsLoading] = useState(false);

  if (!simulation) return null;

  const handleSimulate = async () => {
    setIsLoading(true);
    const viewing = viewings.find((v) => v.id === viewingId);
    const variants = extractionResults[simulation.extractionKey];

    const live =
      viewing &&
      (await fetchExtractFeedback(
        simulation.buyerReply,
        viewing.buyer.name,
        property.address
      ));

    if (live) {
      onProcessed({
        buyerReply: simulation.buyerReply,
        feedback: mapExtraction(live),
        processedAt: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        extractionIndex: 0,
        extractionKey: simulation.extractionKey,
      });
    } else {
      const { value, index } = await mockAICallVariant(variants, null);
      onProcessed({
        buyerReply: simulation.buyerReply,
        feedback: mapExtraction(value),
        processedAt: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        extractionIndex: index,
        extractionKey: simulation.extractionKey,
      });
    }

    setIsLoading(false);
  };

  return (
    <section className="rounded-lg border border-dashed border-[#534AB7]/30 bg-[#534AB7]/5 p-4 space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-[#534AB7]">
          DEMO: Simulate Buyer Reply
        </h4>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          In production, this happens automatically when the buyer responds via
          WhatsApp. Click to simulate the flow.
        </p>
      </div>

      {isLoading ? (
        <AILoading variant="processing-reply" />
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="border-[#534AB7]/40 text-[#534AB7] hover:bg-[#534AB7]/10"
          onClick={handleSimulate}
          aria-label={`Simulate ${buyerFirstName}'s reply`}
        >
          Simulate {buyerFirstName}&apos;s Reply
        </Button>
      )}
    </section>
  );
}
