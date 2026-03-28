"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, Mic, MicOff } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";

interface Props { onSubmit: (text: string) => void; isLoading: boolean; }

export default function MedicineInput({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { tr, lang, isRtl } = useLang();
  const f = lang === "ur" ? "var(--font-urdu)" : "var(--font-inter)";

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
      recognitionRef.current.lang = lang === "ur" ? "ur-PK" : "en-US";
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening, lang]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (text.trim() && !isLoading) onSubmit(text.trim()); };
  const suggestions = ["Paracetamol", "Ondem", "Amoxicillin", "Metformin", "Augmentin", "Risek", "Cetirizine", "Aspirin"];

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="group">
        {/* Glow effect */}
        <div className="relative">
          <div
            className="absolute -inset-1 rounded-2xl transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
              filter: "blur(16px)",
              opacity: focused ? 0.15 : 0,
            }}
          />

          {/* Bar */}
          <div
            className="relative flex items-center gap-2 p-2 rounded-2xl transition-all duration-200"
            style={{
              paddingInlineStart: "18px",
              background: "var(--surface)",
              border: `1px solid ${focused ? "var(--primary)" : "var(--border)"}`,
              boxShadow: focused ? "0 0 0 1px var(--ring)" : "var(--shadow-sm)",
            }}
          >
            <Search className="w-[18px] h-[18px] shrink-0 transition-colors duration-150" style={{ color: focused ? "var(--primary)" : "var(--text-4)" }} />

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={tr.searchPlaceholder}
              className="flex-1 bg-transparent outline-none text-[15px] leading-6 min-w-0 py-1.5"
              style={{ fontFamily: f, color: "var(--text)" }}
              dir={isRtl ? "rtl" : "ltr"}
              disabled={isLoading}
            />

            {/* Voice button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-all duration-150 cursor-pointer"
                style={{
                  background: listening ? "rgba(239,68,68,0.12)" : "var(--surface-2)",
                  color: listening ? "#ef4444" : "var(--text-4)",
                }}
                title={listening ? "Stop listening" : "Voice input"}
              >
                {listening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold shrink-0 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: text.trim() ? "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" : "var(--surface-2)",
                color: text.trim() ? "var(--primary-fg)" : "var(--text-4)",
                boxShadow: text.trim() ? "0 2px 12px var(--primary-glow)" : "none",
              }}
            >
              <span style={{ fontFamily: "var(--font-inter)" }}>Search</span>
              <ArrowRight className="w-3.5 h-3.5" style={{ transform: isRtl ? "scaleX(-1)" : "none" }} />
            </button>
          </div>
        </div>
      </form>

      {/* Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((med, i) => (
          <button
            key={med}
            onClick={() => { setText(med); onSubmit(med); }}
            disabled={isLoading}
            className="animate-in px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-150"
            style={{
              animationDelay: `${i * 60}ms`,
              border: "1px solid var(--border)",
              color: "var(--text-3)",
              background: "var(--surface)",
              fontFamily: "var(--font-inter)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.color = "var(--primary)";
              e.currentTarget.style.background = "var(--primary-ghost)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-3)";
              e.currentTarget.style.background = "var(--surface)";
            }}
          >
            {med}
          </button>
        ))}
      </div>
    </div>
  );
}
