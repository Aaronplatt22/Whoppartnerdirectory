import Link from "next/link";
import { Heading, Text, Button } from "frosted-ui";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Navbar } from "@/components/ui/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-24 h-24 rounded-full bg-gray-4 flex items-center justify-center mb-6 text-gray-8">
          <MagnifyingGlassIcon width={48} height={48} />
        </div>
        <Heading size="8" weight="bold" className="mb-2">
          This partner doesn&apos;t exist
        </Heading>
        <Text size="3" color="gray" className="mb-8 text-center max-w-md">
          Explore the directory to find the right partner for your Whop.
        </Text>
        <Button size="3" color="orange" asChild className="btn-press">
          <Link href="/partners">Explore Directory</Link>
        </Button>
      </div>
    </div>
  );
}
