"use client";

import type { MedicineResult, PrescriptionAnalysisJson } from "@/types";
import ScheduleTimeline from "./ScheduleTimeline";
import InteractionWarnings from "./InteractionWarnings";
import RxFollowUpChat from "./RxFollowUpChat";
import ExportPdfButton from "./ExportPdfButton";
import ShareLinkButton from "./ShareLinkButton";
import TtsButton from "./TtsButton";
import SimplifyButton from "./SimplifyButton";
import ComparePrescriptions from "./ComparePrescriptions";
import { useState } from "react";
import { useLang } from "@/components/providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";

interface Props {
  analysis: PrescriptionAnalysisJson;
  previousAnalysis: PrescriptionAnalysisJson | null;
  patientName: string;
  summary?: string;
  hasConvex: boolean;
}

export default function AnalysisTools({
  analysis,
  previousAnalysis,
  patientName,
  summary,
  hasConvex,
}: Props) {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const [simplifiedSummary, setSimplifiedSummary] = useState<string | null>(null);

  const contextSummary = [
    `Patient: ${patientName}`,
    summary || "",
    ...analysis.medications.map(
      (m) =>
        `${m.name.en || m.name.ur}: ${m.dosage.en || m.dosage.ur}, ${m.timing.en || m.timing.ur}`
    ),
  ].join("\n");

  const speakText = [
    simplifiedSummary || summary || "",
    ...analysis.medications.map((m) => `${m.name.en || m.name.ur}, ${m.dosage.en || m.dosage.ur}`),
  ].join(". ");

  const displaySummary = simplifiedSummary || summary;

  return (
    <div className="space-y-4 border-t border-[var(--border)] pt-6">
      <div className="flex flex-wrap gap-2">
        <ExportPdfButton
          title={tr.dashboardRxTitle}
          patientName={patientName}
          summary={displaySummary}
          analysis={analysis}
        />
        <ShareLinkButton hasConvex={hasConvex} payload={{ analysis, patientName, summary: displaySummary }} />
        <TtsButton text={speakText} />
        {summary && (
          <SimplifyButton text={summary} onSimplified={(t) => setSimplifiedSummary(t)} />
        )}
      </div>

      {displaySummary && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <p className="text-sm leading-relaxed text-[var(--text-2)]" style={{ fontFamily: f }}>
            {displaySummary}
          </p>
        </div>
      )}

      <ComparePrescriptions previous={previousAnalysis} current={analysis} />
      <ScheduleTimeline medications={analysis.medications} />
      <InteractionWarnings medications={analysis.medications} />
      <RxFollowUpChat contextSummary={contextSummary} />
    </div>
  );
}
