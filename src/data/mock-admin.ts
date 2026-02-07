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
