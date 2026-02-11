import Link from "next/link";
import { Heading, Text, Button, Card } from "frosted-ui";

export default function PartnerDashboardPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Heading size="6" className="mb-2">
        Partner dashboard
      </Heading>
      <Text size="3" color="gray" className="mb-6">
        Manage your directory profile and visibility.
      </Text>
      <Card className="p-6">
        <Heading size="4" className="mb-2">
          Your profile
        </Heading>
        <Text size="2" color="gray" className="mb-4">
          Set up and maintain how you appear in the partner directory.
        </Text>
        <Link href="/partner/profile">
          <Button size="3" color="orange">
            Edit profile
          </Button>
        </Link>
      </Card>
    </div>
  );
}
