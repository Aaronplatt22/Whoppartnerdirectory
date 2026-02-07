// Mock data for admin UI shells (no persistence)

export type InviteStatus = "Sent" | "Opened" | "Completed" | "Expired";

export interface MockInvite {
  id: string;
  email: string;
  name: string | null;
  status: InviteStatus;
  sentDate: string;
}

export const MOCK_INVITES: MockInvite[] = [
  { id: "1", email: "james@growthagency.com", name: "Growth Agency", status: "Sent", sentDate: "Mar 10, 2025" },
  { id: "2", email: "maria@designlab.co", name: "Design Lab", status: "Opened", sentDate: "Mar 8, 2025" },
  { id: "3", email: "kevin@techtools.io", name: "TechTools", status: "Completed", sentDate: "Mar 5, 2025" },
  { id: "4", email: "sarah@contentpro.com", name: null, status: "Sent", sentDate: "Mar 12, 2025" },
  { id: "5", email: "ahmed@scalemasters.com", name: "Scale Masters", status: "Expired", sentDate: "Feb 20, 2025" },
];

export interface MockActivity {
  id: string;
  text: string;
  timeAgo: string;
}

export const MOCK_ACTIVITY: MockActivity[] = [
  { id: "1", text: "New submission from 'ContentKing Media'", timeAgo: "2 hours ago" },
  { id: "2", text: "Partner 'Pixel Forge Studio' updated their profile", timeAgo: "5 hours ago" },
  { id: "3", text: "Review flagged on 'Discord Architects'", timeAgo: "1 day ago" },
  { id: "4", text: "Invite sent to james@growthagency.com", timeAgo: "2 days ago" },
];

// Submission checklist item for admin review
export interface SubmissionChecklistItem {
  label: string;
  checked: boolean;
}

// One pending submission (what the partner submitted)
export interface MockSubmission {
  id: string;
  partnerName: string;
  tagline: string;
  description: string;
  partnerType: string;
  categories: string[];
  caseStudies: { title: string; summary: string }[];
  contactEmail: string;
  website: string;
  submittedDate: string;
  inviteEmail: string;
  checklist: SubmissionChecklistItem[];
}

export const MOCK_SUBMISSIONS: MockSubmission[] = [
  {
    id: "sub-1",
    partnerName: "ContentKing Media",
    tagline: "Content that converts. Strategy that scales.",
    description: "We help Whop creators build content systems that drive signups and retention. From course outlines to social content calendars, we turn your expertise into repeatable assets. Our clients see 2–3x engagement within 90 days.",
    partnerType: "Agency",
    categories: ["Growth Strategy", "Content & Courses"],
    caseStudies: [
      { title: "EduMax: 40% completion rate in 60 days", summary: "Designed a 12-module course structure and weekly email sequences; completion rate went from 12% to 40%." },
    ],
    contactEmail: "hello@contentkingmedia.com",
    website: "https://contentkingmedia.com",
    submittedDate: "Mar 14, 2025",
    inviteEmail: "founder@contentkingmedia.com",
    checklist: [
      { label: "Logo uploaded", checked: true },
      { label: "Description complete", checked: true },
      { label: "Case study provided", checked: true },
      { label: "Contact info complete", checked: true },
    ],
  },
  {
    id: "sub-2",
    partnerName: "DevOps Dan",
    tagline: "Whop integrations and automation, done right.",
    description: "Solo developer specializing in Whop API integrations, Discord bots, and Zapier/Make workflows. I've built 20+ custom integrations for Whop sellers.",
    partnerType: "Service Provider",
    categories: ["Development", "Automation & Integrations"],
    caseStudies: [],
    contactEmail: "dan@devopsdan.io",
    website: "https://devopsdan.io",
    submittedDate: "Mar 13, 2025",
    inviteEmail: "dan@devopsdan.io",
    checklist: [
      { label: "Logo uploaded", checked: true },
      { label: "Description complete", checked: true },
      { label: "Case study provided", checked: false },
      { label: "Contact info complete", checked: true },
    ],
  },
  {
    id: "sub-3",
    partnerName: "TrafficMonster",
    tagline: "We run ads.",
    description: "We run Meta and TikTok ads for Whop. Good results.",
    partnerType: "Agency",
    categories: ["Paid Acquisition"],
    caseStudies: [
      { title: "Fitness brand: 3x ROAS", summary: "Scaled from $500 to $5K ad spend while maintaining 3x ROAS over 6 months." },
    ],
    contactEmail: "hey@trafficmonster.com",
    website: "https://trafficmonster.com",
    submittedDate: "Mar 12, 2025",
    inviteEmail: "sarah@trafficmonster.com",
    checklist: [
      { label: "Logo uploaded", checked: true },
      { label: "Description complete", checked: true },
      { label: "Case study provided", checked: true },
      { label: "Contact info complete", checked: true },
    ],
  },
];

