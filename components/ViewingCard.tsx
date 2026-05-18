"use client";

import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BUYER_AVATAR_COLORS, property, VIEWING_SUMMARIES } from "@/lib/mockData";
import type { FeedbackStatus, Viewing } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; icon: string; className: string }
> = {
  draft_pending: {
    label: "Draft pending",
    icon: "📝",
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  awaiting_reply: {
    label: "Awaiting reply",
    icon: "⏳",
    className: "border-blue-200 bg-blue-50 text-blue-900",
  },
  feedback_received: {
    label: "Feedback received",
    icon: "✓",
    className: "border-green-200 bg-green-50 text-green-900",
  },
};

interface ViewingCardProps {
  viewing: Viewing;
  onOpen: (viewing: Viewing) => void;
}

export function ViewingCard({ viewing, onOpen }: ViewingCardProps) {
  const status = STATUS_CONFIG[viewing.feedbackStatus];
  const summary =
    VIEWING_SUMMARIES[viewing.id] ?? viewing.buyer.motivation;
  const avatarColor =
    BUYER_AVATAR_COLORS[viewing.id] ?? "bg-[#534AB7]";

  return (
    <Card
      className={cn(
        "cursor-pointer border-border/80 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-[#534AB7]/25 hover:shadow-lg"
      )}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
          <AvatarFallback className={cn(avatarColor, "text-sm font-semibold text-white")}>
            {getInitials(viewing.buyer.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">
              {viewing.buyer.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                status.className
              )}
            >
              <span aria-hidden>{status.icon}</span>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {property.address.split(",")[0]}
          </p>
          <p className="text-sm text-muted-foreground">{viewing.viewingTime}</p>
          <p className="text-sm text-foreground/80">{summary}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1 focus-visible:ring-[#534AB7]"
          onClick={() => onOpen(viewing)}
          aria-label={`Open details for ${viewing.buyer.name}`}
        >
          Open
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </CardContent>
    </Card>
  );
}
