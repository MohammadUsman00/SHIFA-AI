"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, Mic, MicOff } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar, chromeFontVar } from "@/lib/lang-ui";

interface Props { onSubmit: (text: string) => void; isLoading: boolean; }

export default function MedicineInput({ onSubmit, isLoading }: Props) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { tr, lang, isRtl } = useLang();
  const f = bodyFontVar(lang);
  const chrome = chromeFontVar(lang);

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
      recognitionRef.current.lang = lang === "ur" ? "ur-PK" : lang === "hi" ? "hi-IN" : "en-US";
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening, lang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) onSubmit(text.trim());
  };

  const suggestions = ["Paracetamol", "Ondem", "Amoxicillin", "Metformin", "Augmentin", "Risek"];

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit}>
        <label className="royal-kicker mb-2 block text-[10px]">{tr.commonMeds}</label>
        <div
          className="flex items-center gap-2 rounded-md border bg-[var(--surface)] p-2 focus-within:ring-2"
          style={{ borderColor: "var(--border)", outlineColor: "var(--ring)" }}
        >
          <Search className="ml-2 h-4 w-4 shrink-0 text-[var(--text-4)]" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={tr.searchPlaceholder}
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[15px] outline-none placeholder:text-[var(--text-4)]"
            style={{ fontFamily: f }}
            dir={isRtl ? "rtl" : "ltr"}
            disabled={isLoading}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
              style={{
                background: listening ? "var(--danger-subtle)" : "var(--surface-2)",
                color: listening ? "var(--danger)" : "var(--text-4)",
              }}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          <button type="submit" disabled={!text.trim() || isLoading} className="btn-primary shrink-0 py-2.5 text-sm">
            <span style={{ fontFamily: chrome }}>{lang === "ur" ? "تلاش" : lang === "hi" ? "खोजें" : "Search"}</span>
            <ArrowRight className="h-3.5 w-3.5" style={{ transform: isRtl ? "scaleX(-1)" : "none" }} />
          </button>
        </div>
      </form>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((med) => (
          <button
            key={med}
            type="button"
            onClick={() => { setText(med); onSubmit(med); }}
            disabled={isLoading}
            className="pill text-xs"
            style={{ fontFamily: chrome }}
          >
            {med}
          </button>
        ))}
      </div>
    </div>
  );
}
