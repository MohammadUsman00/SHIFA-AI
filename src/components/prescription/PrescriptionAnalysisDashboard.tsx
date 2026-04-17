"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  ChevronDown,
  Maximize2,
  ScanLine,
  Search,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import type { PrescriptionAnalysisJson } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLang } from "@/components/providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

interface Props {
  userName: string;
  imageSrc: string;
  analysis: PrescriptionAnalysisJson;
  onScanAnother: () => void;
  onSearchMedicines: () => void;
  activitySlot?: React.ReactNode;
}

function BilingualLine({
  labelEn,
  labelUr,
  valueEn,
  valueUr,
}: {
  labelEn: string;
  labelUr: string;
  valueEn: string | null;
  valueUr: string | null;
}) {
  const hasEn = valueEn != null && valueEn !== "";
  const hasUr = valueUr != null && valueUr !== "";
  if (!hasEn && !hasUr) return null;
  return (
    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
      {hasEn && (
        <div dir="ltr" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/80 p-3 text-left">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">English</p>
          <p className="text-[11px] font-medium text-[var(--text-4)]">{labelEn}</p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--text)]">{valueEn}</p>
        </div>
      )}
      {hasUr && (
        <div dir="rtl" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/80 p-3 text-right font-[family-name:var(--font-urdu-nastaliq)]">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">اردو</p>
          <p className="text-[11px] font-medium text-[var(--text-4)]">{labelUr}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--text)]">{valueUr}</p>
        </div>
      )}
    </div>
  );
}

