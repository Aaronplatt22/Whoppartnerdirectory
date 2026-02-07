export type PartnerType = "agency" | "service_provider" | "tech_partner";
export type PriceRange = "$" | "$$" | "$$$" | "$$$$";
export type ResponseTime = "< 24 hours" | "1-2 days" | "3-5 days";

export interface FeaturedWhop {
  name: string;
  logo: string;
}

export interface CaseStudy {
  title: string;
  summary: string;
  metrics: Record<string, string>;
  whopName: string;
}

export interface Review {
  rating: number;
  text: string;
  reviewerName: string;
  whopName: string;
  date: string;
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  tagline: string;
  description: string;
  partnerType: PartnerType;
  categories: string[];
  industries: string[];
  featuredWhops: FeaturedWhop[];
  caseStudies: CaseStudy[];
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
  priceRange: PriceRange;
  location: string;
  timezone: string;
  languages: string[];
  responseTime: ResponseTime;
  contactEmail: string;
  website: string;
  calendlyLink: string | null;
  // AM-only fields
  internalNotes: string;
  internalTags: string[];
  whopContactPerson: string;
  lastEngagementDate: string;
  recommendedFor: string[];
}

export interface PartnerFilters {
  search: string;
  partnerType: PartnerType | "all";
  categories: string[];
  industries: string[];
  priceRange: PriceRange | "all";
  minRating: number;
  sortBy: "relevance" | "rating" | "reviews" | "recent";
}
