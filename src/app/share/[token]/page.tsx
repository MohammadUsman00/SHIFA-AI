"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { bodyFontVar } from "@/lib/lang-ui";
import { LanguageProvider, useLang } from "@/components/providers/LanguageProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { PrescriptionAnalysisJson } from "@/types";

function ShareContent() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";
  const { lang, tr } = useLang();
  const f = bodyFontVar(lang);
  const row = useQuery(api.queries.getShareByToken, token ? { token } : "skip");

  if (row === undefined) {
    return <p className="p-12 text-center text-[var(--text-3)]">Loading…</p>;
  }
  if (!row) {
    return (
      <p className="p-12 text-center text-[var(--text-3)]" style={{ fontFamily: f }}>
        Link expired or not found.
      </p>
    );
  }

  let data: { analysis?: PrescriptionAnalysisJson; patientName?: string; summary?: string } = {};
  try {
    data = JSON.parse(row.payload);
  } catch {
    /* */
  }

  return (
    <div className="shifa-container py-12">
      <p className="royal-kicker mb-2">Shifa AI</p>
      <h1 className="royal-title mb-4 text-2xl" style={{ fontFamily: f }}>
        {tr.dashboardRxTitle}
        {data.patientName ? `: ${data.patientName}` : ""}
      </h1>
      {data.summary && (
        <p className="mb-6 text-[var(--text-2)]" style={{ fontFamily: f }}>
          {data.summary}
        </p>
      )}
      {data.analysis?.medications.map((m, i) => (
        <div key={i} className="cause-panel mb-3 p-4">
          <p className="font-semibold text-[var(--text)]" style={{ fontFamily: f }}>
            {m.name.en || m.name.ur}
          </p>
          <p className="text-sm text-[var(--text-3)]" style={{ fontFamily: f }}>
            {[m.dosage.en || m.dosage.ur, m.timing.en || m.timing.ur].filter(Boolean).join(" · ")}
          </p>
        </div>
      ))}
      <p className="mt-8 text-xs text-[var(--text-4)]" style={{ fontFamily: f }}>
        {tr.disclaimer}
      </p>
    </div>
  );
}

export default function SharePage() {
  const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
  if (!hasConvex) {
    return (
      <div className="shifa-page min-h-screen p-12 text-center text-[var(--text-3)]">
        Sharing is not configured.
      </div>
    );
  }
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ConvexClientProvider>
          <div className="shifa-page min-h-screen">
            <ShareContent />
          </div>
        </ConvexClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
