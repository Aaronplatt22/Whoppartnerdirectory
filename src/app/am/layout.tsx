import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AMSidebar from "./AMSidebar";

export default async function AMLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "account_manager") {
    redirect("/login");
  }
  return (
    <div className="flex h-screen bg-gray-950">
      <AMSidebar userName={session.user?.name || "CAM"} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
