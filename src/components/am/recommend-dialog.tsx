"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Button,
  Text,
  Heading,
} from "frosted-ui";
import type { Partner } from "@/lib/types";

export interface RecommendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
  suggestedIntro?: string;
  onSuccess?: () => void;
}

export function RecommendDialog({
  open,
  onOpenChange,
  partner,
  suggestedIntro = "",
  onSuccess,
}: RecommendDialogProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [note, setNote] = useState(suggestedIntro);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) setNote(suggestedIntro);
  }, [open, suggestedIntro]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSuccess(false);
      setClientName("");
      setClientEmail("");
      setNote(suggestedIntro);
    }
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    onSuccess?.();
    setTimeout(() => handleOpenChange(false), 1500);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content>
        <form onSubmit={handleSubmit}>
          <Dialog.Title size="5" className="mb-2">
            Send Recommendation
          </Dialog.Title>
          <Dialog.Description size="2" color="gray" className="mb-4">
            Share this partner with your client. (V1: no email is sent.)
          </Dialog.Description>

          {success ? (
            <div className="py-6 text-center">
              <Text size="3" weight="medium" color="green">
                Recommendation sent!
              </Text>
            </div>
          ) : (
            <>
              {partner && (
                <div className="rounded-lg bg-gray-3 p-3 mb-4">
                  <Text size="1" color="gray" className="mb-1">
                    Partner
                  </Text>
                  <Text size="2" weight="medium">
                    {partner.name}
                  </Text>
                </div>
              )}

              <div className="flex flex-col gap-3 mb-4">
                <TextField.Root size="2">
                  <TextField.Input
                    placeholder="Client name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </TextField.Root>
                <TextField.Root size="2">
                  <TextField.Input
                    type="email"
                    placeholder="Client email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </TextField.Root>
                <div>
                  <label className="block text-sm font-medium text-gray-11 mb-1">
                    Personal note from AM
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-gray-6 bg-gray-2 px-3 py-2 text-sm text-gray-12 placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-orange-8"
                    placeholder="Add a note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  size="2"
                  variant="soft"
                  color="gray"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="2" color="orange" variant="solid">
                  Send Recommendation
                </Button>
              </div>
            </>
          )}
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
