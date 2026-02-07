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
