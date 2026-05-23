"use client";

import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

export default function LoadingSpinner() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);

  return (
    <div className="cause-panel flex flex-col items-center gap-5 p-12 animate-in" role="status">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "var(--border)" }} />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "var(--gold)", animation: "spin 0.8s linear infinite" }}
        />
      </div>
      <div className="text-center">
        <p className="royal-title text-lg" style={{ fontFamily: f, color: "var(--text)" }}>{tr.analyzing}</p>
        <p className="mt-1 text-sm text-[var(--text-4)]" style={{ fontFamily: f }}>
          {lang === "ur" ? "براہ کرم انتظار کریں" : lang === "hi" ? "कृपया प्रतीक्षा करें" : "Please wait a moment"}
        </p>
      </div>
    </div>
  );
}
