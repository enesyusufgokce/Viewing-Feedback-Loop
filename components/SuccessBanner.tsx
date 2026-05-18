"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessBannerProps {
  children: React.ReactNode;
  className?: string;
}

export function SuccessBanner({ children, className }: SuccessBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800",
        className
      )}
      role="status"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white animate-success-pop"
        aria-hidden
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </div>
  );
}