// --- Partner management (Manage Partners page) ---
export type PartnerManagementStatus = "Active" | "Suspended" | "Archived" | "Featured";

/** Partner IDs that are featured by default (1, 2, 7, 8) */
export const FEATURED_PARTNER_IDS = new Set(["1", "2", "7", "8"]);

/** Mock "last updated" dates per partner id (for table column) */
export const PARTNER_LAST_UPDATED: Record<string, string> = {
  "1": "2025-03-10",
  "2": "2025-03-08",
  "3": "2025-03-05",
  "4": "2025-03-12",
  "5": "2025-03-01",
  "6": "2025-03-14",
  "7": "2025-03-15",
  "8": "2025-03-14",
  "9": "2025-03-06",
  "10": "2025-02-25",
  "11": "2025-03-01",
  "12": "2025-02-20",
};

// --- Review moderation (Moderate Reviews page) ---
export type ReviewModerationStatus = "Pending" | "Approved" | "Flagged" | "Removed";

export interface ReviewForModeration {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerSlug: string;
  rating: number;
  text: string;
  reviewerName: string;
  whopName: string;
  date: string;
  moderationStatus: ReviewModerationStatus;
  isDisputed?: boolean;
  disputeReason?: string;
}

/** Build flattened reviews for moderation from mock partners + 2 extra mock flagged/disputed reviews */
export function buildReviewsForModeration(partners: { id: string; name: string; slug: string; reviews: { rating: number; text: string; reviewerName: string; whopName: string; date: string }[] }[]): ReviewForModeration[] {
  const list: ReviewForModeration[] = [];
  let id = 1;
  let pendingCount = 0;
  for (const partner of partners) {
    for (const r of partner.reviews) {
      list.push({
        id: `rev-${id++}`,
        partnerId: partner.id,
        partnerName: partner.name,
        partnerSlug: partner.slug,
        rating: r.rating,
        text: r.text,
        reviewerName: r.reviewerName,
        whopName: r.whopName,
        date: r.date,
        moderationStatus: pendingCount < 2 ? "Pending" : "Approved",
      });
      pendingCount++;
    }
  }
  list.push({
    id: "rev-disputed",
    partnerId: "1",
    partnerName: "Whop Growth Labs",
    partnerSlug: "whop-growth-labs",
    rating: 1,
    text: "Scam. Took my money and ghosted.",
    reviewerName: "Anonymous",
    whopName: "—",
    date: "2025-03-11",
    moderationStatus: "Pending",
    isDisputed: true,
    disputeReason: "Partner claims this review is from a competitor. No record of a client named Anonymous. Request removal.",
  });
  list.push({
    id: "rev-flagged",
    partnerId: "4",
    partnerName: "AdScale Media",
    partnerSlug: "adscale-media",
    rating: 1,
    text: "terrible service avoid",
    reviewerName: "Bot123",
    whopName: "—",
    date: "2025-03-13",
    moderationStatus: "Flagged",
    isDisputed: false,
  });
  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
