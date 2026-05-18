"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { AILoading } from "@/components/AILoading";
import { SuccessBanner } from "@/components/SuccessBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { fetchGenerateReport } from "@/lib/ai/api";
import {
  agent,
  property,
  viewings,
  VIEWING_SUMMARIES,
} from "@/lib/mockData";
import { mockAICallVariant, vendorReports } from "@/lib/mockAIResponses";
import { formatTimeNow } from "@/lib/utils";

export function VendorReportCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVariant, setLoadingVariant] = useState<"report" | "default">(
    "report"
  );
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [editBody, setEditBody] = useState("");
  const [reportTo, setReportTo] = useState(vendorReports[0].to);
  const [variantIndex, setVariantIndex] = useState<number | null>(null);
  const [sentAt, setSentAt] = useState<string | null>(null);

  const runGenerate = async (excludeIndex: number | null) => {
    setIsLoading(true);
    setLoadingVariant(excludeIndex === null ? "report" : "default");
    if (excludeIndex === null) setSentAt(null);

    const weekFeedbacks = viewings.map((v) => ({
      buyerName: v.buyer.name,
      viewingTime: v.viewingTime,
      feedbackStatus: v.feedbackStatus,
      notes: VIEWING_SUMMARIES[v.id] ?? "",
    }));

    const live = await fetchGenerateReport({
      vendor: property.vendor,
      weekFeedbacks,
      agent,
      propertyAddress: property.address,
    });

    if (live) {
      setSubject(live.subject);
      setBody(live.body);
      setEditBody(live.body);
      setReportTo(live.to);
      setVariantIndex(null);
    } else {
      const { value, index } = await mockAICallVariant(
        vendorReports,
        excludeIndex
      );
      setSubject(value.subject);
      setBody(value.body);
      setEditBody(value.body);
      setReportTo(value.to);
      setVariantIndex(index);
    }

    setHasGenerated(true);
    setIsLoading(false);
  };

  const handleApprove = () => {
    setSentAt(formatTimeNow());
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setBody(editBody);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">
          {property.address.split(",")[0]} — {property.vendor.name}
        </CardTitle>
        <Badge
          variant="progress"
          className="w-fit border-blue-200 bg-blue-50 text-blue-900"
        >
          3 viewings this week, 2 feedback received
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasGenerated && !isLoading && (
          <Button
            className="bg-[#534AB7] hover:bg-[#534AB7]/90 focus-visible:ring-[#534AB7]"
            onClick={() => runGenerate(null)}
            aria-label="Generate weekly vendor report"
          >
            Generate Weekly Report
          </Button>
        )}

        {isLoading && (
          <AILoading variant={loadingVariant === "report" ? "report" : "default"} />
        )}

        {hasGenerated && !isLoading && (
          <div className="animate-fade-in space-y-0">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="space-y-0.5 border-b border-gray-100 bg-gray-50/80 px-5 py-4 font-mono text-xs text-gray-700">
                <p>
                  <span className="text-gray-500">From:</span> Tom Mitchell
                  &lt;tom@allertonproperty.co.uk&gt;
                </p>
                <p>
                  <span className="text-gray-500">To:</span> {reportTo}
                </p>
                <p>
                  <span className="text-gray-500">Subject:</span> {subject}
                </p>
              </div>

              {isEditing ? (
                <div className="p-5">
                  <Textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={16}
                    className="font-sans text-sm focus-visible:ring-[#534AB7]"
                    aria-label="Edit email body"
                  />
                </div>
              ) : (
                <div className="whitespace-pre-wrap p-5 font-[Georgia,'Times_New_Roman',serif] text-[15px] leading-relaxed text-gray-800">
                  {body}
                </div>
              )}
            </div>

            {sentAt ? (
              <div className="pt-4">
                <SuccessBanner>
                  Sent to {property.vendor.name} at {sentAt}
                </SuccessBanner>
              </div>
            ) : (
              <div className="sticky bottom-0 mt-4 flex flex-wrap items-center gap-2 rounded-lg border bg-white/95 p-3 shadow-lg backdrop-blur-sm">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      aria-label="Save email edits"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditBody(body);
                        setIsEditing(false);
                      }}
                      aria-label="Cancel email edits"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      className="bg-[#534AB7] hover:bg-[#534AB7]/90 focus-visible:ring-[#534AB7]"
                      onClick={handleApprove}
                      aria-label="Approve and send report to vendor"
                    >
                      Approve & Send
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      aria-label="Edit vendor report email"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runGenerate(variantIndex)}
                      className="gap-1.5"
                      aria-label="Regenerate report with a different variant"
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                      Regenerate Report
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground"
                      aria-label="Discard draft"
                    >
                      Discard
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
