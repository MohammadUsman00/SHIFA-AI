"use client";

import { motion } from "motion/react";
import { Activity, FileImage, Keyboard, Maximize2, ScanLine, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLang } from "@/components/providers/LanguageProvider";
import { bodyFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

type Tab = "text" | "photo";

interface Props {
  userName: string;
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
  /** Live preview of prescription image (data URL) for center column */
  previewDataUrl: string | null;
  onOpenPreview?: () => void;
  leftSlot: React.ReactNode;
  centerSlot: React.ReactNode;
  rightSlot: React.ReactNode;
  onScanAnother: () => void;
  onSearchMedicines: () => void;
}

export default function ShifaWorkspace({
  userName,
  activeTab,
  onTabChange,
  previewDataUrl,
  onOpenPreview,
  leftSlot,
  centerSlot,
  rightSlot,
  onScanAnother,
  onSearchMedicines,
}: Props) {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const titleClass = scriptTitleClass(lang);
  const introClass = scriptUiClass(lang);

  return (
    <motion.section
      id="assistant"
      dir="ltr"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-24"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--border)_85%,transparent)] bg-[color-mix(in_srgb,#121212_82%,var(--surface))] p-4 shadow-[0_40px_120px_-50px_rgba(45,212,191,0.25)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] hero-grid" aria-hidden />
        <div
          className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
        />

        {/* Hero — focal hierarchy */}
        <div className="relative flex flex-col items-center px-4 pb-10 pt-10 text-center md:pt-14 md:pb-12">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[min(100vw,600px)] -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px] dark:bg-teal-400/10"
            aria-hidden
          />
          <div className="relative mb-6 flex animate-in items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--primary)_22%,transparent)] bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] px-3 py-1.5 font-mono text-xs text-[var(--primary)]">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
            <span translate="no">{tr.heroBadge}</span>
          </div>
          <h1
            className={`relative mb-4 animate-up text-5xl font-black leading-none tracking-tight text-[var(--text)] md:text-7xl ${titleClass}`}
            style={{ fontFamily: f }}
          >
            <span className="gradient-text">{tr.heroHeadlineAccent}</span>
            <br />
            <span className="text-[var(--text)]">{tr.heroHeadlineMain}</span>
          </h1>
          <p
            className={`relative mb-3 max-w-md animate-up text-lg leading-relaxed delay-1 text-[var(--text-3)] ${introClass}`}
            style={{ fontFamily: f }}
          >
            {tr.heroSubhead}
          </p>
          <p className="relative mb-2 text-sm text-[var(--text-4)] animate-up delay-1" style={{ fontFamily: f }}>
            {lang === "ur"
              ? `خوش آمدید، ${userName}`
              : lang === "hi"
                ? `स्वागत है، ${userName}`
                : `Welcome, ${userName}`}
          </p>
          <div className="relative mt-2 flex flex-wrap items-center justify-center gap-3 animate-up delay-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div className="text-start">
              <p className="text-sm font-bold tracking-tight text-[var(--text)]" translate="no">
                Shifa AI
              </p>
              <p className="max-w-[min(100vw-2rem,28rem)] text-[12px] leading-relaxed text-[var(--text-4)]" style={{ fontFamily: f }}>
                {tr.workspaceSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mb-6 border-b border-[var(--border)]" aria-hidden />

        {/* Tabs — pill segment */}
        <div className="relative mb-6 flex flex-wrap gap-2">
          {(["text", "photo"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all"
              style={{
                fontFamily: "var(--font-inter)",
                background: activeTab === tab ? "var(--surface)" : "transparent",
                color: activeTab === tab ? "var(--text)" : "var(--text-4)",
                border: activeTab === tab ? "1px solid var(--border)" : "1px solid transparent",
                boxShadow: activeTab === tab ? "0 12px 40px -20px rgba(45,212,191,0.35)" : "none",
              }}
            >
              {tab === "text" ? <Keyboard className="h-4 w-4" /> : <ScanLine className="h-4 w-4" />}
              {tab === "text" ? tr.tabText : tr.tabPhoto}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Card className="border-[var(--border)] bg-[var(--surface)]/70">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  {tr.workspaceLeftTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">{leftSlot}</CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <Card className="min-h-[280px] border-[var(--border)] bg-[var(--surface)]/70 lg:min-h-[360px]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-[var(--text)]">
                  {tr.dashboardPrescriptionPreview}
                </CardTitle>
                {previewDataUrl && onOpenPreview ? (
                  <button
                    type="button"
                    onClick={onOpenPreview}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-2)] hover:bg-[var(--surface-3)]"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    {tr.dashboardViewFull}
                  </button>
                ) : null}
              </CardHeader>
              <CardContent className="flex min-h-[220px] flex-1 flex-col lg:min-h-[280px]">{centerSlot}</CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-auto min-h-[96px] flex-col gap-2 rounded-2xl border-[var(--border)] bg-[var(--surface-2)] py-4 text-[var(--text)] hover:bg-[var(--surface-3)]"
                onClick={onScanAnother}
              >
                <ScanLine className="h-6 w-6 text-[var(--primary)]" />
                <span className="text-center text-[11px] font-semibold leading-tight">{tr.dashboardScanAnother}</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-auto min-h-[96px] flex-col gap-2 rounded-2xl border-[var(--border)] bg-[var(--surface-2)] py-4 text-[var(--text)] hover:bg-[var(--surface-3)]"
                onClick={onSearchMedicines}
              >
                <Search className="h-6 w-6 text-[var(--primary)]" />
                <span className="text-center text-[11px] font-semibold leading-tight">{tr.dashboardSearchMedicines}</span>
              </Button>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-3 py-2 text-center text-[11px] text-[var(--text-3)]">
              {tr.dashboardBilingualActive}
            </div>
            {rightSlot}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
