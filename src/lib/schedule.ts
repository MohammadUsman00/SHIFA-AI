import type { MedicationStructured } from "@/types";

export type ScheduleSlot = "morning" | "afternoon" | "evening" | "night" | "as_needed";

export interface ScheduledMed {
  name: string;
  dosage: string;
  slot: ScheduleSlot;
}

const SLOT_PATTERNS: { slot: ScheduleSlot; re: RegExp }[] = [
  { slot: "morning", re: /morning|subah|صبح|सुबह|am\b|breakfast|ناشتہ|नाश्ते/i },
  { slot: "afternoon", re: /afternoon|dopahar|دوپہر|दोपहर|lunch|دوپہر|दोपहर/i },
  { slot: "evening", re: /evening|shaam|شام|शाम|pm\b|dinner|رات کا کھانا/i },
  { slot: "night", re: /night|bed|sleep|سونے|रात|bedtime|قبل خواب/i },
  { slot: "as_needed", re: /sos|as needed|ضرورت|जरूरत|prn|when needed/i },
];

function inferSlot(text: string): ScheduleSlot {
  const t = text.toLowerCase();
  for (const { slot, re } of SLOT_PATTERNS) {
    if (re.test(t)) return slot;
  }
  if (/once|daily|روز|दिन|ہر|हर/i.test(t)) return "morning";
  return "as_needed";
}

export function buildScheduleFromMeds(
  meds: MedicationStructured[],
  lang: "ur" | "en" | "hi"
): ScheduledMed[] {
  return meds.map((m) => {
    const timing =
      lang === "ur"
        ? m.timing.ur || m.timing.en || ""
        : lang === "hi"
          ? m.timing.en || m.timing.ur || ""
          : m.timing.en || m.timing.ur || "";
    const dosage =
      lang === "ur"
        ? m.dosage.ur || m.dosage.en || ""
        : m.dosage.en || m.dosage.ur || "";
    const name = m.name.en || m.name.ur || "Medicine";
    return {
      name,
      dosage,
      slot: inferSlot(timing),
    };
  });
}

export const SLOT_LABELS: Record<ScheduleSlot, Record<"ur" | "en" | "hi", string>> = {
  morning: { en: "Morning", ur: "صبح", hi: "सुबह" },
  afternoon: { en: "Afternoon", ur: "دوپہر", hi: "दोपहर" },
  evening: { en: "Evening", ur: "شام", hi: "शाम" },
  night: { en: "Night", ur: "رات", hi: "रात" },
  as_needed: { en: "As needed", ur: "ضرورت پر", hi: "जरूरत पर" },
};
