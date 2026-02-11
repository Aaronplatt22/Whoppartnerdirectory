"use client";

import { useState, useEffect } from "react";
import {
  Heading,
  Text,
  Card,
  TextField,
  Button,
  Badge,
  Inset,
  Table,
  Select,
} from "frosted-ui";
import { useAdminToast } from "@/contexts/admin-toast-context";

type InviteRow = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
};

export default function AdminInvitesPage() {
  const toast = useAdminToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "account_manager" | "partner">("partner");
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);

  const loadInvites = async () => {
    try {
      const res = await fetch("/api/invites");
      if (res.ok) {
        const data = await res.json();
        setInvites(data);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.toast(data.error ?? "Failed to load invites");
      }
    } catch {
      toast.toast("Failed to load invites");
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setLastInviteLink(null);
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.toast(data.error ?? "Failed to send invite");
        setLoading(false);
        return;
      }
      toast.toast(`Invite created for ${data.email}`);
      setLastInviteLink(data.inviteLink);
      setEmail("");
      loadInvites();
    } catch {
      toast.toast("Failed to send invite");
    }
    setLoading(false);
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.toast("Link copied to clipboard");
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div className="p-6">
      <Inset side="all" clip="padding-box" className="max-w-5xl mx-auto">
        <Heading size="6" className="mb-6">
          Invite Partners & Team
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
            <div>
              <Text size="2" color="gray" className="mb-2 block">
                Invite as
              </Text>
              <Select.Root
                value={role}
                onValueChange={(v) => setRole(v as "admin" | "account_manager" | "partner")}
              >
                <Select.Trigger className="w-full max-w-xs" />
                <Select.Content>
                  <Select.Item value="partner">Partner (directory)</Select.Item>
                  <Select.Item value="account_manager">Team: Account Manager</Select.Item>
                  <Select.Item value="admin">Team: Admin</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            <Button type="submit" size="3" disabled={loading}>
              {loading ? "Creating…" : "Create invite link"}
            </Button>
            {lastInviteLink && (
              <div className="p-3 rounded-lg bg-gray-3 space-y-2">
                <Text size="2" weight="medium">
                  Invite link (share with invitee):
                </Text>
                <div className="flex gap-2 flex-wrap items-center">
                  <code className="text-sm break-all text-gray-11">{lastInviteLink}</code>
                  <Button size="1" variant="soft" onClick={() => copyLink(lastInviteLink)}>
                    Copy
                  </Button>
                </div>
              </div>
            )}
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
                  <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Expires</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {invites.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <Text color="gray">No pending invites.</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  invites.map((inv) => (
                    <Table.Row key={inv.id}>
                      <Table.Cell>{inv.email}</Table.Cell>
                      <Table.Cell>
                        <Badge size="1" color={inv.role === "admin" ? "red" : inv.role === "partner" ? "orange" : "blue"}>
                          {inv.role}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        {isExpired(inv.expiresAt) ? (
                          <Badge color="red" size="1">Expired</Badge>
                        ) : (
                          new Date(inv.expiresAt).toLocaleDateString()
                        )}
                      </Table.Cell>
                      <Table.Cell>{new Date(inv.createdAt).toLocaleDateString()}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Table>
          </Table.Root>
        </Card>
      </Inset>
    </div>
  );
}
