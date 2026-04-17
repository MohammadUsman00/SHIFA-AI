"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Lang, t } from "@/lib/translations";
import { dir } from "@/lib/i18n";

const LANG_STORAGE = "shifa-lang";

function normalizeLang(raw: unknown): Lang {
  if (raw === "en" || raw === "ur" || raw === "hi") return raw;
  return "ur";
}

interface LangCtx {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  tr: (typeof t)[Lang];
  isRtl: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: "ur",
  setLang: () => {},
  toggle: () => {},
  tr: t.ur,
  isRtl: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ur");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(normalizeLang(localStorage.getItem(LANG_STORAGE)));
    setMounted(true);
  }, []);

  const setLang = (l: Lang) => setLangState(l);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LANG_STORAGE, lang);
    document.documentElement.dir = dir(lang);
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang;
  }, [lang, mounted]);

  const toggle = () =>
    setLangState((p) => (p === "ur" ? "en" : p === "en" ? "hi" : "ur"));

  const tr = t[lang];
  const isRtl = lang === "ur";

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, tr, isRtl }}>
      <div dir={isRtl ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
export const useLanguage = useLang;
