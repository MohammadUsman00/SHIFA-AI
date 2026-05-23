"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { assessImageQuality, type ImageQuality } from "@/lib/image-quality";
import { bodyFontVar } from "@/lib/lang-ui";

export default function CameraCoach({ previewUrl }: { previewUrl: string | null }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const f = bodyFontVar(lang);
  const [quality, setQuality] = useState<ImageQuality | null>(null);

  useEffect(() => {
    if (!previewUrl) {
      setQuality(null);
      return;
    }
    let cancelled = false;
    assessImageQuality(previewUrl).then((q) => {
      if (!cancelled) setQuality(q);
    });
    return () => {
      cancelled = true;
    };
  }, [previewUrl]);

  if (!previewUrl || !quality || quality === "good") return null;

  const msg = quality === "blur" ? fc.cameraBlurry : fc.cameraDark;

  return (
    <div
      className="flex items-start gap-2 rounded-lg border px-3 py-2 text-xs"
      style={{ borderColor: "var(--warning)", background: "var(--warning-subtle)", fontFamily: f }}
    >
      <Camera className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--warning)" }} />
      <span style={{ color: "var(--text-2)" }}>{msg}</span>
    </div>
  );
}
