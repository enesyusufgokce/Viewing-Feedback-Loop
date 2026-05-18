"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StructuredFeedback } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StructuredFeedbackCardProps {
  feedback: StructuredFeedback;
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const INTEREST_STYLES: Record<
  StructuredFeedback["interestLevel"],
  string
> = {
  high: "bg-green-600 text-white border-green-700",
  medium: "bg-amber-500 text-white border-amber-600",
  low: "bg-gray-500 text-white border-gray-600",
};

export function StructuredFeedbackCard({
  feedback,
}: StructuredFeedbackCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setAnimatedScore(feedback.sentimentScore * 100);
    });
    return () => cancelAnimationFrame(t);
  }, [feedback.sentimentScore]);

  return (
    <Card className="overflow-hidden border-[#534AB7]/20 animate-fade-in">
      {feedback.requiresAgentAttention && (
        <div
          className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          Requires agent attention
          {feedback.attentionReason && (
            <span className="font-normal">— {feedback.attentionReason}</span>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-base">Structured Feedback Extracted</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-green-50/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-800">
              Positive aspects
            </p>
            <div className="flex flex-wrap gap-2">
              {feedback.positiveAspects.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2.5 py-1 text-xs font-medium text-green-900"
                >
                  <Plus className="h-3 w-3" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-amber-50/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
              Negative aspects
            </p>
            <div className="flex flex-wrap gap-2">
              {feedback.negativeAspects.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900"
                >
                  <Minus className="h-3 w-3" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 p-4 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Interest level
            </p>
            <span
              className={cn(
                "rounded-lg border px-6 py-2 text-lg font-bold uppercase tracking-wide",
                INTEREST_STYLES[feedback.interestLevel]
              )}
            >
              {feedback.interestLevel}
            </span>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sentiment score
              </p>
              <span className="text-lg font-bold text-[#534AB7]">
                {Math.round(feedback.sentimentScore * 100)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full origin-left rounded-full bg-[#534AB7] animate-progress-fill"
                style={{ width: `${animatedScore}%` }}
                role="progressbar"
                aria-valuenow={Math.round(feedback.sentimentScore * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Next action
          </p>
          <p className="text-sm font-medium">{formatLabel(feedback.nextAction)}</p>
        </div>

        {feedback.suggestedFollowup && (
          <div className="rounded-lg border border-[#534AB7]/15 bg-[#534AB7]/5 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#534AB7]">
              Suggested follow-up
            </p>
            <p className="text-sm text-foreground/80">
              {feedback.suggestedFollowup}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
          <span className="animate-success-pop" aria-hidden>
            ✓
          </span>
          Saved to CRM
        </div>
      </CardContent>
    </Card>
  );
}
