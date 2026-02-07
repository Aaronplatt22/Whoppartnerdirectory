import type { Partner } from "@/lib/types";

export function useSearch(_query: string, _partners: Partner[]): Partner[] {
  return _partners;
}
