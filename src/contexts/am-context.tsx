"use client";

import React, { createContext, useContext } from "react";

interface AMContextValue {
  isAMView: boolean;
}

const AMContext = createContext<AMContextValue>({ isAMView: false });

export function AMProvider({
  children,
  isAMView = true,
}: {
  children: React.ReactNode;
  isAMView?: boolean;
}) {
  return (
    <AMContext.Provider value={{ isAMView }}>{children}</AMContext.Provider>
  );
}

export function useAM() {
  return useContext(AMContext);
}
