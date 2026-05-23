"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { bodyFontVar } from "@/lib/lang-ui";

interface Props {
  contextSummary: string;
}

export default function RxFollowUpChat({ contextSummary }: Props) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, contextSummary, lang }),
      });
      const d = await r.json();
      setMessages((m) => [...m, { role: "ai", text: d.reply || d.error || "—" }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cause-panel overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        style={{ background: "var(--surface-2)" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <MessageCircle className="h-4 w-4 text-[var(--primary)]" />
          {fc.askShifa}
        </span>
        <span className="text-[var(--text-4)]">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="border-t border-[var(--border)] p-4">
          <div className="custom-scrollbar mb-3 max-h-48 space-y-2 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-xs text-[var(--text-4)]" style={{ fontFamily: f }}>
                {fc.askPlaceholder}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "ml-6" : "mr-6"}`}
                style={{
                  fontFamily: f,
                  background: m.role === "user" ? "var(--primary-subtle)" : "var(--surface-2)",
                  color: "var(--text-2)",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={fc.askPlaceholder}
              className="input-field flex-1 text-sm"
              style={{ fontFamily: f }}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button type="button" className="btn-primary shrink-0 px-3" onClick={send} disabled={loading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">{fc.send}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
