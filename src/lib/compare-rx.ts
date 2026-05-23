import type { PrescriptionAnalysisJson } from "@/types";

export interface RxDiff {
  added: string[];
  removed: string[];
  unchanged: string[];
}

function medKey(m: { name: { en: string | null; ur: string | null } }): string {
  return (m.name.en || m.name.ur || "").toLowerCase().trim();
}

export function comparePrescriptions(
  older: PrescriptionAnalysisJson | null,
  newer: PrescriptionAnalysisJson | null
): RxDiff | null {
  if (!older || !newer) return null;
  const oldSet = new Set(older.medications.map(medKey).filter(Boolean));
  const newSet = new Set(newer.medications.map(medKey).filter(Boolean));
  const added: string[] = [];
  const removed: string[] = [];
  const unchanged: string[] = [];

  Array.from(newSet).forEach((k) => {
    if (!oldSet.has(k)) added.push(k);
    else unchanged.push(k);
  });
  Array.from(oldSet).forEach((k) => {
    if (!newSet.has(k)) removed.push(k);
  });
  return { added, removed, unchanged };
}
