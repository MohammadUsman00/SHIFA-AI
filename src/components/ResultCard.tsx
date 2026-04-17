"use client";

import { Pill, Clock, Utensils, OctagonX, AlertTriangle } from "lucide-react";
import { MedicineResult } from "@/types";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar } from "@/lib/lang-ui";
import WarningBadge from "./WarningBadge";
import SourceBadge from "./SourceBadge";

interface Props { medicine: MedicineResult; index: number; }

export default function ResultCard({ medicine, index }: Props) {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const has = medicine.purpose || medicine.dosage || medicine.timing;
  const mainTitle =
    lang === "ur" ? medicine.nameUrdu || medicine.name : medicine.name || medicine.nameUrdu;
  const subTitle = lang === "ur" ? medicine.name : medicine.nameUrdu;

  const fields = [
    { icon: Pill, label: tr.purpose, value: medicine.purpose, color: "var(--primary)" },
    { icon: Pill, label: tr.dosage, value: medicine.dosage, color: "#3b82f6" },
    { icon: Clock, label: tr.timing, value: medicine.timing, color: "#8b5cf6" },
    { icon: Utensils, label: tr.food, value: medicine.foodWarnings, color: "#f59e0b" },
    { icon: OctagonX, label: tr.stop, value: medicine.stopInstructions, color: "#ec4899" },
  ];

  return (
    <div className="card overflow-hidden animate-up gradient-border" style={{ animationDelay: `${index * 80}ms` }}>
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h3 className="text-[18px] font-bold leading-snug" style={{ color: "var(--text)", fontFamily: f }}>
            {mainTitle || tr.medInfo}
          </h3>
          {subTitle && subTitle !== mainTitle && (
            <p
              className="mt-1 text-[13px]"
              dir={lang === "ur" ? "ltr" : "auto"}
              style={{
                color: "var(--text-4)",
                fontFamily: lang === "ur" ? "var(--font-inter)" : "var(--font-urdu)",
              }}
            >
              {subTitle}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary-subtle)" }}>
          <Pill className="w-[18px] h-[18px]" style={{ color: "var(--primary)" }} />
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {has ? (
          <div className="space-y-4">
            {fields.map((item) =>
              item.value ? (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}10` }}>
                    <item.icon className="w-[15px] h-[15px]" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-4)", fontFamily: f }}>{item.label}</p>
                    <p className="text-[14px] leading-[1.7]" style={{ color: "var(--text-2)", fontFamily: f }}>{item.value}</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-[14px] leading-[2] whitespace-pre-line" style={{ color: "var(--text-2)", fontFamily: f }}>
            {medicine.rawResponse}
          </p>
        )}

        {medicine.warnings && (
          <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: "var(--warning)" }} />
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-4)", fontFamily: f }}>{tr.warning}</span>
            </div>
            <WarningBadge text={medicine.warnings} />
          </div>
        )}

        {medicine.sources && medicine.sources.length > 0 && (
          <div className="mt-5 pt-5 flex flex-wrap gap-1.5" style={{ borderTop: "1px solid var(--border)" }}>
            {medicine.sources.map((s, i) => <SourceBadge key={i} source={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
