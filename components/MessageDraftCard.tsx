"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, Sparkles } from "lucide-react";
import type { SentMessageRecord } from "@/components/ConversationSection";
import { AILoading } from "@/components/AILoading";
import { SentBubble, WhatsAppChatFrame } from "@/components/WhatsAppBubbles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchGenerateMessage } from "@/lib/ai/api";
import { agent, property, viewings } from "@/lib/mockData";
import {
  feedbackMessages,
  mockAICallVariant,
} from "@/lib/mockAIResponses";
import { cn, formatTimeNow } from "@/lib/utils";

interface MessageDraftCardProps {
  viewingId: string;
  buyerName: string;
  onSent?: (data: SentMessageRecord) => void;
}

function AIDraftBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#534AB7]/20 bg-[#534AB7]/10 px-3 py-1 text-xs font-semibold text-[#3d3689]">
      <Sparkles className="h-3.5 w-3.5 text-[#534AB7]" aria-hidden />
      AI Draft — Awaiting Approval
    </span>
  );
}

export function MessageDraftCard({
  viewingId,
  buyerName,
  onSent,
}: MessageDraftCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [editBuffer, setEditBuffer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingVariant, setLoadingVariant] = useState<"draft" | "default">(
    "draft"
  );
  const [hasGenerated, setHasGenerated] = useState(false);
  const [displayTime, setDisplayTime] = useState("");
  const [variantIndex, setVariantIndex] = useState<number | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [checkFade, setCheckFade] = useState(false);

  const runGenerate = useCallback(
    async (excludeIndex: number | null, variant: "draft" | "default") => {
      const variants = feedbackMessages[viewingId];
      if (!variants?.length) {
        setIsLoading(false);
        return;
      }

      const viewing = viewings.find((v) => v.id === viewingId);

      setIsLoading(true);
      setLoadingVariant(variant);

      const liveMessage =
        viewing &&
        (await fetchGenerateMessage(viewing.buyer, property, agent));

      if (liveMessage) {
        setMessage(liveMessage);
        setEditBuffer(liveMessage);
        setVariantIndex(null);
      } else {
        const { value, index } = await mockAICallVariant(
          variants,
          excludeIndex
        );
        setMessage(value);
        setEditBuffer(value);
        setVariantIndex(index);
      }

      setHasGenerated(true);
      setDisplayTime(formatTimeNow());
      setIsLoading(false);
    },
    [viewingId]
  );

  useEffect(() => {
    runGenerate(null, "draft");
  }, [runGenerate]);

  const handleRegenerate = () => {
    setIsEditing(false);
    runGenerate(variantIndex, "default");
  };

  const handleApprove = () => {
    setIsApproving(true);
    setCheckFade(false);
    window.setTimeout(() => setCheckFade(true), 400);
    window.setTimeout(() => {
      const sentAt = formatTimeNow();
      onSent?.({ text: message, sentAt });
      setIsApproving(false);
    }, 650);
  };

  const handleSaveEdit = () => {
    setMessage(editBuffer);
    setIsEditing(false);
  };

  if (isApproving) {
    return (
      <div className="flex justify-center py-10" role="status" aria-live="polite">
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-opacity duration-300 animate-success-pop",
            checkFade && "opacity-0"
          )}
          aria-hidden
        >
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {hasGenerated && !isLoading && (
        <div className="flex justify-end">
          <AIDraftBadge />
        </div>
      )}

      {isLoading ? (
        <AILoading variant={loadingVariant === "draft" ? "draft" : "default"} />
      ) : isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editBuffer}
            onChange={(e) => setEditBuffer(e.target.value)}
            rows={8}
            className="font-sans focus-visible:ring-[#534AB7]"
            aria-label="Edit message draft"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit} aria-label="Save edited draft">
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditBuffer(message);
                setIsEditing(false);
              }}
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <WhatsAppChatFrame>
            <SentBubble message={message} time={displayTime} />
          </WhatsAppChatFrame>
          <p className="text-right text-[10px] text-gray-500">To {buyerName}</p>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-[#534AB7] hover:bg-[#534AB7]/90 focus-visible:ring-[#534AB7]"
              onClick={handleApprove}
              disabled={!message || isLoading}
              aria-label="Approve and send message to buyer"
            >
              Approve & Send
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={!message || isLoading}
              aria-label="Edit message draft"
            >
              Edit
            </Button>
            <Button size="sm" variant="ghost" aria-label="Skip sending message">
              Skip
            </Button>
            {hasGenerated && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRegenerate}
                disabled={isLoading}
                className="gap-1.5"
                aria-label="Regenerate AI draft"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Regenerate
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
