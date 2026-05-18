import { cn } from "@/lib/utils";

export type AILoadingVariant =
  | "draft"
  | "reply"
  | "processing-reply"
  | "report"
  | "default";

const MESSAGES: Record<AILoadingVariant, string> = {
  draft: "AI is drafting...",
  reply: "Processing reply...",
  "processing-reply": "AI is processing the reply...",
  report: "Generating report...",
  default: "AI is thinking...",
};

interface AILoadingProps {
  className?: string;
  variant?: AILoadingVariant;
}

export function AILoading({
  className,
  variant = "default",
}: AILoadingProps) {
  return (
    <div
      className={cn(
        "shimmer-purple rounded-lg border border-[#534AB7]/20 px-4 py-5",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={MESSAGES[variant]}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-1" aria-hidden>
          <span className="ai-dot h-2 w-2 rounded-full bg-[#534AB7]" />
          <span className="ai-dot h-2 w-2 rounded-full bg-[#534AB7]" />
          <span className="ai-dot h-2 w-2 rounded-full bg-[#534AB7]" />
        </div>
        <p className="text-sm font-medium text-[#534AB7]">{MESSAGES[variant]}</p>
      </div>
    </div>
  );
}
