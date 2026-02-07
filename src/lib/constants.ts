export const CATEGORIES = [
  "Community Building",
  "Sales Page Design",
  "Paid Acquisition",
  "Content & Courses",
  "Automation & Integrations",
  "Growth Strategy",
  "Branding & Creative",
  "Development",
  "Migration",
] as const;

export const INDUSTRIES = [
  "Trading",
  "Education",
  "Fitness",
  "SaaS",
  "Sports",
  "Real Estate",
  "Social Media",
  "Gaming",
] as const;

export const PARTNER_TYPE_LABELS: Record<string, string> = {
  agency: "Agency",
  service_provider: "Service Provider",
  tech_partner: "Tech Partner",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "Community Building": "ChatBubbleIcon",
  "Sales Page Design": "DesktopIcon",
  "Paid Acquisition": "RocketIcon",
  "Content & Courses": "VideoIcon",
  "Automation & Integrations": "LightningBoltIcon",
  "Growth Strategy": "BarChartIcon",
  "Branding & Creative": "ColorWheelIcon",
  "Development": "CodeIcon",
  "Migration": "ArrowRightIcon",
};

// AM Match form options
export const REVENUE_OPTIONS = [
  "Pre-launch",
  "$0-$1K",
  "$1K-$5K",
  "$5K-$10K",
  "$10K-$25K",
  "$25K-$50K",
  "$50K-$100K",
  "$100K+",
] as const;

export const MEMBER_COUNT_OPTIONS = [
  "0-100",
  "100-500",
  "500-1,000",
  "1,000-5,000",
  "5,000-10,000",
  "10,000+",
] as const;

export const CHALLENGE_OPTIONS = [
  "Low Conversion",
  "High Churn",
  "Need Course Content",
  "Community is Dead",
  "No Paid Traffic",
  "Platform Migration",
  "Need Automation",
  "Branding/Design",
  "Analytics/Data",
] as const;

export const BUDGET_OPTIONS = [
  { value: "$", label: "$ (Under $1K)" },
  { value: "$$", label: "$$ ($1K-$5K)" },
  { value: "$$$", label: "$$$ ($5K-$15K)" },
  { value: "$$$$", label: "$$$$ ($15K+)" },
] as const;
