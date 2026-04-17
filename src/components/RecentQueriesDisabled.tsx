"use client";

import { Clock } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

export default function RecentQueriesDisabled() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--text-4)]/40" />
          <span
            className="text-xs uppercase tracking-widest text-[var(--text-4)] font-mono"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Live Queries
          </span>
        </div>
        <span className="text-xs text-[var(--text-4)]/60" style={{ fontFamily: "var(--font-inter)" }}>
          —
        </span>
      </div>
      <div className="px-5 py-10 text-center">
        <div
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "var(--surface-2)" }}
        >
          <Clock className="h-4 w-4" style={{ color: "var(--text-4)" }} />
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-4)", fontFamily: f }}>
          {tr.convexRecentDisabled}
        </p>
      </div>
    </div>
  );
}
