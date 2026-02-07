"use client";

import { useState } from "react";
import {
  Heading,
  Text,
  Card,
  TextField,
  TextArea,
  Button,
  Checkbox,
  Badge,
  Inset,
  Table,
} from "frosted-ui";
import { CATEGORIES } from "@/lib/constants";
import { useAdminToast } from "@/contexts/admin-toast-context";
import { MOCK_INVITES, type MockInvite, type InviteStatus } from "@/data/mock-admin";

const STATUS_COLOR: Record<InviteStatus, "gray" | "blue" | "green" | "red"> = {
  Sent: "gray",
  Opened: "blue",
  Completed: "green",
  Expired: "red",
};

export default function AdminInvitesPage() {
  const toast = useAdminToast();
  const [email, setEmail] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [personalNote, setPersonalNote] = useState("");

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.toast(`Invite sent to ${email.trim()}`);
    setEmail("");
    setPartnerName("");
    setCategories([]);
    setPersonalNote("");
  };

  const handleResend = (inv: MockInvite) => {
    toast.toast(`Invite resent to ${inv.email}`);
  };

  const handleRevoke = (inv: MockInvite) => {
    toast.toast(`Invite revoked for ${inv.email}`);
  };

  const handleViewSubmission = (inv: MockInvite) => {
    toast.toast(`Opening submission for ${inv.name ?? inv.email}`);
  };

  return (
    <div className="p-6">
      <Inset side="all" clip="padding-box" className="max-w-5xl mx-auto">
        <Heading size="6" className="mb-6">
          Invite Partners
        </Heading>

        <Card className="p-5 mb-8">
          <Heading size="4" className="mb-4">
            Send Invite
          </Heading>
          <form onSubmit={handleSendInvite} className="space-y-4 max-w-xl">
            <TextField.Root>
              <TextField.Input
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                placeholder="Partner name (optional)"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
              />
            </TextField.Root>
            <div>
              <Text size="2" color="gray" className="mb-2 block">
                Suggested categories
              </Text>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <Checkbox
                    key={cat}
                    checked={categories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  >
                    {cat}
                  </Checkbox>
                ))}
              </div>
            </div>
            <TextArea
              placeholder="Personal note (optional)"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              rows={3}
              className="w-full"
            />
            <Button type="submit" size="3">
              Send Invite
            </Button>
          </form>
        </Card>

        <Heading size="4" className="mb-4">
          Pending Invites
        </Heading>
        <Card className="overflow-hidden">
          <Table.Root>
            <Table.Table>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Sent Date</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {MOCK_INVITES.map((inv) => (
                  <Table.Row key={inv.id}>
                    <Table.Cell>{inv.email}</Table.Cell>
                    <Table.Cell>{inv.name ?? "—"}</Table.Cell>
                    <Table.Cell>
                      <Badge color={STATUS_COLOR[inv.status]} size="1">
                        {inv.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{inv.sentDate}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        {inv.status === "Completed" ? (
                          <Button
                            size="1"
                            variant="soft"
                            onClick={() => handleViewSubmission(inv)}
                          >
                            View Submission
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="1"
                              variant="soft"
                              onClick={() => handleResend(inv)}
                            >
                              Resend
                            </Button>
                            <Button
                              size="1"
                              variant="soft"
                              color="red"
                              onClick={() => handleRevoke(inv)}
                            >
                              Revoke
                            </Button>
                          </>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Table>
          </Table.Root>
        </Card>
      </Inset>
    </div>
  );
}
