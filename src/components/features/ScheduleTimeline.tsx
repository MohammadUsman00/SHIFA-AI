"use client";

import { Clock } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { buildScheduleFromMeds, SLOT_LABELS, type ScheduleSlot } from "@/lib/schedule";
import type { MedicationStructured } from "@/types";
import { bodyFontVar } from "@/lib/lang-ui";

const SLOT_ORDER: ScheduleSlot[] = ["morning", "afternoon", "evening", "night", "as_needed"];

export default function ScheduleTimeline({ medications }: { medications: MedicationStructured[] }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);

  if (medications.length === 0) return null;

  const scheduled = buildScheduleFromMeds(medications, lang);
  const bySlot = SLOT_ORDER.map((slot) => ({
    slot,
    label: SLOT_LABELS[slot][lang],
    items: scheduled.filter((s) => s.slot === slot),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="cause-panel p-5">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-[var(--gold)]" />
        <h3 className="royal-kicker text-[10px]">{fc.schedule}</h3>
      </div>
      <div className="space-y-4">
        {bySlot.map((group) => (
          <div key={group.slot}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{group.label}</p>
            <ul className="space-y-2 border-l-2 border-[var(--gold)] pl-4">
              {group.items.map((item, i) => (
                <li key={i} className="text-sm" style={{ fontFamily: f, color: "var(--text-2)" }}>
                  <span className="font-medium text-[var(--text)]">{item.name}</span>
                  {item.dosage ? <span className="text-[var(--text-3)]"> — {item.dosage}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
