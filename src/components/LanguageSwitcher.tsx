"use client";

import { useLang } from "@/components/providers/LanguageProvider";
import { languages } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-switcher" role="group" aria-label="Select language">
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-btn ${lang === l.code ? "active" : ""}`}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          title={l.nativeLabel}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
