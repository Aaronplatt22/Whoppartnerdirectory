"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Heading,
  Text,
  Card,
  Button,
  Badge,
  Inset,
  Tabs,
  Select,
  Dialog,
  AlertDialog,
} from "frosted-ui";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { mockPartners } from "@/data/mock-partners";
import {
  buildReviewsForModeration,
  type ReviewForModeration,
  type ReviewModerationStatus,
} from "@/data/mock-admin";
import { useAdminToast } from "@/contexts/admin-toast-context";

type ReviewTab = "all" | "pending" | "disputed" | "flagged";
type SortOption = "recent" | "lowest" | "highest";

const REMOVE_REASONS = [
  "Spam",
  "Fake",
  "Competitor",
  "Inappropriate",
  "Other",
] as const;

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarFilledIcon
          key={i}
          width={16}
          height={16}
          style={{
            color: i <= rating ? "#FA4616" : "var(--gray-7)",
          }}
        />
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
  const toast = useAdminToast();
  const [tab, setTab] = useState<ReviewTab>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [reviews, setReviews] = useState<ReviewForModeration[]>(() =>
    buildReviewsForModeration(mockPartners)
  );
  const [removeReview, setRemoveReview] = useState<{
    review: ReviewForModeration;
    reason: string;
  } | null>(null);
  const [viewDisputeReview, setViewDisputeReview] =
    useState<ReviewForModeration | null>(null);

  const filteredByTab = useMemo(() => {
    switch (tab) {
      case "pending":
        return reviews.filter((r) => r.moderationStatus === "Pending");
      case "disputed":
        return reviews.filter((r) => r.isDisputed);
      case "flagged":
        return reviews.filter((r) => r.moderationStatus === "Flagged");
      default:
        return reviews;
    }
  }, [reviews, tab]);

  const sortedReviews = useMemo(() => {
    const list = [...filteredByTab];
    switch (sort) {
      case "recent":
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "lowest":
        list.sort((a, b) => a.rating - b.rating);
        break;
      case "highest":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [filteredByTab, sort]);

  const handleApprove = (review: ReviewForModeration) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, moderationStatus: "Approved" as const } : r
      )
    );
    toast.toast("Review approved");
  };

  const handleRemove = () => {
    if (!removeReview) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === removeReview.review.id
          ? { ...r, moderationStatus: "Removed" as const }
          : r
      )
    );
    toast.toast(`Review removed (${removeReview.reason})`);
    setRemoveReview(null);
  };

  const statusColor = (
    s: ReviewModerationStatus
  ): "gray" | "blue" | "green" | "red" => {
    switch (s) {
      case "Pending":
        return "blue";
      case "Approved":
        return "green";
      case "Flagged":
        return "red";
      case "Removed":
        return "gray";
    }
  };

  return (
    <div className="p-6">
      <Inset side="all" clip="padding-box" className="max-w-4xl mx-auto">
        <Heading size="6" className="mb-6">
          Moderate Reviews
        </Heading>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Tabs.Root value={tab} onValueChange={(v) => setTab(v as ReviewTab)}>
            <Tabs.List>
              <Tabs.Trigger value="all">All Reviews</Tabs.Trigger>
              <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
              <Tabs.Trigger value="disputed">Disputed</Tabs.Trigger>
              <Tabs.Trigger value="flagged">Flagged</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
          <Select.Root value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <Select.Trigger placeholder="Sort" className="w-48" />
            <Select.Content>
              <Select.Item value="recent">Most Recent</Select.Item>
              <Select.Item value="lowest">Lowest Rating First</Select.Item>
              <Select.Item value="highest">Highest Rating First</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ReviewStars rating={review.rating} />
                    <Badge size="1" color={statusColor(review.moderationStatus)}>
                      {review.moderationStatus}
                    </Badge>
                    {review.isDisputed && (
                      <Badge size="1" color="amber">
                        Disputed
                      </Badge>
                    )}
                  </div>
                  <Text size="1" color="gray">
                    {review.date}
                  </Text>
                </div>
                <Text size="2">{review.text}</Text>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-11">
                  <span>
                    <strong>{review.reviewerName}</strong>
                    {review.whopName !== "—" && ` · ${review.whopName}`}
                  </span>
                </div>
                <div>
                  <Text size="1" color="gray">
                    Partner:{" "}
                  </Text>
                  <Link
                    href={`/partners/${review.partnerSlug}`}
                    className="text-orange-11 hover:underline font-medium"
                  >
                    {review.partnerName}
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="1"
                    variant="soft"
                    color="green"
                    onClick={() => handleApprove(review)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="1"
                    variant="soft"
                    color="red"
                    onClick={() =>
                      setRemoveReview({ review, reason: REMOVE_REASONS[0] })
                    }
                  >
                    Remove Review
                  </Button>
                  {review.isDisputed && review.disputeReason && (
                    <Button
                      size="1"
                      variant="soft"
                      color="amber"
                      onClick={() => setViewDisputeReview(review)}
                    >
                      View Partner Response
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {sortedReviews.length === 0 && (
          <Text size="2" color="gray">
            No reviews in this tab.
          </Text>
        )}
      </Inset>

      {/* Remove Review dialog with reason */}
      <AlertDialog.Root
        open={!!removeReview}
        onOpenChange={(open) => !open && setRemoveReview(null)}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>Remove this review?</AlertDialog.Title>
          <AlertDialog.Description>
            Select a reason. The review will be hidden from the partner profile.
          </AlertDialog.Description>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-11 mb-1">
              Reason
            </label>
            <Select.Root
              value={removeReview?.reason ?? REMOVE_REASONS[0]}
              onValueChange={(v) =>
                setRemoveReview((prev) =>
                  prev ? { ...prev, reason: v } : null
                )
              }
            >
              <Select.Trigger className="w-full" />
              <Select.Content>
                {REMOVE_REASONS.map((r) => (
                  <Select.Item key={r} value={r}>
                    {r}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialog.Cancel asChild>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button color="red" onClick={handleRemove}>
                Remove Review
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* View Partner Response (dispute reason) */}
      <Dialog.Root
        open={!!viewDisputeReview}
        onOpenChange={(open) => !open && setViewDisputeReview(null)}
      >
        <Dialog.Content>
          <Dialog.Title>Partner response (dispute)</Dialog.Title>
          <Dialog.Description>
            {viewDisputeReview?.partnerName} has disputed this review.
          </Dialog.Description>
          <div className="mt-3 p-3 rounded-lg bg-gray-3 text-sm">
            {viewDisputeReview?.disputeReason}
          </div>
          <div className="flex justify-end mt-4">
            <Dialog.Close asChild>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
