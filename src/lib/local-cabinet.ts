export interface LocalCabinetItem {
  id: string;
  clientId: string;
  profileId: string;
  medicineName: string;
  nameUrdu?: string;
  dosage?: string;
  timing?: string;
  purpose?: string;
  purchased: boolean;
  savedAt: number;
}

const KEY = "shifa-cabinet-local";

export function getLocalCabinet(profileId: string): LocalCabinetItem[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "[]") as LocalCabinetItem[];
    return all.filter((i) => i.profileId === profileId).sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

export function saveLocalCabinetItem(
  item: Omit<LocalCabinetItem, "id" | "savedAt" | "purchased"> & { purchased?: boolean }
): LocalCabinetItem {
  const all = JSON.parse(localStorage.getItem(KEY) || "[]") as LocalCabinetItem[];
  const existing = all.find(
    (i) => i.profileId === item.profileId && i.medicineName === item.medicineName
  );
  const saved: LocalCabinetItem = {
    id: existing?.id || `local_${Date.now()}`,
    purchased: item.purchased ?? existing?.purchased ?? false,
    savedAt: Date.now(),
    ...item,
  };
  const next = existing
    ? all.map((i) => (i.id === existing.id ? saved : i))
    : [...all, saved];
  localStorage.setItem(KEY, JSON.stringify(next));
  return saved;
}

export function removeLocalCabinetItem(id: string): void {
  const all = JSON.parse(localStorage.getItem(KEY) || "[]") as LocalCabinetItem[];
  localStorage.setItem(KEY, JSON.stringify(all.filter((i) => i.id !== id)));
}

export function toggleLocalPurchased(id: string, purchased: boolean): void {
  const all = JSON.parse(localStorage.getItem(KEY) || "[]") as LocalCabinetItem[];
  localStorage.setItem(
    KEY,
    JSON.stringify(all.map((i) => (i.id === id ? { ...i, purchased } : i)))
  );
}
