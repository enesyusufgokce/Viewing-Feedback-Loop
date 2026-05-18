import type { Agent, Property, Viewing } from "./types";

export const agent: Agent = {
  name: "Tom Mitchell",
  agency: "Allerton Property Partners",
  agencyTone: "Warm but professional, British English, never pushy",
};

export const property: Property = {
  id: "prop-001",
  address: "14 Oak Lane, Allerton, Liverpool L18",
  type: "3 bedroom semi-detached",
  price: "£475,000",
  features: [
    "renovated kitchen",
    "south-facing garden",
    "driveway parking",
    "near Allerton Park Primary School",
    "double glazing",
    "gas central heating",
  ],
  description: "Renovated 3-bed family home in popular school catchment",
  listedDaysAgo: 21,
  vendor: {
    name: "Mr. Johnson",
    email: "j.johnson@email.com",
    motivation: "downsizing, kids moved out",
    expectsWeeklyUpdates: true,
  },
};

export const viewings: Viewing[] = [
  {
    id: "view-001",
    buyer: {
      name: "Sarah Smith",
      phone: "+44 7XXX XXXXX1",
      family: "Married, 2 children aged 8 and 10",
      budget: "£450K - £550K",
      criteria: [
        "3+ bedrooms",
        "good schools",
        "modern kitchen",
        "parking",
      ],
      motivation: "Kids growing up, need separate space for homework",
      agentNotes:
        "Asked about school catchment, slightly worried about kitchen size",
      registeredVia: "Rightmove portal lead",
    },
    viewingTime: "Today 10:00 AM",
    status: "completed",
    feedbackStatus: "draft_pending",
  },
  {
    id: "view-002",
    buyer: {
      name: "David Jones",
      phone: "+44 7XXX XXXXX2",
      family: "Single professional, works from home full-time",
      budget: "£500K - £600K",
      criteria: [
        "dedicated office space",
        "quiet area",
        "fast internet area",
      ],
      motivation:
        "Moving from rented flat, needs proper home office setup",
      agentNotes: "Tech worker, very focused on broadband infrastructure",
      registeredVia: "Agency website (Neuron)",
    },
    viewingTime: "Today 2:00 PM",
    status: "completed",
    feedbackStatus: "awaiting_reply",
  },
  {
    id: "view-003",
    buyer: {
      name: "Emma Wilson",
      phone: "+44 7XXX XXXXX3",
      family: "Couple, no children yet but planning family in next 2 years",
      budget: "£400K - £500K",
      criteria: [
        "good condition",
        "low maintenance",
        "long-term investment",
      ],
      motivation: "First home purchase, want to settle long-term",
      agentNotes:
        "First-time buyers, anxious about hidden problems, asked about boiler age",
      registeredVia: "Rightmove portal lead",
    },
    viewingTime: "Today 4:00 PM",
    status: "completed",
    feedbackStatus: "draft_pending",
  },
];

export const VIEWING_SUMMARIES: Record<string, string> = {
  "view-001": "Family of 4, needs school catchment",
  "view-002": "Remote worker, needs home office & fast broadband",
  "view-003": "First-time buyers, long-term investment focus",
};

/** Soft professional avatar colours per buyer */
export const BUYER_AVATAR_COLORS: Record<string, string> = {
  "view-001": "bg-rose-400", // Sarah
  "view-002": "bg-sky-500", // David
  "view-003": "bg-emerald-500", // Emma
};
