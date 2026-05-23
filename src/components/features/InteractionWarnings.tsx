"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import type { MedicationStructured } from "@/types";
import { bodyFontVar } from "@/lib/lang-ui";

export default function InteractionWarnings({ medications }: { medications: MedicationStructured[] }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);
  const [hints, setHints] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medications.length < 2) {
      setHints(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const r = await fetch("/api/interactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medications, lang }),
        });
        const d = await r.json();
        if (!cancelled && d.hints) setHints(d.hints);
      } catch {
        /* optional */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [medications, lang]);

  if (medications.length < 2) return null;

  return (
    <div
      className="rounded-lg border p-4"
      style={{ borderColor: "var(--warning)", background: "var(--warning-subtle)" }}
    >
      <div className="mb-2 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" style={{ color: "var(--warning)" }} />
        <p className="royal-kicker text-[10px]" style={{ color: "var(--warning)" }}>
          {fc.interactions}
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-[var(--text-3)]" style={{ fontFamily: f }}>
          {fc.interactionsLoading}
        </p>
      ) : hints ? (
        <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-2)]" style={{ fontFamily: f }}>
          {hints}
        </p>
      ) : null}
    </div>
  );
}
