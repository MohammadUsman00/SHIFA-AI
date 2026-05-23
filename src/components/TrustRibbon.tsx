"use client";

import { Heart, Shield, Stethoscope } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

export default function TrustRibbon() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);

  const items = [
    { icon: Heart, text: tr.trustNote },
    {
      icon: Shield,
      text:
        lang === "ur"
          ? "صرف معلومات — طبی مشورہ نہیں"
          : lang === "hi"
            ? "केवल जानकारी — चिकित्सा सलाह नहीं"
            : "Informational only — not medical advice",
    },
    {
      icon: Stethoscope,
      text:
        lang === "ur"
          ? "ہمیشہ اپنے معالج سے مشورہ کریں"
          : lang === "hi"
            ? "हमेशा अपने डॉक्टर से सलाह लें"
            : "Always consult your physician",
    },
  ];

  return (
    <div className="trust-ribbon" role="contentinfo">
      <div className="shifa-container flex flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:gap-8 sm:py-3">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-center sm:text-left">
            <Icon className="h-4 w-4 shrink-0 text-[var(--gold)]" aria-hidden />
            <span className="text-[13px] font-medium leading-snug" style={{ fontFamily: f, color: "#e8e4dc" }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
