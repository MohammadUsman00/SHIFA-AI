"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Keyboard, ScanLine, AlertCircle, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider, useLang } from "@/components/providers/LanguageProvider";
import WelcomeScreen from "@/components/WelcomeScreen";
import Navbar from "@/components/Navbar";
import MedicineInput from "@/components/MedicineInput";
import PhotoUpload from "@/components/PhotoUpload";
import ResultCard from "@/components/ResultCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import RecentQueries from "@/components/RecentQueries";
import { MedicineResult, Source } from "@/types";

type Tab = "text" | "photo";

function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [prescriptionSummary, setPrescriptionSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const { tr, lang } = useLang();
  const f = lang === "ur" ? "var(--font-urdu)" : "var(--font-inter)";

  const saveQuery = useMutation(api.mutations.saveQuery);

  const enrich = useCallback(async (med: MedicineResult, idx: number) => {
    try {
      const r = await fetch("/api/enrich", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ medicineName: med.name || med.nameUrdu }) });
      const d = await r.json();
      if (d.sources?.length) setResults((p) => p.map((m, i) => (i === idx ? { ...m, sources: d.sources as Source[] } : m)));
    } catch { /* optional */ }
  }, []);

  const analyze = useCallback(async (input: { text?: string; image?: string }) => {
    setIsLoading(true); setError(null); setResults([]); setPrescriptionSummary(null);
    setLastQuery(input.text || (lang === "ur" ? "نسخے کی تصویر" : "Prescription"));
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, lang }),
      });
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      setPrescriptionSummary(typeof d.prescriptionSummary === "string" && d.prescriptionSummary.trim() ? d.prescriptionSummary.trim() : null);
      if (d.medicines?.length) {
        setResults(d.medicines);
        d.medicines.forEach((m: MedicineResult, i: number) => enrich(m, i));
        try { await saveQuery({ medicineName: input.text || d.medicines[0]?.name || "Rx", inputType: input.image ? "image" : "text", response: d.rawText || "", sources: [] }); } catch { /* */ }
      } else if (d.rawText) {
        setResults([{ name: input.text || "", nameUrdu: input.text || (lang === "ur" ? "دوا" : "Medicine"), purpose: "", dosage: "", timing: "", foodWarnings: "", stopInstructions: "", warnings: "", rawResponse: d.rawText }]);
      } else { setError(tr.noResults); }
    } catch { setError(tr.networkError); }
    finally { setIsLoading(false); }
  }, [enrich, saveQuery, tr, lang]);

  if (!userName) return <WelcomeScreen onEnter={(n) => setUserName(n)} />;

  return (
    <div className="noise min-h-screen">
      <Navbar userName={userName} onLogout={() => setUserName(null)} />

      {/* Hero */}
      <div className="relative px-5 pb-10 pt-10 sm:px-8">
        <div className="mx-auto max-w-5xl animate-up rounded-[32px] border px-6 py-8 text-center sm:px-10 sm:py-10 glass-panel soft-shadow">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[260px] w-[560px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(ellipse, var(--primary-glow) 0%, transparent 70%)", filter: "blur(72px)" }} />

          <div className="relative mb-7 flex flex-wrap items-center justify-center gap-3 animate-in">
            <div className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium" style={{ border: "1px solid rgba(45,212,191,0.2)", background: "var(--primary-ghost)", color: "var(--primary)", fontFamily: "var(--font-inter)" }}>
              <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--primary)" }} />
              <Zap className="h-3 w-3" />
              {tr.poweredBy} + Exa Search
            </div>
            <div className="pill glass-panel border-0 text-[11px] tracking-[0.22em]" style={{ fontFamily: "var(--font-inter)", color: "var(--text-3)" }}>
              {tr.appName}
            </div>
          </div>

          <h1 className={`relative mb-4 text-[40px] font-black tracking-tight sm:text-[56px] md:text-[68px] ${lang === "ur" ? "urdu-title leading-[1.45]" : "leading-[1.02]"}`} style={{ fontFamily: lang === "en" ? "var(--font-inter)" : f }}>
            {lang === "ur" ? (
              <span className="gradient-text">{tr.heroTitle}</span>
            ) : (
              <>
                <span className="gradient-text">Understand</span>
                <br />
                <span style={{ color: "var(--text)" }}>every prescription.</span>
              </>
            )}
          </h1>

          <p className={`relative mx-auto mb-10 max-w-2xl text-[16px] sm:text-[18px] ${lang === "ur" ? "urdu-ui" : "leading-relaxed"}`} style={{ color: "var(--text-3)", fontFamily: lang === "ur" ? f : "var(--font-inter)" }}>
            {tr.heroDesc}
          </p>

          <div className="relative mb-8 animate-in delay-2">
            <div className="inline-flex gap-1 rounded-2xl p-1.5 glass-panel">
            {(["text", "photo"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-150 cursor-pointer"
                style={{
                  fontFamily: "var(--font-inter)",
                  background: activeTab === tab ? "var(--surface)" : "transparent",
                  color: activeTab === tab ? "var(--text)" : "var(--text-4)",
                  boxShadow: activeTab === tab ? "0 14px 32px -24px rgba(15, 23, 42, 0.7)" : "none",
                  border: activeTab === tab ? "1px solid var(--border)" : "1px solid transparent",
                }}
              >
                {tab === "text" ? <Keyboard className="w-3.5 h-3.5" /> : <ScanLine className="w-3.5 h-3.5" />}
                {tab === "text" ? tr.tabText : tr.tabPhoto}
              </button>
            ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl animate-up delay-2">
            {activeTab === "text" ? (
              <MedicineInput onSubmit={(t) => analyze({ text: t })} isLoading={isLoading} />
            ) : (
              <PhotoUpload onUpload={(img) => analyze({ image: img })} isLoading={isLoading} />
            )}
          </div>

          <div className="relative mt-8 grid gap-3 text-left sm:grid-cols-3">
            {[
              { icon: Zap, title: lang === "ur" ? "فوری جواب" : "Fast answers", copy: lang === "ur" ? "چند لمحوں میں سمجھنے والی رہنمائی" : "Actionable guidance in moments" },
              { icon: ShieldCheck, title: lang === "ur" ? "واضح معلومات" : "Clear explanations", copy: lang === "ur" ? "دواؤں کی ہدایات صاف انداز میں" : "Medicine instructions without confusion" },
              { icon: Sparkles, title: lang === "ur" ? "بہتر تجربہ" : "Premium feel", copy: lang === "ur" ? "صاف لے آؤٹ اور بہتر پڑھائی" : "Professional UI with cleaner readability" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border p-4 glass-panel">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "var(--primary-subtle)" }}>
                  <item.icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                </div>
                <p className={`mb-1 text-sm font-semibold ${lang === "ur" ? "urdu-title" : ""}`} style={{ color: "var(--text)", fontFamily: f }}>{item.title}</p>
                <p className={`text-[13px] ${lang === "ur" ? "urdu-ui" : ""}`} style={{ color: "var(--text-3)", fontFamily: f }}>{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Main */}
          <div className="space-y-8">

            {/* Loading */}
            {isLoading && <LoadingSpinner />}

            {/* Error */}
            {error && (
              <div className="card p-5 flex items-start gap-3 animate-in" style={{ borderColor: "var(--danger)", borderLeftWidth: "3px" }}>
                <AlertCircle className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: "var(--danger)" }} />
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: f }}>{error}</p>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && !isLoading && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 animate-in">
                  <Sparkles className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  <p className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>
                    {tr.resultsFor} &ldquo;{lastQuery}&rdquo; — {results.length} {tr.medicines}
                  </p>
                </div>
                {prescriptionSummary && (
                  <div
                    className="card animate-in border-2 p-5 sm:p-6"
                    style={{ borderColor: "var(--border)", borderLeftWidth: "4px", borderLeftColor: "var(--primary)", background: "var(--surface-2)" }}
                  >
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--primary)", fontFamily: "var(--font-inter)" }}>
                      {tr.prescriptionSummaryTitle}
                    </p>
                    <p className="mb-2 text-[14px] leading-relaxed sm:text-[15px]" style={{ color: "var(--text-2)", fontFamily: f }}>
                      {prescriptionSummary}
                    </p>
                    <p className="text-[11px] leading-snug" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>
                      {tr.prescriptionSummaryHint}
                    </p>
                  </div>
                )}
                {results.map((m, i) => <ResultCard key={i} medicine={m} index={i} />)}
              </div>
            )}

            {/* Disclaimer */}
            {results.length > 0 && (
              <div className="text-center py-8 animate-in" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="inline-flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-3 h-3" style={{ color: "var(--text-4)" }} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}>Medical Disclaimer</span>
                </div>
                <p className="text-[12px] leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-4)", fontFamily: f }}>{tr.disclaimer}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block animate-in delay-3">
            <div className="sticky top-20">
              <RecentQueries onSelect={(n) => { setActiveTab("text"); analyze({ text: n }); }} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  );
}
