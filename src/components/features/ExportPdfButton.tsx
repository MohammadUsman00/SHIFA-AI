"use client";

import { FileDown } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";
import { printPrescriptionSummary } from "@/lib/pdf-export";
import type { MedicineResult, PrescriptionAnalysisJson } from "@/types";

interface Props {
  title: string;
  patientName?: string;
  summary?: string;
  analysis?: PrescriptionAnalysisJson;
  medicines?: MedicineResult[];
}

export default function ExportPdfButton({ title, patientName, summary, analysis, medicines }: Props) {
  const { tr, lang } = useLang();
  const fc = featureCopy(lang);

  return (
    <button
      type="button"
      className="btn-ghost text-xs"
      onClick={() =>
        printPrescriptionSummary({
          title,
          patientName,
          summary,
          analysis,
          medicines,
          disclaimer: tr.disclaimer,
        })
      }
    >
      <FileDown className="h-3.5 w-3.5" />
      {fc.exportPdf}
    </button>
  );
}
