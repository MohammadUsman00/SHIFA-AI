"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { Source } from "@/types";
import { useLang } from "./providers/LanguageProvider";

export default function SourceBadge({ source }: { source: Source }) {
  const { tr } = useLang();
  const domain = (() => { try { return new URL(source.url).hostname.replace("www.", ""); } catch { return source.url; } })();

  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="badge-safe hover:opacity-80 transition-opacity cursor-pointer" title={source.snippet || source.title} style={{ fontFamily: "var(--font-inter)", fontSize: "11px" }}>
      <ShieldCheck className="w-3 h-3" />
      {tr.verified}
      <span style={{ opacity: 0.3 }}>|</span>
      <span className="truncate max-w-[90px]" dir="ltr">{domain}</span>
      <ExternalLink className="w-3 h-3" style={{ opacity: 0.4 }} />
    </a>
  );
}
