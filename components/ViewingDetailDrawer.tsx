"use client";

import { X } from "lucide-react";
import {
  ConversationSection,
  type ProcessedReplyData,
  type SentMessageRecord,
} from "@/components/ConversationSection";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { property } from "@/lib/mockData";
import type { Viewing } from "@/lib/types";

interface ViewingDetailDrawerProps {
  viewing: Viewing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sentMessage?: SentMessageRecord | null;
  processedReply?: ProcessedReplyData | null;
  onMessageSent?: (viewingId: string, data: SentMessageRecord) => void;
  onDraftSkipped?: (viewingId: string) => void;
  onReplyProcessed?: (viewingId: string, data: ProcessedReplyData) => void;
}

export function ViewingDetailDrawer({
  viewing,
  open,
  onOpenChange,
  sentMessage,
  processedReply,
  onMessageSent,
  onDraftSkipped,
  onReplyProcessed,
}: ViewingDetailDrawerProps) {
  if (!viewing) return null;

  const { buyer } = viewing;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-y-auto">
        <DrawerHeader className="flex flex-row items-start justify-between">
          <DrawerTitle className="text-xl">{buyer.name}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-8">
          <section className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Buyer Context
            </h4>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="font-medium text-muted-foreground">Family</dt>
                <dd>{buyer.family}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Budget</dt>
                <dd>{buyer.budget}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">
                  Motivation
                </dt>
                <dd>{buyer.motivation}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Criteria</dt>
                <dd>
                  <ul className="mt-1 list-inside list-disc">
                    {buyer.criteria.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">
                  Agent notes
                </dt>
                <dd className="text-muted-foreground">{buyer.agentNotes}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Property</dt>
                <dd>{property.address}</dd>
              </div>
            </dl>
          </section>

          <Separator />

          <ConversationSection
            key={`${viewing.id}-${viewing.feedbackStatus}`}
            viewing={viewing}
            sentMessage={sentMessage ?? null}
            processedReply={processedReply}
            onMessageSent={(data) => onMessageSent?.(viewing.id, data)}
            onDraftSkipped={() => onDraftSkipped?.(viewing.id)}
            onReplyProcessed={(data) => onReplyProcessed?.(viewing.id, data)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
