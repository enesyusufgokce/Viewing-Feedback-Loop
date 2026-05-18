export type FeedbackStatus =
  | "draft_pending"
  | "awaiting_reply"
  | "feedback_received";

export type ViewingStatus = "completed" | "scheduled" | "cancelled";

export type AppView =
  | "today"
  | "pending"
  | "vendor-reports"
  | "settings";

export interface Buyer {
  name: string;
  phone: string;
  family: string;
  budget: string;
  criteria: string[];
  motivation: string;
  agentNotes: string;
  registeredVia: string;
}

export interface Vendor {
  name: string;
  email: string;
  motivation: string;
  expectsWeeklyUpdates: boolean;
}

export interface Property {
  id: string;
  address: string;
  type: string;
  price: string;
  features: string[];
  description: string;
  listedDaysAgo: number;
  vendor: Vendor;
}

export interface Viewing {
  id: string;
  buyer: Buyer;
  viewingTime: string;
  status: ViewingStatus;
  feedbackStatus: FeedbackStatus;
}

export interface Agent {
  name: string;
  agency: string;
  agencyTone: string;
}

export interface WeekFeedbackEntry {
  buyerName: string;
  viewingTime: string;
  feedbackStatus: string;
  notes: string;
}

export interface StructuredFeedback {
  positiveAspects: string[];
  negativeAspects: string[];
  interestLevel: "low" | "medium" | "high";
  nextAction: string;
  sentimentScore: number;
  requiresAgentAttention: boolean;
  attentionReason?: string | null;
  suggestedFollowup?: string;
}
