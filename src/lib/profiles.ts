export interface FamilyProfile {
  id: string;
  name: string;
  color: string;
}

const PROFILES_KEY = "shifa-profiles";
const ACTIVE_KEY = "shifa-active-profile";

const DEFAULT_PROFILES: FamilyProfile[] = [
  { id: "self", name: "Me", color: "#3d6b5e" },
];

export function getProfiles(): FamilyProfile[] {
  if (typeof window === "undefined") return DEFAULT_PROFILES;
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return DEFAULT_PROFILES;
    const parsed = JSON.parse(raw) as FamilyProfile[];
    return parsed.length > 0 ? parsed : DEFAULT_PROFILES;
  } catch {
    return DEFAULT_PROFILES;
  }
}

export function saveProfiles(profiles: FamilyProfile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId(): string {
  if (typeof window === "undefined") return "self";
  return localStorage.getItem(ACTIVE_KEY) || "self";
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function addProfile(name: string): FamilyProfile {
  const profiles = getProfiles();
  const profile: FamilyProfile = {
    id: `p_${Date.now()}`,
    name,
    color: "#b8956a",
  };
  saveProfiles([...profiles, profile]);
  return profile;
}
