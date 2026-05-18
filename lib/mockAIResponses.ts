/**
 * Mock AI Responses
 * 
 * In production, these would be live calls to the Anthropic Claude API:
 *   - claude-sonnet-4-5 for creative generation (messages, reports)
 *   - claude-haiku-4-5 for structured extraction
 * 
 * Each response type has multiple variants to simulate AI variability
 * when the user clicks "Regenerate". The mockAICall function picks one
 * at random.
 */

// ============================================
// 1. BUYER FEEDBACK MESSAGES — 5 variants per buyer
// ============================================

export const feedbackMessages: Record<string, string[]> = {
    "view-001": [
      `Hi Sarah, hope you got the kids home okay after seeing 14 Oak Lane today. Just curious — did the upstairs layout feel like it could give the kids their own homework space? Also wondered what you made of the kitchen size in person. No rush at all, happy to chat whenever suits.\n\n— Tom`,
  
      `Hi Sarah, great to meet you and the kids today! Wanted to follow up while it's fresh — did the back bedroom feel like it could work as the homework / quiet space you were thinking about? And the kitchen — bigger or smaller than you expected? Take your time, no pressure.\n\n— Tom`,
  
      `Hi Sarah! Hope the rest of your afternoon went well. One quick question — when you walked through 14 Oak Lane, could you picture the kids having their own space upstairs? Also keen to know if the proximity to Allerton Park Primary felt right for you. Whenever you have a moment.\n\n— Tom`,
  
      `Hi Sarah, thanks for popping over to 14 Oak Lane earlier. While it's still fresh in your mind — did the layout work for what you and the kids need day-to-day? Particularly curious about the kitchen and whether it felt practical for a family of four. No rush on replying!\n\n— Tom`,
  
      `Hi Sarah, hope you're settled back at home. Quick one — what was the first thing you and the kids said in the car after the viewing? Sometimes that initial reaction tells the most. Especially curious if the homework-space question got resolved when you saw the upstairs layout in person.\n\n— Tom`
    ],
  
    "view-002": [
      `Hi David, hope the rest of your day went well. Quick one — did the box room at the back feel like it could work as a proper home office for you? Also keen to hear your thoughts on the broadband situation in Allerton if you got a chance to look into it. No pressure, just curious!\n\n— Tom`,
  
      `Hi David, thanks for coming by 14 Oak Lane today. Wanted to check in — could you picture your two-monitor setup fitting in the back room comfortably? Also, did you get a chance to check broadband speeds for that postcode? Happy to dig into the details if useful.\n\n— Tom`,
  
      `Hi David! Following up on 14 Oak Lane while it's fresh. The home-office question is the big one — did the back room feel like it had enough wall space for your desk and screens? And was the area quiet enough for video calls during the day? Whenever you have a moment.\n\n— Tom`,
  
      `Hi David, hope you're well. Genuinely curious whether the back bedroom worked for you as an office space — I know that's the dealbreaker. Also, the broadband in that part of Allerton — did anything come up when you checked? No rush, just keen to know where your head is at.\n\n— Tom`,
  
      `Hi David, quick follow-up on today's viewing. The two things I know matter most: the office room and the broadband. Did either of them give you concerns, or did 14 Oak Lane tick those boxes? Happy to chat further or send other properties if useful.\n\n— Tom`
    ],
  
    "view-003": [
      `Hi Emma, lovely to meet you and James today. Wanted to follow up while it's fresh — did 14 Oak Lane feel like somewhere you could see yourselves long-term? I know you mentioned wanting to be sure about condition, so happy to arrange a chat with our surveyor contact if that would help.\n\n— Tom`,
  
      `Hi Emma, hope the rest of your afternoon went well. Quick follow-up on 14 Oak Lane — could you and James picture yourselves there in five years' time? I know you're being careful with condition; if it would help, I can put you in touch with a local surveyor for an informal chat.\n\n— Tom`,
  
      `Hi Emma! Thanks for coming to see 14 Oak Lane today. The big question for first-time buyers is always the long-term feel — did it click for you both, or were there any specific concerns we should talk through? Happy to take it slow and answer anything you want about the property's condition.\n\n— Tom`,
  
      `Hi Emma, hope you and James are well. Wanted to check in while it's fresh. I noticed you took a close look at the boiler and kitchen — were there specific things you wanted to verify before going further? I'd rather you ask all the awkward questions now than worry about them later!\n\n— Tom`,
  
      `Hi Emma, lovely meeting you both today. For your first home it's so important to feel sure, so I won't rush you. Just two questions: did the property feel right overall, and were there any concerns (condition, maintenance, anything) you'd want a second look at before considering next steps?\n\n— Tom`
    ]
  };
  
  // ============================================
  // 2. SAMPLE BUYER REPLIES (for the simulator dropdown)
  // ============================================
  
  export const sampleBuyerReplies = [
    {
      id: "sarah-positive",
      label: "Sarah Smith — Positive",
      buyerId: "view-001",
      buyerName: "Sarah Smith",
      text: "Hi Tom! We really loved the location and the garden was lovely. The kids could definitely see themselves there. The kitchen did feel a bit smaller than the photos suggested though, and we noticed some road noise from the front. Will discuss with my husband tonight and let you know — would love to arrange a second viewing this weekend if possible!"
    },
    {
      id: "sarah-mixed",
      label: "Sarah Smith — Mixed",
      buyerId: "view-001",
      buyerName: "Sarah Smith",
      text: "Thanks Tom. To be honest the kitchen was smaller than we'd hoped and the layout upstairs didn't quite work for what we need — the homework space we were thinking about wouldn't really fit. The location is lovely but I think we'll keep looking for now. Thanks for showing us round."
    },
    {
      id: "emma-worried",
      label: "Emma Wilson — Worried",
      buyerId: "view-003",
      buyerName: "Emma Wilson",
      text: "Hi Tom, thanks for today. We liked the house overall but James is a bit worried about the boiler age — you mentioned it was from 2018 but we'd want a proper check before going further. The garden is great. Could we book a survey before making any decisions?"
    }
  ];
  
  // ============================================
  // 3. STRUCTURED EXTRACTIONS — 3 variants per reply
  // (Slight variations in interpretation/scoring to feel AI-like)
  // ============================================
  
  export const extractionResults: Record<string, any[]> = {
    "sarah-positive": [
      {
        positive_aspects: ["location", "garden", "child-friendly feel"],
        negative_aspects: ["kitchen size smaller than expected", "road noise from front"],
        interest_level: "high",
        next_action: "wants_second_viewing",
        sentiment_score: 0.75,
        requires_agent_attention: false,
        attention_reason: null,
        suggested_followup: "Confirm second viewing for the weekend, mention partner's availability"
      },
      {
        positive_aspects: ["location praised", "garden well-received", "kids responded positively"],
        negative_aspects: ["kitchen perception vs. photos", "front-facing road noise"],
        interest_level: "high",
        next_action: "wants_second_viewing",
        sentiment_score: 0.78,
        requires_agent_attention: false,
        attention_reason: null,
        suggested_followup: "Offer weekend slots for second viewing with husband; prepare answers for kitchen size concerns"
      },
      {
        positive_aspects: ["location", "garden", "suitability for children"],
        negative_aspects: ["kitchen smaller than photos suggested", "road noise concern"],
        interest_level: "medium-high",
        next_action: "wants_second_viewing",
        sentiment_score: 0.72,
        requires_agent_attention: false,
        attention_reason: null,
        suggested_followup: "Schedule second viewing; consider proactively addressing kitchen concern with measurements"
      }
    ],
  
    "sarah-mixed": [
      {
        positive_aspects: ["location"],
        negative_aspects: ["kitchen size", "upstairs layout doesn't fit homework space need"],
        interest_level: "low",
        next_action: "lost_interest",
        sentiment_score: 0.3,
        requires_agent_attention: true,
        attention_reason: "Buyer indicating they will keep looking — opportunity to suggest similar properties before they go elsewhere",
        suggested_followup: "Send 2-3 alternative properties matching her layout needs"
      },
      {
        positive_aspects: ["location appreciated"],
        negative_aspects: ["kitchen below expectations", "upstairs unsuitable for stated homework-space requirement"],
        interest_level: "low",
        next_action: "lost_interest",
        sentiment_score: 0.28,
        requires_agent_attention: true,
        attention_reason: "Clear rejection but polite — high risk of going to competitor agency. Move quickly with alternatives.",
        suggested_followup: "Within 24h: send 3 properties with larger kitchens and flexible upstairs layouts"
      },
      {
        positive_aspects: ["location is positive"],
        negative_aspects: ["kitchen size", "upstairs layout misaligned with homework-space requirement"],
        interest_level: "low",
        next_action: "lost_interest",
        sentiment_score: 0.32,
        requires_agent_attention: true,
        attention_reason: "Buyer disengaging — opportunity to retain by showing we understood their specific needs",
        suggested_followup: "Personalised email with 2-3 properties addressing the homework-space need directly; reference her motivation"
      }
    ],
  
    "emma-worried": [
      {
        positive_aspects: ["overall property", "garden"],
        negative_aspects: ["boiler age concern", "wants survey before committing"],
        interest_level: "medium",
        next_action: "needs_more_info",
        sentiment_score: 0.55,
        requires_agent_attention: false,
        attention_reason: null,
        suggested_followup: "Connect with surveyor contact, follow up with vendor about boiler service history"
      },
      {
        positive_aspects: ["liked the house overall", "garden specifically appreciated"],
        negative_aspects: ["boiler age (2018) raises concern", "wants independent survey first"],
        interest_level: "medium",
        next_action: "needs_more_info",
        sentiment_score: 0.6,
        requires_agent_attention: false,
        attention_reason: null,
        suggested_followup: "Provide boiler service records from vendor; offer surveyor referral; reassure on first-time-buyer process"
      },
      {
        positive_aspects: ["overall positive impression", "garden praised"],
        negative_aspects: ["boiler age", "survey requested as precondition"],
        interest_level: "medium",
        next_action: "needs_more_info",
        sentiment_score: 0.58,
        requires_agent_attention: false,
        attention_reason: null,
        suggested_followup: "Arrange surveyor introduction; request boiler maintenance history from Mr. Johnson; book follow-up call within 5 days"
      }
    ],
  
    "david-simulated": [
      {
        positive_aspects: ["overall house presentation", "viewing experience"],
        negative_aspects: ["box room too small for office", "broadband speed insufficient (80Mbps)"],
        interest_level: "low",
        next_action: "lost_interest",
        sentiment_score: 0.35,
        requires_agent_attention: true,
        attention_reason: "Buyer has clear blocker (office space + broadband) — should send alternative properties matching his criteria before he goes to another agent",
        suggested_followup: "Send 2-3 properties with dedicated office space and verified high-speed broadband"
      },
      {
        positive_aspects: ["house generally well-presented"],
        negative_aspects: ["back bedroom too small for dual-monitor setup", "broadband only 80Mbps — below requirement for video calls"],
        interest_level: "low",
        next_action: "lost_interest",
        sentiment_score: 0.33,
        requires_agent_attention: true,
        attention_reason: "Polite but firm rejection — clear technical requirements unmet. Risk of losing buyer entirely.",
        suggested_followup: "Filter database for properties with 200Mbps+ broadband and 12sqm+ office space; send within 48h"
      },
      {
        positive_aspects: ["positive on viewing experience"],
        negative_aspects: ["office space inadequate", "internet infrastructure insufficient for remote work needs"],
        interest_level: "low",
        next_action: "lost_interest",
        sentiment_score: 0.4,
        requires_agent_attention: true,
        attention_reason: "Buyer is open to alternatives if his criteria are met — opportunity to demonstrate listening by sending targeted matches",
        suggested_followup: "Personally curate 3 properties: dedicated office room (3m+ wall), fibre broadband area; include broadband speed data with each"
      }
    ]
  };
  
  // David's simulated reply text (used in the in-drawer simulator)
  export const davidSimulatedReply = {
    text: "Hi Tom, thanks for the viewing. The house was nice but the box room is really too small to work as my main office — I need at least space for two monitors and a proper desk setup. Also checked the broadband and it's only 80Mbps in that area, which is below what I need for video calls. I think I'll keep looking but please keep me in mind for anything similar with a proper office space.",
    extractionId: "david-simulated"
  };
  
  // ============================================
  // 4. VENDOR WEEKLY REPORT — 5 variants
  // ============================================
  
  export const vendorReports = [
    {
      to: "j.johnson@email.com",
      subject: "14 Oak Lane — This Week's Update",
      body: `Dear Mr. Johnson,
  
  Quick update on 14 Oak Lane this week. We had three viewings — Tuesday, Thursday, and Friday afternoon.
  
  Common positives across all three: the location and proximity to Allerton Park Primary came up consistently. The garden was praised by every viewer, and two specifically mentioned the natural light upstairs.
  
  Recurring themes worth noting: two of three viewers felt the kitchen looked smaller in person than they expected from the photos. One viewer also mentioned road noise at the front, particularly during the morning visit.
  
  Current status: Sarah Smith (Tuesday viewing) is keen and looking to arrange a second viewing this weekend with her husband. David Jones (Thursday) is still considering. Emma Wilson (Friday) liked the property but has asked about a survey before progressing.
  
  My recommendation: the kitchen perception is the only recurring concern. It might be worth a quick chat about whether some light staging — perhaps removing the larger appliances on the worktop, or adding a mirror — could help future viewings. Happy to discuss when you have 10 minutes.
  
  No urgency on this — three viewings in a week is a strong signal, and we have one buyer actively progressing.
  
  Best,
  Tom
  
  Tom Mitchell
  Allerton Property Partners`
    },
  
    {
      to: "j.johnson@email.com",
      subject: "14 Oak Lane — Weekly Summary",
      body: `Dear Mr. Johnson,
  
  I hope you've had a good week. Here's a snapshot of how 14 Oak Lane has performed.
  
  Three viewings completed this week — that's strong activity for the price point and time of year.
  
  The standout positive across the board has been location. All three buyers commented on the proximity to good schools and the feel of the street. The garden has been a consistent winner too.
  
  On the constructive side: two viewers mentioned the kitchen felt more compact than the photographs suggested, which suggests the existing images may not be doing the space full justice. One buyer also picked up on road noise during morning hours.
  
  Where each buyer stands now: Sarah Smith is the warmest — she's coming back at the weekend with her husband, which is a clear positive signal. David Jones decided the property wasn't quite right for his work-from-home needs. Emma Wilson is interested but cautious, and has asked for time to arrange a survey.
  
  If you've got a moment next week, I'd love to talk through whether refreshing the kitchen photographs (perhaps with wider-angle shots) might shift that perception for future viewings. Small change, potentially meaningful impact.
  
  Best wishes,
  Tom
  
  Tom Mitchell
  Allerton Property Partners`
    },
  
    {
      to: "j.johnson@email.com",
      subject: "14 Oak Lane — Week in Review",
      body: `Dear Mr. Johnson,
  
  Hope you're well. Wanted to give you a proper update on the week's activity at 14 Oak Lane.
  
  Headline: three viewings, mixed but encouraging signals.
  
  What buyers loved: location was unanimous. Proximity to Allerton Park Primary and the wider catchment area was praised by every viewer. The garden also drew consistent compliments.
  
  Where the conversations got tougher: the kitchen came up twice as feeling smaller than buyers expected from the marketing photos. That's worth knowing because it's a perception issue rather than a property issue — and perception is fixable.
  
  The status of each viewer:
  - Sarah Smith — most engaged, requesting a second viewing with her husband this weekend
  - David Jones — withdrew, the property didn't suit his home-office requirements
  - Emma Wilson — interested but wants a survey first; standard caution for first-time buyers
  
  One suggestion for consideration: if we did a refresh of the kitchen marketing photos (or even added a brief staging adjustment), we might pre-empt that recurring comment. Totally optional, but worth flagging.
  
  Three viewings in a week is a healthy number. We have momentum.
  
  Best,
  Tom
  
  Tom Mitchell
  Allerton Property Partners`
    },
  
    {
      to: "j.johnson@email.com",
      subject: "Update on 14 Oak Lane",
      body: `Dear Mr. Johnson,
  
  A quick update from the week.
  
  We had three viewings at 14 Oak Lane — really good activity. Here's what I'm hearing:
  
  Strong positives: the location, the schools nearby, and the garden. These came up in every conversation.
  
  One thing worth flagging: the kitchen photos may be setting expectations slightly higher than the in-person reality. Two of the three viewers mentioned this, and while it's not a dealbreaker for everyone, it's been the most consistent comment.
  
  The viewers:
  1. Sarah Smith is the most promising — she's bringing her husband back for a second viewing at the weekend.
  2. David Jones decided the property didn't suit his specific needs (he works from home and needed a larger office space).
  3. Emma Wilson is a first-time buyer who liked the property but understandably wants a survey before progressing.
  
  Recommendation: I'd like to discuss whether refreshing the kitchen photos (or some light staging) might help. Happy to call this week if convenient.
  
  The market signal is positive — let's keep momentum.
  
  Best regards,
  Tom
  
  Tom Mitchell
  Allerton Property Partners`
    },
  
    {
      to: "j.johnson@email.com",
      subject: "14 Oak Lane — Friday Update",
      body: `Dear Mr. Johnson,
  
  End of the week — wanted to give you a thorough update on 14 Oak Lane.
  
  The good news first. We've had three viewings, which for this time of year and price band is well above average. Every single buyer praised the location and the garden, and two specifically mentioned the school catchment as a key draw.
  
  There's a recurring theme worth addressing. Two of three viewers felt the kitchen looked smaller in person than they'd expected from the listing photos. This isn't a problem with the kitchen itself — it's a presentation issue. Below are some options if you'd like to address it.
  
  Where things stand with each viewer: Sarah Smith is keen and has asked for a second viewing this weekend. David Jones decided it wasn't right for him — he needed a much larger home office. Emma Wilson liked it but wants to arrange a survey before going further.
  
  Options to consider for the kitchen perception:
  - New marketing photographs with wider-angle lenses
  - Light staging — clearing the worktops, perhaps adding a strategically placed mirror
  - Updated description copy emphasising actual room dimensions
  
  None of these are urgent, and I don't want to push changes you're not comfortable with. But given two out of three is a pattern worth treating, I'd like to talk it through. I can come by next Tuesday or Wednesday if that suits.
  
  Sarah's second viewing is the key event this weekend. I'll keep you posted on how it goes.
  
  Best,
  Tom
  
  Tom Mitchell
  Allerton Property Partners`
    }
  ];
  
  // ============================================
  // MOCK API CALL — picks a random variant
  // ============================================
  
  /**
   * Simulates an AI API call with a realistic delay.
   * For arrays of variants, picks one randomly to simulate AI variability.
   */
  export async function mockAICall<T>(response: T | T[], delayMs: number = 2000): Promise<T> {
    const { value } = await mockAICallVariant(
      Array.isArray(response) ? response : [response],
      null,
      delayMs
    );
    return value;
  }

  /** Picks a variant index different from excludeIndex when possible. */
  export async function mockAICallVariant<T>(
    variants: T[],
    excludeIndex: number | null = null,
    delayMs: number = 2000
  ): Promise<{ value: T; index: number }> {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    if (variants.length === 0) {
      throw new Error("mockAICallVariant: empty variants");
    }
    const pool = variants
      .map((_, i) => i)
      .filter((i) => i !== excludeIndex);
    const indices = pool.length > 0 ? pool : variants.map((_, i) => i);
    const index = indices[Math.floor(Math.random() * indices.length)];
    return { value: variants[index], index };
  }

  export type ExtractionRaw = (typeof extractionResults)[string][number];

  export function mapExtraction(raw: ExtractionRaw) {
    return {
      positiveAspects: raw.positive_aspects,
      negativeAspects: raw.negative_aspects,
      interestLevel: raw.interest_level as "low" | "medium" | "high",
      nextAction: raw.next_action,
      sentimentScore: raw.sentiment_score,
      requiresAgentAttention: raw.requires_agent_attention,
      attentionReason: raw.attention_reason,
      suggestedFollowup: raw.suggested_followup,
    };
  }

  export const defaultSentAtByViewing: Record<string, string> = {
    "view-002": "14:05",
  };

  export const drawerReplySimulations: Record<
    string,
    { buyerReply: string; extractionKey: keyof typeof extractionResults }
  > = {
    "view-001": {
      buyerReply: sampleBuyerReplies[0].text,
      extractionKey: "sarah-positive",
    },
    "view-002": {
      buyerReply: davidSimulatedReply.text,
      extractionKey: "david-simulated",
    },
    "view-003": {
      buyerReply: sampleBuyerReplies[2].text,
      extractionKey: "emma-worried",
    },
  };