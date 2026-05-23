"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AlertCircle, FileImage } from "lucide-react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider, useLang } from "@/components/providers/LanguageProvider";
import WelcomeScreen from "@/components/WelcomeScreen";
import Navbar from "@/components/Navbar";
import TrustRibbon from "@/components/TrustRibbon";
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
import MedicineCabinet from "@/components/features/MedicineCabinet";
import RxFollowUpChat from "@/components/features/RxFollowUpChat";
import ExportPdfButton from "@/components/features/ExportPdfButton";
import TtsButton from "@/components/features/TtsButton";
import SimplifyButton from "@/components/features/SimplifyButton";
import CameraCoach from "@/components/features/CameraCoach";

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
  hasConvex,
}: {
  saveQuery: (args: SaveQueryArgs) => Promise<void>;
  renderRecentQueries: (onSelect: (name: string) => void) => ReactNode;
  showConvexBanner?: boolean;
  hasConvex: boolean;
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
  const [previousAnalysis, setPreviousAnalysis] = useState<PrescriptionAnalysisJson | null>(null);
  const [simplifiedSummary, setSimplifiedSummary] = useState<string | null>(null);
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
      if (d.prescriptionAnalysis) {
        setPreviousAnalysis(prescriptionAnalysis);
        setPrescriptionAnalysis(d.prescriptionAnalysis);
      } else {
        setPrescriptionAnalysis(null);
      }
      setSimplifiedSummary(null);
      if (d.medicines?.length) {
        setResults(d.medicines);
        d.medicines.forEach((m: MedicineResult, i: number) => enrich(m, i));
        try { await saveQuery({ medicineName: input.text || d.medicines[0]?.name || "Rx", inputType: input.image ? "image" : "text", response: d.rawText || "", sources: [] }); } catch { /* */ }
      } else if (d.rawText) {
        setResults([
          {
            name: input.text || "",
            nameUrdu: input.text || (lang === "ur" ? "دوا" : lang === "hi" ? "दवा" : "Medicine"),
            purpose: "", dosage: "", timing: "", foodWarnings: "", stopInstructions: "", warnings: "",
            rawResponse: d.rawText,
          },
        ]);
      } else { setError(tr.noResults); }
    } catch { setError(tr.networkError); }
    finally { setIsLoading(false); }
  }, [enrich, saveQuery, tr, lang, prescriptionAnalysis]);

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

  const onRecentSelect = useCallback((n: string) => {
    setActiveTab("text");
    analyze({ text: n });
  }, [analyze]);

  if (!userName) return <WelcomeScreen onEnter={(n) => setUserName(n)} hasConvex={hasConvex} />;

  const showStructuredDashboard = Boolean(prescriptionAnalysis && rxImageUrl && !isLoading && !error);

  return (
    <div className="shifa-page">
      <Navbar userName={userName} onLogout={() => setUserName(null)} showSectionLinks />
      <TrustRibbon />

      {/* Page hero — cause framing */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="shifa-container py-12 sm:py-16">
          <p className="royal-kicker mb-3">{tr.welcomeKicker}</p>
          <hr className="gold-rule mb-6 max-w-xs" />
          <h1 className="royal-title mb-4 max-w-3xl text-3xl sm:text-4xl lg:text-5xl" style={{ fontFamily: f }}>
            {tr.heroTitle}
          </h1>
          <p className="royal-lead max-w-2xl" style={{ fontFamily: f }}>
            {tr.heroDesc}
          </p>
        </div>
      </section>

      <main className="shifa-container space-y-12 py-10 sm:py-14">
        {showConvexBanner && <ConvexMissingBanner />}
        {isLoading && <LoadingSpinner />}

        {error && (
          <div
            className="card flex items-start gap-3 border-l-4 p-5 animate-in"
            style={{ borderLeftColor: "var(--danger)" }}
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--danger)" }} />
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: f }}>{error}</p>
          </div>
        )}

        {showStructuredDashboard ? (
          <div id="rx-dashboard" className="scroll-mt-24">
            <PrescriptionAnalysisDashboard
              userName={userName}
              imageSrc={rxImageUrl!}
              analysis={prescriptionAnalysis!}
              previousAnalysis={previousAnalysis}
              prescriptionSummary={prescriptionSummary}
              hasConvex={hasConvex}
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
                  <div className="custom-scrollbar max-h-[min(50vh,480px)] space-y-4 overflow-y-auto border-t border-[var(--border)] pt-4">
                    <p className="royal-kicker text-[10px]">
                      {tr.resultsFor} &ldquo;{lastQuery}&rdquo; — {results.length} {tr.medicines}
                    </p>
                    {(simplifiedSummary || prescriptionSummary) && (
                      <div className="card border-l-4 p-4" style={{ borderLeftColor: "var(--gold)", background: "var(--surface-2)" }}>
                        <div className="mb-2 flex flex-wrap gap-2">
                          <p className="royal-kicker text-[10px]">{tr.prescriptionSummaryTitle}</p>
                          {prescriptionSummary && (
                            <SimplifyButton
                              text={prescriptionSummary}
                              onSimplified={(t) => setSimplifiedSummary(t)}
                            />
                          )}
                          <TtsButton text={simplifiedSummary || prescriptionSummary || ""} />
                          <ExportPdfButton
                            title={tr.prescriptionSummaryTitle}
                            summary={simplifiedSummary || prescriptionSummary || undefined}
                            medicines={results}
                          />
                        </div>
                        <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: f }}>
                          {simplifiedSummary || prescriptionSummary}
                        </p>
                        <p className="mt-2 text-[11px] text-[var(--text-4)]" style={{ fontFamily: f }}>{tr.prescriptionSummaryHint}</p>
                      </div>
                    )}
                    {results.length >= 2 && (
                      <RxFollowUpChat
                        contextSummary={[
                          prescriptionSummary || "",
                          ...results.map((m) => `${m.name || m.nameUrdu}: ${m.dosage} ${m.timing}`),
                        ].join("\n")}
                      />
                    )}
                    {results.map((m, i) => (
                      <ResultCard key={i} medicine={m} index={i} hasConvex={hasConvex} />
                    ))}
                  </div>
                )}
              </>
            }
            centerSlot={
              <>
                {activeTab === "photo" && previewDataUrl ? (
                  <div className="flex w-full flex-1 flex-col gap-3">
                    <CameraCoach previewUrl={previewDataUrl} />
                    <button
                      type="button"
                      onClick={() => setPreviewLightbox(true)}
                      className="flex flex-1 cursor-zoom-in flex-col items-center justify-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewDataUrl} alt="" className="max-h-[min(50vh,360px)] w-full object-contain" />
                    </button>
                  </div>
                ) : activeTab === "photo" ? (
                  <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[var(--border)] p-8 text-center lg:min-h-[280px]">
                    <FileImage className="h-12 w-12 text-[var(--gold)]" />
                    <p className="text-[14px] leading-relaxed text-[var(--text-3)]" style={{ fontFamily: f }}>{tr.workspaceCenterHint}</p>
                  </div>
                ) : (
                  <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/50 p-6 text-center lg:min-h-[280px]">
                    <p className="text-[14px] leading-relaxed text-[var(--text-3)]" style={{ fontFamily: f }}>{tr.workspaceTextCenterHint}</p>
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
            className="fixed inset-0 z-[10050] flex cursor-default items-center justify-center border-0 bg-[var(--navy)]/90 p-4 backdrop-blur-sm"
            onClick={() => setPreviewLightbox(false)}
            aria-label="Close"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewDataUrl} alt="" className="max-h-[90vh] max-w-full cursor-zoom-out object-contain" onClick={(e) => e.stopPropagation()} />
          </button>
        ) : null}

        <MedicineCabinet hasConvex={hasConvex} />

        <LandingSections />
        <FaqFooter />
      </main>
    </div>
  );
}

function AppWithConvex() {
  const saveQueryMutation = useMutation(api.mutations.saveQuery);
  const saveQuery = useCallback(async (args: SaveQueryArgs) => { await saveQueryMutation(args); }, [saveQueryMutation]);
  return (
    <App
      hasConvex
      saveQuery={saveQuery}
      renderRecentQueries={(onSelect) => <RecentQueries onSelect={onSelect} />}
    />
  );
}

function AppWithoutConvex() {
  const saveQuery = useCallback(async (_args: SaveQueryArgs) => {}, []);
  return (
    <App
      hasConvex={false}
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
          <ConvexClientProvider><AppWithConvex /></ConvexClientProvider>
        ) : (
          <AppWithoutConvex />
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}
