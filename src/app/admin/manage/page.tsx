"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Heading,
  Text,
  Card,
  TextField,
  TextArea,
  Button,
  Badge,
  Inset,
  Table,
  Select,
  DropdownMenu,
  IconButton,
  Dialog,
  AlertDialog,
  Sheet,
  Avatar,
} from "frosted-ui";
import { DotsHorizontalIcon, StarFilledIcon } from "@radix-ui/react-icons";
import {
  FEATURED_PARTNER_IDS,
  PARTNER_LAST_UPDATED,
  type PartnerManagementStatus,
} from "@/data/mock-admin";
import { useAdminToast } from "@/contexts/admin-toast-context";
import { PartnerTypeBadge } from "@/components/ui/partner-type-badge";
import type { Partner } from "@/lib/types";

type StatusFilter = "All" | "Active" | "Suspended" | "Featured";
type SortKey = "name" | "type" | "rating" | "status" | "lastUpdated";

export default function AdminManagePartnersPage() {
  const toast = useAdminToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [featuredIds, setFeaturedIds] = useState<Set<string>>(
    () => new Set(FEATURED_PARTNER_IDS)
  );
  const [partnerStatus, setPartnerStatus] = useState<Record<string, "Active" | "Suspended" | "Archived">>({});
  const [editNotesPartner, setEditNotesPartner] = useState<Partner | null>(null);
  const [editNotesValue, setEditNotesValue] = useState("");
  const [suspendPartner, setSuspendPartner] = useState<Partner | null>(null);
  const [archivePartner, setArchivePartner] = useState<Partner | null>(null);
  const [sheetPartner, setSheetPartner] = useState<Partner | null>(null);

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then(setPartners)
      .catch(() => setPartners([]));
  }, []);

  const getStatus = (p: Partner): PartnerManagementStatus => {
    const s = partnerStatus[p.id] ?? "Active";
    if (featuredIds.has(p.id)) return "Featured";
    return s;
  };

  const filteredAndSorted = useMemo(() => {
    let list = partners.filter((p) => {
      const nameMatch = !search.trim() || p.name.toLowerCase().includes(search.toLowerCase());
      const status = getStatus(p);
      const statusMatch =
        statusFilter === "All" ||
        (statusFilter === "Featured" && status === "Featured") ||
        (statusFilter === "Active" && status === "Active") ||
        (statusFilter === "Suspended" && status === "Suspended");
      return nameMatch && statusMatch;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "type":
          cmp = a.partnerType.localeCompare(b.partnerType);
          break;
        case "rating":
          cmp = a.avgRating - b.avgRating;
          break;
        case "status":
          cmp = String(getStatus(a)).localeCompare(String(getStatus(b)));
          break;
        case "lastUpdated":
          cmp =
            (PARTNER_LAST_UPDATED[b.id] ?? "").localeCompare(
              PARTNER_LAST_UPDATED[a.id] ?? ""
            );
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [partners, search, statusFilter, sortKey, sortAsc, featuredIds, partnerStatus]);

  const toggleSort = (key: SortKey) => {
    setSortKey(key);
    setSortAsc((prev) => (sortKey === key ? !prev : true));
  };

  const toggleFeatured = (p: Partner) => {
    setFeaturedIds((prev) => {
      const next = new Set(prev);
      if (next.has(p.id)) next.delete(p.id);
      else next.add(p.id);
      return next;
    });
    toast.toast(
      featuredIds.has(p.id) ? `${p.name} unfeatured` : `${p.name} featured`
    );
  };

  const openEditNotes = (p: Partner) => {
    setEditNotesPartner(p);
    setEditNotesValue(p.internalNotes);
  };

  const saveEditNotes = () => {
    if (editNotesPartner) {
      toast.toast("Internal notes updated (not persisted)");
      setEditNotesPartner(null);
    }
  };

  const confirmSuspend = () => {
    if (suspendPartner) {
      setPartnerStatus((prev) => ({ ...prev, [suspendPartner.id]: "Suspended" }));
      toast.toast(`${suspendPartner.name} suspended`);
      setSuspendPartner(null);
    }
  };

  const confirmArchive = () => {
    if (archivePartner) {
      setPartnerStatus((prev) => ({ ...prev, [archivePartner.id]: "Archived" }));
      toast.toast(`${archivePartner.name} archived`);
      setArchivePartner(null);
    }
  };

  return (
    <div className="p-6">
      <Inset side="all" clip="padding-box" className="max-w-6xl mx-auto">
        <Heading size="6" className="mb-6">
          Manage Partners
        </Heading>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <TextField.Root className="w-64">
            <TextField.Input
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </TextField.Root>
          <Select.Root
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <Select.Trigger placeholder="Status" className="w-40" />
            <Select.Content>
              <Select.Item value="All">All</Select.Item>
              <Select.Item value="Active">Active</Select.Item>
              <Select.Item value="Suspended">Suspended</Select.Item>
              <Select.Item value="Featured">Featured</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <Card className="overflow-hidden">
          <Table.Root>
            <Table.Table>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="w-12" />
                  <Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCellButton
                      isSortable
                      sortDirection={sortKey === "name" ? (sortAsc ? "asc" : "desc") : false}
                      onClick={() => toggleSort("name")}
                    >
                      Name
                    </Table.ColumnHeaderCellButton>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCellButton
                      isSortable
                      sortDirection={sortKey === "type" ? (sortAsc ? "asc" : "desc") : false}
                      onClick={() => toggleSort("type")}
                    >
                      Type
                    </Table.ColumnHeaderCellButton>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Categories</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCellButton
                      isSortable
                      sortDirection={sortKey === "rating" ? (sortAsc ? "asc" : "desc") : false}
                      onClick={() => toggleSort("rating")}
                    >
                      Rating
                    </Table.ColumnHeaderCellButton>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCellButton
                      isSortable
                      sortDirection={sortKey === "status" ? (sortAsc ? "asc" : "desc") : false}
                      onClick={() => toggleSort("status")}
                    >
                      Status
                    </Table.ColumnHeaderCellButton>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCellButton
                      isSortable
                      sortDirection={sortKey === "lastUpdated" ? (sortAsc ? "asc" : "desc") : false}
                      onClick={() => toggleSort("lastUpdated")}
                    >
                      Last Updated
                    </Table.ColumnHeaderCellButton>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="w-12" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredAndSorted.map((p) => {
                  const status = getStatus(p);
                  return (
                    <Table.Row key={p.id}>
                      <Table.Cell>
                        <Avatar
                          src={p.logo}
                          alt=""
                          size="1"
                          fallback={p.name.slice(0, 2)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          type="button"
                          onClick={() => setSheetPartner(p)}
                          className="text-left font-medium text-orange-11 hover:underline"
                        >
                          {p.name}
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <PartnerTypeBadge type={p.partnerType} />
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm">
                          {p.categories.slice(0, 2).join(", ")}
                          {p.categories.length > 2 ? "…" : ""}
                        </span>
                      </Table.Cell>
                      <Table.Cell>{p.avgRating.toFixed(1)}</Table.Cell>
                      <Table.Cell>
                        {status === "Featured" && (
                          <Badge color="orange" size="1" className="mr-1">
                            <StarFilledIcon width={12} height={12} className="inline mr-0.5" />
                            Featured
                          </Badge>
                        )}
                        {status === "Active" && (
                          <Badge color="green" size="1">Active</Badge>
                        )}
                        {status === "Suspended" && (
                          <Badge color="amber" size="1">Suspended</Badge>
                        )}
                        {status === "Archived" && (
                          <Badge color="gray" size="1">Archived</Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell>{PARTNER_LAST_UPDATED[p.id] ?? "—"}</Table.Cell>
                      <Table.Cell>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <IconButton variant="ghost" size="1">
                              <DotsHorizontalIcon width={16} height={16} />
                            </IconButton>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content align="end">
                            <DropdownMenu.Item
                              onSelect={() =>
                                window.open(`/partners/${p.slug}`, "_blank")
                              }
                            >
                              View Profile
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => openEditNotes(p)}
                            >
                              Edit Internal Notes
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => toggleFeatured(p)}
                            >
                              Toggle Featured
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                              color="red"
                              onSelect={() => setSuspendPartner(p)}
                            >
                              Suspend Partner
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              color="red"
                              onSelect={() => setArchivePartner(p)}
                            >
                              Archive Partner
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Table>
          </Table.Root>
        </Card>
      </Inset>

      {/* Edit Internal Notes Dialog */}
      <Dialog.Root
        open={!!editNotesPartner}
        onOpenChange={(open) => !open && setEditNotesPartner(null)}
      >
        <Dialog.Content>
          <Dialog.Title>
            Edit Internal Notes — {editNotesPartner?.name}
          </Dialog.Title>
          <Dialog.Description>
            Internal notes are only visible to Whop staff.
          </Dialog.Description>
          <TextArea
            value={editNotesValue}
            onChange={(e) => setEditNotesValue(e.target.value)}
            rows={5}
            className="w-full mt-3"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={saveEditNotes}>Save</Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* Suspend confirmation */}
      <AlertDialog.Root
        open={!!suspendPartner}
        onOpenChange={(open) => !open && setSuspendPartner(null)}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>Suspend partner?</AlertDialog.Title>
          <AlertDialog.Description>
            {suspendPartner?.name} will be hidden from the public directory until
            you reactivate them.
          </AlertDialog.Description>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={confirmSuspend}>
                Suspend
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Archive confirmation */}
      <AlertDialog.Root
        open={!!archivePartner}
        onOpenChange={(open) => !open && setArchivePartner(null)}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>Archive partner?</AlertDialog.Title>
          <AlertDialog.Description>
            {archivePartner?.name} will be moved to archived and removed from the
            live directory.
          </AlertDialog.Description>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={confirmArchive}>
                Archive
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Partner detail Sheet */}
      <Sheet.Root open={!!sheetPartner} onOpenChange={(open) => !open && setSheetPartner(null)}>
        <Sheet.Content className="w-full max-w-lg sm:max-w-lg">
          <Sheet.Header>
            <Sheet.Title>{sheetPartner?.name}</Sheet.Title>
            <Sheet.Description>{sheetPartner?.tagline}</Sheet.Description>
          </Sheet.Header>
          <Sheet.Body className="overflow-auto space-y-4 pt-4">
            {sheetPartner && (
              <>
                <div>
                  <Text size="1" color="gray" className="uppercase tracking-wide">
                    Description
                  </Text>
                  <Text size="2" className="block mt-1">
                    {sheetPartner.description}
                  </Text>
                </div>
                <div>
                  <Text size="1" color="gray" className="uppercase tracking-wide">
                    Internal Notes
                  </Text>
                  <Text size="2" className="block mt-1">
                    {sheetPartner.internalNotes}
                  </Text>
                  <Button
                    size="1"
                    variant="soft"
                    className="mt-2"
                    onClick={() => {
                      openEditNotes(sheetPartner);
                      setSheetPartner(null);
                    }}
                  >
                    Edit Internal Notes
                  </Button>
                </div>
                <div>
                  <Text size="1" color="gray" className="uppercase tracking-wide">
                    Internal Tags
                  </Text>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sheetPartner.internalTags.map((t) => (
                      <Badge key={t} size="1" variant="soft">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Text size="1" color="gray" className="uppercase tracking-wide">
                    Engagement
                  </Text>
                  <Text size="2">
                    Whop contact: {sheetPartner.whopContactPerson} · Last
                    engagement: {sheetPartner.lastEngagementDate}
                  </Text>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/partners/${sheetPartner.slug}`} target="_blank">
                    <Button size="2" variant="soft">
                      View Full Profile
                    </Button>
                  </Link>
                  <Sheet.Close>
                    <Button size="2" variant="soft" color="gray">
                      Close
                    </Button>
                  </Sheet.Close>
                </div>
              </>
            )}
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  );
}
