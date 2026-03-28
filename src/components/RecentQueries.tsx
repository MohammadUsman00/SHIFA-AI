"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Clock, Pill, Camera } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";

interface Props { onSelect?: (name: string) => void; }

export default function RecentQueries({ onSelect }: Props) {
  const queries = useQuery(api.queries.getRecentQueries);
  const { tr, lang } = useLang();
  const f = lang === "ur" ? "var(--font-urdu)" : "var(--font-inter)";

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>
            Live Queries
          </span>
        </div>
        <span className="text-[10px]" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)", opacity: 0.6 }}>
          powered by Convex
        </span>
      </div>

      {/* Body */}
      {!queries || queries.length === 0 ? (
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
              onClick={() => onSelect?.(q.medicineName)}
              className="w-full flex items-center gap-3 px-5 py-3.5 transition-all duration-150 cursor-pointer text-right group"
              style={{ borderBottom: "1px solid var(--border)", background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
                style={{ background: "var(--surface-2)", border: "1px solid transparent" }}
                ref={(el) => {
                  if (!el) return;
                  const parent = el.closest("button");
                  if (!parent) return;
                  parent.addEventListener("mouseenter", () => { el.style.background = "var(--primary-ghost)"; el.style.borderColor = "var(--primary)"; });
                  parent.addEventListener("mouseleave", () => { el.style.background = "var(--surface-2)"; el.style.borderColor = "transparent"; });
                }}
              >
                {q.inputType === "image" ? (
                  <Camera className="w-3.5 h-3.5 transition-colors duration-150" style={{ color: "var(--text-4)" }} />
                ) : (
                  <Pill className="w-3.5 h-3.5 transition-colors duration-150" style={{ color: "var(--text-4)" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-2)", fontFamily: "var(--font-urdu)" }}>{q.medicineName}</p>
                <p className="text-[11px]" dir="ltr" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>
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
