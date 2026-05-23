"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Upload, X, FileImage, ArrowRight } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";
import CameraCoach from "./features/CameraCoach";

interface Props {
  onUpload: (base64: string) => void;
  isLoading: boolean;
  /** When true, image preview is not shown here (parent shows it in a bento center column). */
  hidePreview?: boolean;
  onPreviewChange?: (dataUrl: string | null) => void;
}

export default function PhotoUpload({ onUpload, isLoading, hidePreview = false, onPreviewChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const { tr, lang, isRtl } = useLang();
  const f = bodyFontVar(lang);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target?.result as string);
    r.readAsDataURL(file);
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
    if (ref.current) ref.current.value = "";
    onPreviewChange?.(null);
  }, [onPreviewChange]);

  useEffect(() => {
    onPreviewChange?.(preview);
  }, [preview, onPreviewChange]);

  if (preview && hidePreview) {
    return (
      <div className="space-y-4">
        <CameraCoach previewUrl={preview} />
        <div className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-2)", fontFamily: f }}>
            <FileImage className="h-4 w-4 shrink-0 text-[var(--primary)]" />
            <span>{tr.imageReady}</span>
          </div>
          <button
            type="button"
            onClick={clearPreview}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition-colors hover:bg-[var(--surface-3)]"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" style={{ color: "var(--text-3)" }} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            if (preview && !isLoading) onUpload(preview);
          }}
          disabled={isLoading}
          className="btn-primary w-full text-[13px] py-3 cursor-pointer"
          style={{ fontFamily: f, background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" }}
        >
          {isLoading ? tr.analyzing : tr.analyzeBtn}
          <ArrowRight className="w-3.5 h-3.5" style={{ transform: isRtl ? "scaleX(-1)" : "none" }} />
        </button>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="card overflow-hidden animate-in gradient-border">
        <div className="relative" style={{ background: "var(--surface-2)" }}>
          <div className="aspect-[16/10] max-h-[340px] flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Prescription" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>
          <button onClick={clearPreview} className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-colors" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <X className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} />
          </button>
        </div>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-4)" }}>
            <FileImage className="w-4 h-4" />
            <span style={{ fontFamily: f }}>{tr.imageReady}</span>
          </div>
          <button type="button" onClick={() => { if (preview && !isLoading) onUpload(preview); }} disabled={isLoading} className="btn-primary text-[13px] py-2 px-4 cursor-pointer" style={{ fontFamily: f, background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" }}>
            {isLoading ? tr.analyzing : tr.analyzeBtn}
            <ArrowRight className="w-3.5 h-3.5" style={{ transform: isRtl ? "scaleX(-1)" : "none" }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card p-10 text-center cursor-pointer transition-all duration-200"
      style={{ borderStyle: "dashed", borderWidth: "1.5px", borderColor: dragActive ? "var(--primary)" : "var(--border)", background: dragActive ? "var(--primary-ghost)" : "var(--surface)" }}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); const file = e.dataTransfer.files[0]; if (file) processFile(file); }}
      onClick={() => ref.current?.click()}
    >
      <input ref={ref} type="file" accept="image/*" capture="environment" onChange={(e) => { const file = e.target.files?.[0]; if (file) processFile(file); }} className="hidden" />
      <div className="flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--primary-subtle)" }}>
          <Camera className="w-6 h-6" style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <p className="text-[15px] font-semibold" style={{ color: "var(--text)", fontFamily: f }}>{tr.uploadTitle}</p>
          <p className="text-[13px] mt-1.5" style={{ color: "var(--text-4)", fontFamily: f }}>{tr.uploadDesc}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost text-[13px] cursor-pointer" onClick={(e) => { e.stopPropagation(); ref.current?.click(); }}>
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
          <button type="button" className="btn-primary text-[13px] py-2 cursor-pointer" style={{ background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" }} onClick={(e) => { e.stopPropagation(); ref.current?.click(); }}>
            <Camera className="w-3.5 h-3.5" /> Camera
          </button>
        </div>
      </div>
    </div>
  );
}