export default function PrescriptionAnalysisDashboard({
  userName,
  imageSrc,
  analysis,
  onScanAnother,
  onSearchMedicines,
  activitySlot,
}: Props) {
  const { tr, lang } = useLang();
  const uiFont = bodyFontVar(lang);
  const [lightbox, setLightbox] = useState(false);
  const displayName = analysis.patient_name?.trim() || userName;

  const notes =
    analysis.safety_notes?.filter((n) => (n.en && n.en.length > 0) || (n.ur && n.ur.length > 0)) ?? [];

  return (
    <motion.section
      dir="ltr"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--border)_90%,transparent)] bg-[color-mix(in_srgb,var(--surface)_75%,transparent)] p-4 shadow-[0_40px_100px_-48px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] hero-grid" aria-hidden />

      <div className="relative mb-6 flex flex-col gap-2 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-4)]">
              Gemini AI
            </p>
            <h2
              className="text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl"
              style={{ fontFamily: uiFont }}
            >
              {tr.dashboardRxTitle}: {displayName}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-[11px] text-[var(--text-3)]">
            {tr.dashboardBilingualActive}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
        {/* Left — medications */}
        <div className="flex flex-col xl:col-span-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-4)]">
            {lang === "ur" ? "دوائیں" : lang === "hi" ? "दवाएं" : "Medications"}
          </p>
          <div className="custom-scrollbar max-h-[min(70vh,640px)] space-y-3 overflow-y-auto pr-1">
            {analysis.medications.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-[var(--text-4)]">
                  {lang === "ur"
                    ? "کوئی دوا نہیں ملی"
                    : lang === "hi"
                      ? "कोई दवा नहीं मिली"
                      : "No medications extracted"}
                </CardContent>
              </Card>
            ) : (
              analysis.medications.map((med, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)]/90">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[15px] text-[var(--text)]">
                        <span className="bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
                          {med.name.en || med.name.ur || `#${i + 1}`}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <BilingualLine
                        labelEn="Name"
                        labelUr="نام"
                        valueEn={med.name.en}
                        valueUr={med.name.ur}
                      />
                      <BilingualLine
                        labelEn={tr.dashboardLabelDosage}
                        labelUr="خوراک"
                        valueEn={med.dosage.en}
                        valueUr={med.dosage.ur}
                      />
                      <BilingualLine
                        labelEn={tr.dashboardLabelRoute}
                        labelUr="طریقہ"
                        valueEn={med.route.en}
                        valueUr={med.route.ur}
                      />
                      <BilingualLine
                        labelEn={tr.dashboardLabelTiming}
                        labelUr="وقت"
                        valueEn={med.timing.en}
                        valueUr={med.timing.ur}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Center — preview + notes */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[var(--text)]">
                {tr.dashboardPrescriptionPreview}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative aspect-[4/5] max-h-[320px] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] sm:max-h-[380px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="" className="h-full w-full object-contain p-2" />
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-2 text-xs font-medium text-[var(--text)] shadow-lg backdrop-blur-md transition hover:bg-[var(--surface-2)]"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  {tr.dashboardViewFull}
                </button>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/60 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--primary)]">
                    {tr.dashboardAiNotes}
                  </span>
                </div>
                <ul className="space-y-2 text-[13px] leading-relaxed text-[var(--text-2)]">
                  {notes.length === 0 ? (
                    <li className="text-[var(--text-4)]">
                      {lang === "ur"
                        ? "کوئی اضافی نوٹ نہیں"
                        : lang === "hi"
                          ? "कोई अतिरिक्त नोट नहीं"
                          : "No additional notes"}
                    </li>
                  ) : (
                    notes.map((n, i) => (
                      <li key={i} className="flex gap-2 border-l-2 border-[var(--primary)]/40 pl-3">
                        <span className="text-[var(--text)]">
                          {lang === "ur" ? n.ur || n.en : lang === "hi" ? n.en || n.ur : n.en || n.ur}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — actions + info + activity */}
        <div className="flex flex-col gap-4 xl:col-span-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="h-auto min-h-[100px] flex-col gap-2 rounded-2xl border-[var(--border)] bg-[var(--surface-2)] py-4 text-[var(--text)] hover:bg-[var(--surface-3)]"
              onClick={onScanAnother}
            >
              <ScanLine className="h-6 w-6 text-[var(--primary)]" />
              <span className="text-center text-[12px] font-semibold leading-tight">{tr.dashboardScanAnother}</span>
            </Button>
            <Button
              variant="secondary"
              className="h-auto min-h-[100px] flex-col gap-2 rounded-2xl border-[var(--border)] bg-[var(--surface-2)] py-4 text-[var(--text)] hover:bg-[var(--surface-3)]"
              onClick={onSearchMedicines}
            >
              <Search className="h-6 w-6 text-[var(--primary)]" />
              <span className="text-center text-[12px] font-semibold leading-tight">{tr.dashboardSearchMedicines}</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-[var(--primary)]" />
                {tr.dashboardWhatShifaDoes}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[13px] leading-relaxed text-[var(--text-3)]">
              <p
                className={`mb-3 ${lang === "ur" ? "font-[family-name:var(--font-urdu)]" : lang === "hi" ? "font-hindi" : ""}`}
                dir={lang === "ur" ? "rtl" : "ltr"}
              >
                {lang === "ur"
                  ? "شفا AI نسخے کو واضح اور پیشہ ورانہ انداز میں اردو اور انگریزی میں پڑھنے میں مدد کرتا ہے۔"
                  : lang === "hi"
                    ? "Shifa AI नुस्खे को हिंदी, उर्दू और अंग्रेजी में स्पष्ट रूप से पढ़ने में मदद करता है।"
                    : "Shifa AI helps you read prescriptions clearly in Hindi, Urdu, and English."}
              </p>
              <ul className="space-y-1.5 text-[12px] text-[var(--text-4)]">
                <li className="flex items-center gap-2">
                  <ChevronDown className="h-3 w-3 rotate-[-90deg] text-[var(--primary)]" />
                  {lang === "ur" ? "فوری جواب" : lang === "hi" ? "तुरंत जवाब" : "Quick response"}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronDown className="h-3 w-3 rotate-[-90deg] text-[var(--primary)]" />
                  {lang === "ur" ? "واضح متن" : lang === "hi" ? "स्पष्ट टेक्स्ट" : "Clear text"}
                </li>
                <li className="flex items-center gap-2">
                  <ChevronDown className="h-3 w-3 rotate-[-90deg] text-[var(--primary)]" />
                  {lang === "ur" ? "مریض کی شناخت" : lang === "hi" ? "मरीज़ का संदर्भ" : "Patient context"}
                </li>
              </ul>
            </CardContent>
          </Card>

          {activitySlot ? <div className="min-h-0 flex-1">{activitySlot}</div> : null}

          <p
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/50 p-4 text-center text-[11px] leading-relaxed text-[var(--text-4)]"
            style={{ fontFamily: uiFont }}
          >
            {tr.dashboardFooterDisclaimer}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 rounded-full bg-[var(--surface-2)] p-2 text-[var(--text)]"
                onClick={() => setLightbox(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="" className="max-h-[85vh] w-full object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
