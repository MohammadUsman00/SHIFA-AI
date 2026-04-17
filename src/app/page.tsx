"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AlertCircle, FileImage, Sparkles } from "lucide-react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider, useLang } from "@/components/providers/LanguageProvider";
import WelcomeScreen from "@/components/WelcomeScreen";
import Navbar from "@/components/Navbar";
import LandingSections from "@/components/LandingSections";
import FaqFooter from "@/components/FaqFooter";
import MedicineInput from "@/components/MedicineInput";
import PhotoUpload from "@/components/PhotoUpload";
import ResultCard from "@/components/ResultCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import RecentQueries from "@/components/RecentQueries";
import RecentQueriesDisabled from "@/components/RecentQueriesDisabled";
import ConvexMissingBanner from "@/components/ConvexMissingBanner";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import PrescriptionAnalysisDashboard from "@/components/prescription/PrescriptionAnalysisDashboard";
import ShifaWorkspace from "@/components/prescription/ShifaWorkspace";
import { MedicineResult, Source, type PrescriptionAnalysisJson } from "@/types";
import { bodyFontVar } from "@/lib/lang-ui";

type Tab = "text" | "photo";

type SaveQueryArgs = {
  medicineName: string;
  inputType: "text" | "image";
  response: string;
  sources?: string[];
};

