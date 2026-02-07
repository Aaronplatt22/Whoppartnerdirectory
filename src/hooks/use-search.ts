"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 300;

export function useSearch(initialQuery = "") {
  const [searchQuery, setSearchQueryState] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      timeoutRef.current = null;
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [searchQuery]);

  const setSearchQuery = useCallback((value: string) => {
    setSearchQueryState(value);
  }, []);

  return { searchQuery, debouncedQuery, setSearchQuery };
}
