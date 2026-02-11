import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PartnerSidebar from "./PartnerSidebar";

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "partner") {
    redirect("/login");
  }
  return (
    <div className="flex h-screen bg-gray-950">
      <PartnerSidebar userName={session.user?.name || "Partner"} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