function App({
  saveQuery,
  renderRecentQueries,
  showConvexBanner,
}: {
  saveQuery: (args: SaveQueryArgs) => Promise<void>;
  renderRecentQueries: (onSelect: (name: string) => void) => ReactNode;
  showConvexBanner?: boolean;
}) {
  const [userName, setUserName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("photo");
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [previewLightbox, setPreviewLightbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [prescriptionSummary, setPrescriptionSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [prescriptionAnalysis, setPrescriptionAnalysis] = useState<PrescriptionAnalysisJson | null>(null);
  const [rxImageUrl, setRxImageUrl] = useState<string | null>(null);
  const [photoUploadKey, setPhotoUploadKey] = useState(0);
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);

  const enrich = useCallback(async (med: MedicineResult, idx: number) => {
    try {
      const r = await fetch("/api/enrich", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ medicineName: med.name || med.nameUrdu }) });
      const d = await r.json();
      if (d.sources?.length) setResults((p) => p.map((m, i) => (i === idx ? { ...m, sources: d.sources as Source[] } : m)));
    } catch { /* optional */ }
  }, []);

  const analyze = useCallback(async (input: { text?: string; image?: string }) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setPrescriptionSummary(null);
    setPrescriptionAnalysis(null);
    if (input.text) {
      setRxImageUrl(null);
      setPreviewDataUrl(null);
    }
    if (input.image) setRxImageUrl(input.image);
    setLastQuery(
      input.text ||
        (lang === "ur" ? "نسخے کی تصویر" : lang === "hi" ? "नुस्खे की तस्वीर" : "Prescription")
    );
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, lang }),
      });
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      setPrescriptionSummary(typeof d.prescriptionSummary === "string" && d.prescriptionSummary.trim() ? d.prescriptionSummary.trim() : null);
      setPrescriptionAnalysis(d.prescriptionAnalysis ?? null);
      if (d.medicines?.length) {
        setResults(d.medicines);
        d.medicines.forEach((m: MedicineResult, i: number) => enrich(m, i));
        try { await saveQuery({ medicineName: input.text || d.medicines[0]?.name || "Rx", inputType: input.image ? "image" : "text", response: d.rawText || "", sources: [] }); } catch { /* */ }
      } else if (d.rawText) {
        setResults([
          {
            name: input.text || "",
            nameUrdu:
              input.text ||
              (lang === "ur" ? "دوا" : lang === "hi" ? "दवा" : "Medicine"),
            purpose: "",
            dosage: "",
            timing: "",
            foodWarnings: "",
            stopInstructions: "",
            warnings: "",
            rawResponse: d.rawText,
          },
        ]);
      } else { setError(tr.noResults); }
    } catch { setError(tr.networkError); }
    finally { setIsLoading(false); }
  }, [enrich, saveQuery, tr, lang]);

  const goScanAnother = useCallback(() => {
    setPrescriptionAnalysis(null);
    setRxImageUrl(null);
    setPreviewDataUrl(null);
    setResults([]);
    setPrescriptionSummary(null);
    setPhotoUploadKey((k) => k + 1);
    setActiveTab("photo");
    document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const goSearchMedicines = useCallback(() => {
    setPrescriptionAnalysis(null);
    setRxImageUrl(null);
    setPreviewDataUrl(null);
    setResults([]);
    setPrescriptionSummary(null);
    setActiveTab("text");
    document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const onRecentSelect = useCallback(
    (n: string) => {
      setActiveTab("text");
      analyze({ text: n });
    },
    [analyze]
  );

  if (!userName) return <WelcomeScreen onEnter={(n) => setUserName(n)} />;

  const showStructuredDashboard =
    Boolean(prescriptionAnalysis && rxImageUrl && !isLoading && !error);

  return (
    <div dir="ltr" className="noise min-h-screen">
      <Navbar userName={userName} onLogout={() => setUserName(null)} showSectionLinks />

      <div className="mx-auto max-w-[1600px] space-y-10 px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pt-8">
        {showConvexBanner && <ConvexMissingBanner />}

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="card p-5 flex items-start gap-3 animate-in" style={{ borderColor: "var(--danger)", borderLeftWidth: "3px" }}>
            <AlertCircle className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: "var(--danger)" }} />
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: f }}>{error}</p>
          </div>
        )}

        {showStructuredDashboard ? (
          <div id="rx-dashboard" className="scroll-mt-24">
            <PrescriptionAnalysisDashboard
              userName={userName}
              imageSrc={rxImageUrl!}
              analysis={prescriptionAnalysis!}
              onScanAnother={goScanAnother}
              onSearchMedicines={goSearchMedicines}
              activitySlot={
                <div id="activity" className="scroll-mt-24">
                  {renderRecentQueries(onRecentSelect)}
                </div>
              }
            />
          </div>
        ) : (
          <ShifaWorkspace
            userName={userName}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            previewDataUrl={previewDataUrl}
            onOpenPreview={previewDataUrl ? () => setPreviewLightbox(true) : undefined}
            onScanAnother={goScanAnother}
            onSearchMedicines={goSearchMedicines}
            leftSlot={
              <>
                {activeTab === "text" ? (
                  <MedicineInput onSubmit={(t) => analyze({ text: t })} isLoading={isLoading} />
                ) : (
                  <PhotoUpload
                    key={photoUploadKey}
                    hidePreview
                    onPreviewChange={setPreviewDataUrl}
                    onUpload={(img) => analyze({ image: img })}
                    isLoading={isLoading}
                  />
                )}
                {results.length > 0 && !prescriptionAnalysis && (
                  <div className="custom-scrollbar max-h-[min(50vh,480px)] space-y-4 overflow-y-auto pr-1 pt-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: "var(--primary)" }} />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>
                        {tr.resultsFor} &ldquo;{lastQuery}&rdquo; — {results.length} {tr.medicines}
                      </p>
                    </div>
                    {prescriptionSummary && (
                      <div
                        className="card animate-in border-2 p-4 sm:p-5"
                        style={{ borderColor: "var(--border)", borderLeftWidth: "4px", borderLeftColor: "var(--primary)", background: "var(--surface-2)" }}
                      >
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--primary)", fontFamily: "var(--font-inter)" }}>
                          {tr.prescriptionSummaryTitle}
                        </p>
                        <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: f }}>
                          {prescriptionSummary}
                        </p>
                        <p className="mt-2 text-[10px]" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>
                          {tr.prescriptionSummaryHint}
                        </p>
                      </div>
                    )}
                    {results.map((m, i) => (
                      <ResultCard key={i} medicine={m} index={i} />
                    ))}
                    <div className="border-t border-[var(--border)] pt-4 text-center">
                      <p className="text-[11px] leading-relaxed text-[var(--text-4)]" style={{ fontFamily: f }}>{tr.disclaimer}</p>
                    </div>
                  </div>
                )}
              </>
            }
            centerSlot={
              <>
                {activeTab === "photo" && previewDataUrl ? (
                  <button
                    type="button"
                    onClick={() => setPreviewLightbox(true)}
                    className="flex w-full flex-1 cursor-zoom-in flex-col items-center justify-center overflow-hidden rounded-xl bg-[var(--surface-2)] p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewDataUrl} alt="" className="max-h-[min(50vh,360px)] w-full object-contain" />
                  </button>
                ) : activeTab === "photo" ? (
                  <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)]/40 p-8 text-center lg:min-h-[280px]">
                    <FileImage className="h-14 w-14 text-[var(--primary)]/50" />
                    <p className="text-[13px] leading-relaxed text-[var(--text-4)]" style={{ fontFamily: f }}>
                      {tr.workspaceCenterHint}
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/30 p-6 text-center lg:min-h-[280px]">
                    <p className="text-[13px] leading-relaxed text-[var(--text-3)]" style={{ fontFamily: f }}>
                      {tr.workspaceTextCenterHint}
                    </p>
                  </div>
                )}
              </>
            }
            rightSlot={
              <div id="activity" className="scroll-mt-24">
                {renderRecentQueries(onRecentSelect)}
              </div>
            }
          />
        )}

        {previewLightbox && previewDataUrl ? (
          <button
            type="button"
            className="fixed inset-0 z-[10050] flex cursor-default items-center justify-center border-0 bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setPreviewLightbox(false)}
            aria-label="Close"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewDataUrl}
              alt=""
              className="max-h-[90vh] max-w-full cursor-zoom-out object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </button>
        ) : null}

        <section id="about-marketing" className="scroll-mt-24 space-y-10 pt-6">
          <LandingSections />
        </section>

        <FaqFooter />
      </div>
    </div>
  );
}

function AppWithConvex() {
  const saveQueryMutation = useMutation(api.mutations.saveQuery);
  const saveQuery = useCallback(
    async (args: SaveQueryArgs) => {
      await saveQueryMutation(args);
    },
    [saveQueryMutation]
  );
  return (
    <App
      saveQuery={saveQuery}
      renderRecentQueries={(onSelect) => <RecentQueries onSelect={onSelect} />}
    />
  );
}

function AppWithoutConvex() {
  const saveQuery = useCallback(async (_args: SaveQueryArgs) => {
    /* Convex not configured */
  }, []);
  return (
    <App
      saveQuery={saveQuery}
      renderRecentQueries={() => <RecentQueriesDisabled />}
      showConvexBanner
    />
  );
}

export default function Home() {
  const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <ThemeProvider>
      <LanguageProvider>
        {hasConvex ? (
          <ConvexClientProvider>
            <AppWithConvex />
          </ConvexClientProvider>
        ) : (
          <AppWithoutConvex />
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}
