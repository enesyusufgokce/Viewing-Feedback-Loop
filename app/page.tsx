"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { VendorReportCard } from "@/components/VendorReportCard";
import { ViewingCard } from "@/components/ViewingCard";
import { ViewingDetailDrawer } from "@/components/ViewingDetailDrawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type {
  ProcessedReplyData,
  SentMessageRecord,
} from "@/components/ConversationSection";
import { agent, viewings } from "@/lib/mockData";
import {
  defaultSentAtByViewing,
  feedbackMessages,
} from "@/lib/mockAIResponses";
import type { AppView, FeedbackStatus, Viewing } from "@/lib/types";
import { formatTodayDate } from "@/lib/utils";

function buildInitialSentMessages(): Record<string, SentMessageRecord> {
  const initial: Record<string, SentMessageRecord> = {};
  for (const [viewingId, sentAt] of Object.entries(defaultSentAtByViewing)) {
    const variants =
      feedbackMessages[viewingId as keyof typeof feedbackMessages];
    if (variants?.[0]) {
      initial[viewingId] = { text: variants[0], sentAt };
    }
  }
  return initial;
}

function applyViewingOverride(
  viewing: Viewing,
  overrides: Record<string, { feedbackStatus?: FeedbackStatus }>
): Viewing {
  const override = overrides[viewing.id];
  if (!override) return viewing;
  return { ...viewing, ...override };
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<AppView>("today");
  const [selectedViewing, setSelectedViewing] = useState<Viewing | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, { feedbackStatus: FeedbackStatus }>
  >({});
  const [processedReplies, setProcessedReplies] = useState<
    Record<string, ProcessedReplyData>
  >({});
  const [sentMessages, setSentMessages] = useState(buildInitialSentMessages);

  const viewingsWithStatus = useMemo(
    () => viewings.map((v) => applyViewingOverride(v, statusOverrides)),
    [statusOverrides]
  );

  const filteredViewings = useMemo(() => {
    if (activeView === "pending") {
      return viewingsWithStatus.filter(
        (v) => v.feedbackStatus === "draft_pending"
      );
    }
    return viewingsWithStatus;
  }, [activeView, viewingsWithStatus]);

  const handleOpenViewing = (viewing: Viewing) => {
    const resolved =
      viewingsWithStatus.find((v) => v.id === viewing.id) ?? viewing;
    setSelectedViewing(resolved);
    setDrawerOpen(true);
  };

  const handleMessageSent = (viewingId: string, data: SentMessageRecord) => {
    setSentMessages((prev) => ({ ...prev, [viewingId]: data }));
    setStatusOverrides((prev) => ({
      ...prev,
      [viewingId]: { feedbackStatus: "awaiting_reply" },
    }));
    setSelectedViewing((prev) =>
      prev?.id === viewingId
        ? { ...prev, feedbackStatus: "awaiting_reply" }
        : prev
    );
  };

  const handleReplyProcessed = (
    viewingId: string,
    data: ProcessedReplyData
  ) => {
    setStatusOverrides((prev) => ({
      ...prev,
      [viewingId]: { feedbackStatus: "feedback_received" },
    }));
    setProcessedReplies((prev) => ({ ...prev, [viewingId]: data }));
    setSelectedViewing((prev) =>
      prev?.id === viewingId
        ? { ...prev, feedbackStatus: "feedback_received" }
        : prev
    );
  };

  const viewTitle =
    activeView === "today"
      ? "Today's Viewings"
      : activeView === "pending"
        ? "Pending Approvals"
        : activeView === "vendor-reports"
          ? "Weekly Reports"
          : "Settings";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative flex h-[4.25rem] shrink-0 items-center justify-between bg-gradient-to-r from-[#534AB7] to-[#7B6FD4] px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-sm font-bold text-white backdrop-blur-sm"
            aria-hidden
          >
            V
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-white">
              Viewing Feedback Loop
            </p>
          </div>
          <span className="ml-2 hidden items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-xs font-medium text-white sm:inline-flex">
            <Sparkles className="h-3 w-3" aria-hidden />
            AI Assistant
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{agent.name}</p>
            <p className="text-xs text-white/70">{agent.agency}</p>
          </div>
          <Avatar className="h-10 w-10 ring-2 ring-white/30">
            <AvatarFallback
              className="bg-white text-sm font-bold text-[#534AB7]"
              aria-label={`${agent.name} profile`}
            >
              TM
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex min-h-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:max-w-[calc(100vw-14rem)]">
            {(activeView === "today" || activeView === "pending") && (
              <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {viewTitle}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatTodayDate()}
                  </p>
                </div>

                <div className="space-y-3">
                  {filteredViewings.map((viewing) => (
                    <ViewingCard
                      key={viewing.id}
                      viewing={viewing}
                      onOpen={handleOpenViewing}
                    />
                  ))}
                </div>

                {filteredViewings.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nothing pending — you&apos;re all caught up.
                  </p>
                )}
              </div>
            )}

            {activeView === "vendor-reports" && (
              <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{viewTitle}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vendor update emails for {agent.agency}
                  </p>
                </div>
                <VendorReportCard />
              </div>
            )}

            {activeView === "settings" && (
              <div className="mx-auto max-w-2xl animate-fade-in">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Settings placeholder — not functional in this demo.
                </p>
              </div>
            )}
          </main>

          <footer className="shrink-0 border-t bg-white/80 px-6 py-2.5 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl text-[11px] text-muted-foreground">
              <span>© Allerton Property Partners · Demo build</span>
            </div>
          </footer>
        </div>
      </div>

      <ViewingDetailDrawer
        viewing={selectedViewing}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        sentMessage={
          selectedViewing ? sentMessages[selectedViewing.id] ?? null : null
        }
        processedReply={
          selectedViewing
            ? processedReplies[selectedViewing.id] ?? null
            : null
        }
        onMessageSent={handleMessageSent}
        onReplyProcessed={handleReplyProcessed}
      />
    </div>
  );
}
