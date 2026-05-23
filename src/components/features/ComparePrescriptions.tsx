"use client";

import { GitCompare } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { comparePrescriptions } from "@/lib/compare-rx";
import type { PrescriptionAnalysisJson } from "@/types";
import { bodyFontVar } from "@/lib/lang-ui";

interface Props {
  previous: PrescriptionAnalysisJson | null;
  current: PrescriptionAnalysisJson | null;
}

export default function ComparePrescriptions({ previous, current }: Props) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);
  const diff = comparePrescriptions(previous, current);

  if (!diff || (diff.added.length === 0 && diff.removed.length === 0)) return null;

  return (
    <div className="cause-panel p-5">
      <div className="mb-3 flex items-center gap-2">
        <GitCompare className="h-4 w-4 text-[var(--gold)]" />
        <h3 className="royal-kicker text-[10px]">{fc.compareRx}</h3>
      </div>
      <p className="mb-4 text-xs text-[var(--text-4)]" style={{ fontFamily: f }}>
        {fc.compareHint}
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {diff.added.length > 0 && (
          <div className="rounded-lg p-3" style={{ background: "var(--safe-subtle)" }}>
            <p className="mb-1 text-xs font-semibold text-[var(--safe)]">{fc.added}</p>
            <ul className="text-sm capitalize text-[var(--text-2)]" style={{ fontFamily: f }}>
              {diff.added.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {diff.removed.length > 0 && (
          <div className="rounded-lg p-3" style={{ background: "var(--danger-subtle)" }}>
            <p className="mb-1 text-xs font-semibold text-[var(--danger)]">{fc.removed}</p>
            <ul className="text-sm capitalize text-[var(--text-2)]" style={{ fontFamily: f }}>
              {diff.removed.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {diff.unchanged.length > 0 && (
          <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
            <p className="mb-1 text-xs font-semibold text-[var(--text-3)]">{fc.unchanged}</p>
            <ul className="text-sm capitalize text-[var(--text-2)]" style={{ fontFamily: f }}>
              {diff.unchanged.slice(0, 5).map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
