"use client";

import { AlertTriangle } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

export default function ConvexMissingBanner() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);

  return (
    <div
      className="card flex items-start gap-3 border p-4"
      style={{ borderColor: "color-mix(in srgb, var(--primary) 35%, var(--border))", background: "var(--surface-2)" }}
      role="status"
    >
      <AlertTriangle className="mt-0.5 h-[18px] w-[18px] shrink-0" style={{ color: "var(--primary)" }} aria-hidden />
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: f }}>
        {tr.convexBanner}
      </p>
    </div>
  );
}
