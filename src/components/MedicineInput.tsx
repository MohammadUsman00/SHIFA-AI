"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, Mic, MicOff } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

interface Props { onSubmit: (text: string) => void; isLoading: boolean; }

export default function MedicineInput({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { tr, lang, isRtl } = useLang();
  const f = bodyFontVar(lang);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0]?.[0]?.transcript;
        if (transcript) setText(transcript);
      };
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.lang =
        lang === "ur" ? "ur-PK" : lang === "hi" ? "hi-IN" : "en-US";
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening, lang]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (text.trim() && !isLoading) onSubmit(text.trim()); };
  const suggestions = ["Paracetamol", "Ondem", "Amoxicillin", "Metformin", "Augmentin", "Risek", "Cetirizine", "Aspirin"];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <form onSubmit={handleSubmit} className="group animate-up delay-2">
        <div className="relative w-full">
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 opacity-0 blur-lg transition-opacity duration-500 group-focus-within:opacity-100 dark:from-teal-400/15 dark:to-cyan-400/15" />

          <div className="relative flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 pl-4 transition-all duration-200 focus-within:border-teal-500/50 focus-within:shadow-[0_0_0_1px_rgba(45,212,191,0.2)] dark:border-zinc-800 dark:bg-zinc-900/90">
            <Search
              className="h-[18px] w-[18px] shrink-0 text-zinc-500 transition-colors dark:text-zinc-500"
              style={{ color: focused ? "var(--primary)" : undefined }}
            />

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={tr.searchPlaceholder}
              className="min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-[var(--text)] outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-500"
              style={{ fontFamily: f }}
              dir={isRtl ? "rtl" : "ltr"}
              disabled={isLoading}
            />

            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-all duration-150"
                style={{
                  background: listening ? "rgba(239,68,68,0.12)" : "var(--surface-2)",
                  color: listening ? "#ef4444" : "var(--text-4)",
                }}
                title={listening ? "Stop listening" : "Voice input"}
              >
                {listening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
              </button>
            )}

            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold transition-all duration-150 hover:bg-teal-400 hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
              style={{ color: "var(--primary-fg)" }}
            >
              <span style={{ fontFamily: "var(--font-inter)" }}>Search</span>
              <ArrowRight className="h-3.5 w-3.5" style={{ transform: isRtl ? "scaleX(-1)" : "none" }} />
            </button>
          </div>
        </div>
      </form>

      {/* Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((med, i) => (
          <button
            key={med}
            type="button"
            onClick={() => {
              setText(med);
              onSubmit(med);
            }}
            disabled={isLoading}
            className="animate-in rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600 transition-all duration-150 hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-600 disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:text-teal-400"
            style={{ animationDelay: `${i * 60}ms`, fontFamily: "var(--font-inter)" }}
          >
            {med}
          </button>
        ))}
      </div>
    </div>
  );
}
