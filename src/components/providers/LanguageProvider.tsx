"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Lang, t } from "@/lib/translations";

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  tr: (typeof t)[Lang];
  isRtl: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: "ur",
  toggle: () => {},
  tr: t.ur,
  isRtl: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ur");

  const toggle = () => setLang((p) => (p === "ur" ? "en" : "ur"));
  const tr = t[lang];
  const isRtl = lang === "ur";

  return (
    <LanguageContext.Provider value={{ lang, toggle, tr, isRtl }}>
      <div dir={isRtl ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
