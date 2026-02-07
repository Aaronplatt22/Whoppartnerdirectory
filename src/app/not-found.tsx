import Link from "next/link";
import { Heading, Text } from "frosted-ui";
import { Navbar } from "@/components/ui/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <Heading size="8" className="mb-2">
          404
        </Heading>
        <Text size="3" color="gray" className="mb-6 text-center">
          This page could not be found.
        </Text>
        <Link
          href="/partners"
          className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium bg-orange-9 text-white hover:bg-orange-10 transition-colors"
        >
          Back to Directory
        </Link>
      </div>
    </div>
  );
}
