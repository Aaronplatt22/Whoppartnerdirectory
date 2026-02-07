"use client";

import Link from "next/link";
import { Heading, Text, Card, Button, Inset } from "frosted-ui";
import { MOCK_ACTIVITY } from "@/data/mock-admin";

const STATS = [
  { label: "Total Partners", value: 12 },
  { label: "Pending Review", value: 3 },
  { label: "Invites Sent", value: 8 },
  { label: "Flagged Reviews", value: 2 },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <Inset side="all" clip="padding-box" className="max-w-5xl mx-auto">
        <Heading size="6" className="mb-6">
          Dashboard
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value }) => (
            <Card key={label} className="p-5">
              <Heading size="7" className="mb-1">
                {value}
              </Heading>
              <Text size="2" color="gray">
                {label}
              </Text>
            </Card>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <Card className="flex-1 p-5">
            <Heading size="4" className="mb-4">
              Recent Activity
            </Heading>
            <ul className="space-y-3">
              {MOCK_ACTIVITY.map(({ id, text, timeAgo }) => (
                <li key={id} className="flex justify-between items-start gap-4 text-sm">
                  <Text size="2">{text}</Text>
                  <Text size="2" color="gray">
                    {timeAgo}
                  </Text>
                </li>
              ))}
            </ul>
          </Card>

          <div className="w-full md:w-56 shrink-0 space-y-3">
            <Heading size="4" className="mb-4">
              Quick Actions
            </Heading>
            <Link href="/admin/invites">
              <Button className="w-full" size="3">
                Invite a Partner
              </Button>
            </Link>
            <Link href="/admin/submissions">
              <Button className="w-full" variant="soft" size="3">
                Review Submissions
              </Button>
            </Link>
          </div>
        </div>
      </Inset>
    </div>
  );
}
