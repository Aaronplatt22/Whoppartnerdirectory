"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type ToastContextValue = {
  toast: (message: string) => void;
};

const AdminToastContext = createContext<ToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AdminToastContext.Provider value={{ toast }}>
      {children}
      {message && (
        <div
          className="fixed bottom-4 right-4 z-[100] rounded-lg border border-gray-6 bg-gray-2 px-4 py-3 text-sm shadow-lg"
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) throw new Error("useAdminToast must be used within AdminToastProvider");
  return ctx;
}
