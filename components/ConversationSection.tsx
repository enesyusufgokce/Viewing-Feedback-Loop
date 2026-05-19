"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { InlineReplySimulation } from "@/components/InlineReplySimulation";
import type { ProcessedReplyData } from "@/components/InlineReplySimulation";
import { AILoading } from "@/components/AILoading";
import { MessageDraftCard } from "@/components/MessageDraftCard";
import { StructuredFeedbackCard } from "@/components/StructuredFeedbackCard";
import {
  ReceivedBubble,
  SentBubble,
  WhatsAppChatFrame,
} from "@/components/WhatsAppBubbles";
import { Button } from "@/components/ui/button";
import { fetchExtractFeedback } from "@/lib/ai/api";
import { property } from "@/lib/mockData";
import {
  drawerReplySimulations,
  extractionResults,
  feedbackMessages,
  mapExtraction,
  mockAICallVariant,
} from "@/lib/mockAIResponses";
import type { FeedbackStatus, Viewing } from "@/lib/types";

export type { ProcessedReplyData };

export interface SentMessageRecord {
  text: string;
  sentAt: string;
}

interface ConversationSectionProps {
  viewing: Viewing;
  sentMessage: SentMessageRecord | null;
  processedReply?: ProcessedReplyData | null;
  onMessageSent?: (data: SentMessageRecord) => void;
  onDraftSkipped?: () => void;
  onReplyProcessed?: (data: ProcessedReplyData) => void;
}

function getDefaultMessageText(viewingId: string): string {
  const variants = feedbackMessages[viewingId];
  return variants?.[0] ?? "";
}

const SECTION_TITLES: Record<FeedbackStatus, string> = {
  draft_pending: "AI Message Draft — Awaiting Your Approval",
  awaiting_reply: "Message Sent",
  feedback_received: "Conversation",
};

export function ConversationSection({
  viewing,
  sentMessage,
  processedReply,
  onMessageSent,
  onDraftSkipped,
  onReplyProcessed,
}: ConversationSectionProps) {
  const { buyer } = viewing;
  const firstName = buyer.name.split(" ")[0];
  const status = viewing.feedbackStatus;
  const title = SECTION_TITLES[status] ?? "Conversation";
  const [isRegeneratingAnalysis, setIsRegeneratingAnalysis] = useState(false);

  const handleRegenerateAnalysis = async () => {
    if (!processedReply) return;
    const key =
      processedReply.extractionKey ??
      drawerReplySimulations[viewing.id]?.extractionKey;
    if (!key) return;

    const variants = extractionResults[key];
    if (!variants?.length) return;

    setIsRegeneratingAnalysis(true);

    const live = await fetchExtractFeedback(
      processedReply.buyerReply,
      buyer.name,
      property.address
    );

    if (live) {
      onReplyProcessed?.({
        ...processedReply,
        feedback: mapExtraction(live),
        extractionIndex: processedReply.extractionIndex,
        extractionKey: key,
        processedAt: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } else {
      const { value, index } = await mockAICallVariant(
        variants,
        processedReply.extractionIndex,
        2000
      );
      onReplyProcessed?.({
        ...processedReply,
        feedback: mapExtraction(value),
        extractionIndex: index,
        extractionKey: key,
        processedAt: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    setIsRegeneratingAnalysis(false);
  };

  if (status === "draft_pending") {
    return (
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h4>
        <MessageDraftCard
          viewingId={viewing.id}
          buyerName={buyer.name}
          onSent={(data) => onMessageSent?.(data)}
          onSkip={() => onDraftSkipped?.()}
        />
      </section>
    );
  }

  const messageText = sentMessage?.text ?? getDefaultMessageText(viewing.id);
  const sentTime = sentMessage?.sentAt ?? "";

  if (status === "awaiting_reply" && messageText) {
    return (
      <section className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h4>
        <WhatsAppChatFrame>
          <SentBubble message={messageText} time={sentTime} />
        </WhatsAppChatFrame>
        <p className="text-xs text-muted-foreground">
          Sent at {sentTime} via WhatsApp · Delivered ✓✓
        </p>
        <InlineReplySimulation
          viewingId={viewing.id}
          buyerFirstName={firstName}
          onProcessed={(data) => onReplyProcessed?.(data)}
        />
      </section>
    );
  }

  if (status === "feedback_received" && messageText && processedReply) {
    return (
      <section className="space-y-4 animate-fade-in">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h4>
        <WhatsAppChatFrame>
          <SentBubble message={messageText} time={sentTime} />
          <ReceivedBubble
            message={processedReply.buyerReply}
            time={processedReply.processedAt}
            senderName={buyer.name}
          />
        </WhatsAppChatFrame>
        <p className="text-xs text-muted-foreground">
          Feedback received and processed at {processedReply.processedAt}
        </p>
        {isRegeneratingAnalysis ? (
          <AILoading variant="default" />
        ) : (
          <>
            <StructuredFeedbackCard feedback={processedReply.feedback} />
            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerateAnalysis}
              className="gap-1.5"
              aria-label="Regenerate analysis with a different interpretation"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              Regenerate Analysis
            </Button>
          </>
        )}
      </section>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
      Feedback received — view in CRM or vendor report.
    </div>
  );
}
