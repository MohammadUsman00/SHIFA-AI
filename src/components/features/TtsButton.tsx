"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { speakText, stopSpeaking } from "@/lib/tts";
import { useState } from "react";

export default function TtsButton({ text }: { text: string }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const [on, setOn] = useState(false);

  if (!text.trim()) return null;

  return (
    <button
      type="button"
      className="btn-ghost text-xs"
      onClick={() => {
        if (on) {
          stopSpeaking();
          setOn(false);
        } else {
          speakText(text, lang);
          setOn(true);
          setTimeout(() => setOn(false), Math.min(text.length * 60, 60000));
        }
      }}
    >
      {on ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      {on ? fc.stopReading : fc.readAloud}
    </button>
  );
}
