"use client";

import { useMemo, useState } from "react";
import { Heading, Text, Tabs, Select, Switch } from "frosted-ui";
import { Inset } from "frosted-ui";
import { mockPartners } from "@/data/mock-partners";
import type { PartnerFilters } from "@/lib/types";
import { useFilters } from "@/hooks/use-filters";
import { FilterSidebar } from "@/components/ui/filter-sidebar";
import { PartnerCard } from "@/components/ui/partner-card";
import { MatchingBot } from "@/components/am/matching-bot";

const SORT_OPTIONS: { value: PartnerFilters["sortBy"]; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Rating" },
  { value: "reviews", label: "Most Reviews" },
  { value: "recent", label: "Recently Added" },
];

export default function AMPage() {
  const [onlyAMRecommended, setOnlyAMRecommended] = useState(false);
  const { filters, setFilter, filteredPartners, totalCount } = useFilters();

  const amFilteredPartners = useMemo(() => {
    if (!onlyAMRecommended) return filteredPartners;
    return filteredPartners.filter((p) => p.recommendedFor.length > 0);
  }, [filteredPartners, onlyAMRecommended]);

  return (
    <div className="flex-1 py-8 px-4">
      <Inset side="all" clip="padding-box" className="max-w-6xl mx-auto">
        <Heading size="6" className="mb-6">
          AM Dashboard
        </Heading>

        <Tabs.Root defaultValue="matcher" className="w-full">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="matcher">AI Partner Matcher</Tabs.Trigger>
            <Tabs.Trigger value="directory">Directory (AM View)</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="matcher">
            <MatchingBot />
          </Tabs.Content>

          <Tabs.Content value="directory">
            <div className="flex gap-8">
              <div className="w-[280px] shrink-0 hidden lg:block">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={(next) => setFilter(next)}
                  allPartners={mockPartners}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <Text size="2" color="gray">
                      Showing {amFilteredPartners.length} partner{amFilteredPartners.length !== 1 ? "s" : ""}
                    </Text>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Switch
                        checked={onlyAMRecommended}
                        onCheckedChange={(checked) => setOnlyAMRecommended(!!checked)}
                      />
                      <Text size="2">Only AM-recommended</Text>
                    </label>
                  </div>
                  <Select.Root
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilter({ sortBy: value as PartnerFilters["sortBy"] })
                    }
                  >
                    <Select.Trigger size="2" variant="surface" color="gray" />
                    <Select.Content>
                      {SORT_OPTIONS.map((opt) => (
                        <Select.Item key={opt.value} value={opt.value}>
                          {opt.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                {amFilteredPartners.length === 0 ? (
                  <div className="py-16 text-center rounded-lg border border-gray-6 bg-gray-2/50">
                    <Text size="2" color="gray">
                      No partners match. Try adjusting filters or turn off &quot;Only AM-recommended&quot;.
                    </Text>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {amFilteredPartners.map((partner) => (
                      <PartnerCard
                        key={partner.id}
                        partner={partner}
                        showInternalFields
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Inset>
    </div>
  );
}
