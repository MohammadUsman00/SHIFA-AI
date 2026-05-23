"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { bodyFontVar } from "@/lib/lang-ui";

interface Props {
  text: string;
  onSimplified: (text: string) => void;
}

export default function SimplifyButton({ text, onSimplified }: Props) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const r = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
      const d = await r.json();
      if (d.simplified) onSimplified(d.simplified);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" className="btn-ghost text-xs" onClick={run} disabled={loading}>
      <Sparkles className="h-3.5 w-3.5" />
      {loading ? fc.simplifyLoading : fc.simpleLanguage}
    </button>
  );
}
