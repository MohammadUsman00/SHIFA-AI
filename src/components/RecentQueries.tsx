"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Clock, Pill, Camera } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar, chromeFontVar } from "@/lib/lang-ui";

interface Props { onSelect?: (name: string) => void; }

export default function RecentQueries({ onSelect }: Props) {
  const queries = useQuery(api.queries.getRecentQueries);
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const chrome = chromeFontVar(lang);

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
          <span className="royal-kicker text-[10px]">{tr.recentQueries}</span>
        </div>
        <span className="text-xs text-[var(--text-4)]/80" style={{ fontFamily: chrome }}>
          powered by Convex
        </span>
      </div>

      {/* Body */}
      {queries === undefined ? (
        <div className="space-y-0 px-4 py-6">
          <p className="mb-4 text-center text-[12px] text-[var(--text-4)]" style={{ fontFamily: f }}>
            {tr.recentQueriesLoading}
          </p>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-3 border-b border-[var(--border)]/50 py-3 last:border-0"
            >
              <div className="h-8 w-8 shrink-0 rounded-lg bg-[var(--surface-2)]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 rounded bg-[var(--surface-2)]" style={{ width: `${68 + (i % 3) * 8}%` }} />
                <div className="h-2.5 w-16 rounded bg-[var(--surface-2)]/80" />
              </div>
            </div>
          ))}
        </div>
      ) : queries.length === 0 ? (
        <div className="py-10 text-center px-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "var(--surface-2)" }}>
            <Clock className="w-4 h-4" style={{ color: "var(--text-4)" }} />
          </div>
          <p className="text-[13px]" style={{ color: "var(--text-4)", fontFamily: f }}>{tr.noQueries}</p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
          {queries.map((q) => (
            <button
              key={q._id}
              type="button"
              onClick={() => onSelect?.(q.medicineName)}
              className="group flex w-full cursor-pointer items-center gap-3 border-b border-[var(--border)]/50 px-4 py-3 text-right transition-colors hover:bg-[var(--surface-2)]/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-[var(--surface-2)] transition-all duration-150 group-hover:border-teal-500/20 group-hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]">
                {q.inputType === "image" ? (
                  <Camera className="h-3.5 w-3.5 text-[var(--text-4)] transition-colors group-hover:text-[var(--primary)]" />
                ) : (
                  <Pill className="h-3.5 w-3.5 text-[var(--text-4)] transition-colors group-hover:text-[var(--primary)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-2)]" style={{ fontFamily: "var(--font-urdu)" }}>
                  {q.medicineName}
                </p>
                <p className="text-xs text-[var(--text-4)]" dir="ltr" style={{ fontFamily: chrome }}>
                  {new Date(q.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
