"use client";

import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

export default function LoadingSpinner() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);

  return (
    <div className="card p-10 flex flex-col items-center gap-5 animate-in">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full" style={{ border: "2px solid var(--border)" }} />
        <div className="absolute inset-0 rounded-full" style={{ border: "2px solid transparent", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite" }} />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium" style={{ color: "var(--text-2)", fontFamily: f }}>{tr.analyzing}</p>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>AI is reading your query</p>
      </div>
    </div>
  );
}
