"use client";

import { AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";

function getSeverity(text: string): "danger" | "warning" | "safe" {
  if (["سختی سے منع", "فوراً بند", "خطرناک", "حمل میں منع", "الرجی"].some((w) => text.includes(w))) return "danger";
  if (["خبردار", "احتیاط", "پرہیز", "ڈاکٹر", "نقصان"].some((w) => text.includes(w))) return "warning";
  return "safe";
}

export default function WarningBadge({ text }: { text: string }) {
  if (!text) return null;
  const s = getSeverity(text);
  const Icon = s === "danger" ? AlertTriangle : s === "warning" ? AlertCircle : ShieldCheck;
  const color = s === "danger" ? "var(--danger)" : s === "warning" ? "var(--warning)" : "var(--safe)";
  const bg = s === "danger" ? "var(--danger-subtle)" : s === "warning" ? "var(--warning-subtle)" : "var(--safe-subtle)";

  return (
    <div className="flex items-start gap-2.5 p-3.5 rounded-xl" style={{ background: bg, border: `1px solid ${color}20` }}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
      <span className="text-[13px] leading-[1.8]" style={{ color: "var(--text-2)", fontFamily: "var(--font-urdu)" }}>{text}</span>
    </div>
  );
}
