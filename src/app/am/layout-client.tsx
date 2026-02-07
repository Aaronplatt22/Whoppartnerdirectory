"use client";

import { AMProvider } from "@/contexts/am-context";
import { Navbar } from "@/components/ui/navbar";

export function AMLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AMProvider isAMView>
      <div className="min-h-screen flex flex-col">
        <div
          className="flex items-center justify-center gap-2 py-2 px-4 text-center text-sm font-medium text-black"
          style={{ background: "var(--amber-9)" }}
          role="status"
        >
          <span aria-hidden>🔒</span>
          AM View — Internal information visible. Do not share screen with clients.
        </div>
        <Navbar isAMActive />
        {children}
      </div>
    </AMProvider>
  );
}
