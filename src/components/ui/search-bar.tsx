"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TextField } from "frosted-ui";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const DEBOUNCE_MS = 300;

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search partners...",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue === value) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(localValue);
      debounceRef.current = null;
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localValue, value, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <TextField.Root
      size="3"
      variant="surface"
      className="w-full"
    >
      <TextField.Slot className="text-gray-11">
        <MagnifyingGlassIcon width={18} height={18} />
      </TextField.Slot>
      <TextField.Input
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="w-full"
      />
    </TextField.Root>
  );
}
