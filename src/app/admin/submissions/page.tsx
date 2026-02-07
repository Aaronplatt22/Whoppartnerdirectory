"use client";

import { useState } from "react";
import {
  Heading,
  Text,
  Card,
  Badge,
  Button,
  TextArea,
  Dialog,
  AlertDialog,
  Inset,
} from "frosted-ui";
import { CheckIcon, Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useAdminToast } from "@/contexts/admin-toast-context";
import { MOCK_SUBMISSIONS, type MockSubmission } from "@/data/mock-admin";

function SubmissionCard({ submission }: { submission: MockSubmission }) {
  const toast = useAdminToast();
  const [notes, setNotes] = useState("");
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  const handleApprove = () => {
    toast.toast("Partner approved and added to directory");
  };

  const handleRequestChanges = () => {
    setRequestChangesOpen(false);
    setRequestMessage("");
    toast.toast("Change request sent");
  };

  const handleReject = () => {
    setRejectOpen(false);
    toast.toast("Submission rejected");
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-0">
        {/* Left: submitted profile preview (read-only) */}
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-6 space-y-4 overflow-auto max-h-[480px]">
          <div>
            <Heading size="4">{submission.partnerName}</Heading>
            <Text size="2" color="gray">
              {submission.tagline}
            </Text>
          </div>
          <Text size="2" className="block">
            {submission.description}
          </Text>
          <div>
            <Text size="1" color="gray" className="uppercase tracking-wide">
              Type
            </Text>
            <Text size="2">{submission.partnerType}</Text>
          </div>
          <div>
            <Text size="1" color="gray" className="uppercase tracking-wide">
              Categories
            </Text>
            <div className="flex flex-wrap gap-1 mt-1">
              {submission.categories.map((c) => (
                <Badge key={c} size="1" variant="soft">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          {submission.caseStudies.length > 0 && (
            <div>
              <Text size="1" color="gray" className="uppercase tracking-wide">
                Case studies
              </Text>
              <ul className="mt-1 space-y-2">
                {submission.caseStudies.map((cs, i) => (
                  <li key={i}>
                    <Text size="2" weight="medium">
                      {cs.title}
                    </Text>
                    <Text size="2" color="gray">
                      {cs.summary}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              <Text size="1" color="gray">Email: </Text>
              <Text size="2">{submission.contactEmail}</Text>
            </span>
            <span>
              <Text size="1" color="gray">Website: </Text>
              <a
                href={submission.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-11 hover:underline"
              >
                {submission.website}
              </a>
            </span>
          </div>
        </div>

        {/* Right: admin actions */}
        <div className="p-5 flex flex-col gap-4 bg-gray-2/50">
          <Badge size="2" color="gray">
            Pending Review
          </Badge>
          <div>
            <Text size="1" color="gray">
              Submitted
            </Text>
            <Text size="2">{submission.submittedDate}</Text>
          </div>
          <div>
            <Text size="1" color="gray">
              Invite
            </Text>
            <Text size="2">{submission.inviteEmail}</Text>
          </div>
          <div>
            <Text size="1" color="gray" className="mb-2 block">
              Checklist
            </Text>
            <ul className="space-y-1">
              {submission.checklist.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {item.checked ? (
                    <CheckIcon width={16} height={16} className="text-green-9 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded border border-gray-7 shrink-0" />
                  )}
                  <Text size="2">{item.label}</Text>
                </li>
              ))}
            </ul>
          </div>
          <TextArea
            placeholder="Internal notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full"
          />
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            <Button
              size="2"
              color="green"
              onClick={handleApprove}
            >
              <CheckIcon width={16} height={16} />
              Approve
            </Button>
            <Button
              size="2"
              color="amber"
              variant="soft"
              onClick={() => setRequestChangesOpen(true)}
            >
              <Pencil1Icon width={16} height={16} />
              Request Changes
            </Button>
            <Button
              size="2"
              color="red"
              variant="soft"
              onClick={() => setRejectOpen(true)}
            >
              <Cross2Icon width={16} height={16} />
              Reject
            </Button>
          </div>
        </div>
      </div>

      {/* Request Changes dialog */}
      <Dialog.Root open={requestChangesOpen} onOpenChange={setRequestChangesOpen}>
        <Dialog.Content>
          <Dialog.Title>Request Changes</Dialog.Title>
          <Dialog.Description>
            Send a message to the partner explaining what they need to update.
          </Dialog.Description>
          <TextArea
            placeholder="What should they change?"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            rows={4}
            className="w-full mt-3"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Dialog.Close asChild>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="amber" onClick={handleRequestChanges}>
              Send Request
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* Reject confirmation */}
      <AlertDialog.Root open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialog.Content>
          <AlertDialog.Title>Reject submission?</AlertDialog.Title>
          <AlertDialog.Description>
            This will reject the submission from {submission.partnerName}. They can submit again after making changes.
          </AlertDialog.Description>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialog.Cancel asChild>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button color="red" onClick={handleReject}>
                Reject
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Card>
  );
}

export default function AdminSubmissionsPage() {
  return (
    <div className="p-6">
      <Inset side="all" clip="padding-box" className="max-w-5xl mx-auto">
        <Heading size="6" className="mb-6">
          Review Submissions
        </Heading>
        <div className="space-y-6">
          {MOCK_SUBMISSIONS.map((sub) => (
            <SubmissionCard key={sub.id} submission={sub} />
          ))}
        </div>
      </Inset>
    </div>
  );
}
