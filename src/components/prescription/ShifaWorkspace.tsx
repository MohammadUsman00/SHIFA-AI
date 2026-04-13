"use client";

import { motion } from "motion/react";
import { Activity, FileImage, Keyboard, Maximize2, ScanLine, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLang } from "@/components/providers/LanguageProvider";

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
  const f = lang === "ur" ? "var(--font-urdu)" : "var(--font-inter)";

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

        {/* Header — mockup style */}
        <div className="relative mb-8 flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[var(--text)]" translate="no">
                  Shifa AI
                </span>
                <span className="rounded-full border border-[var(--primary)]/30 bg-[var(--primary-subtle)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                  Gemini AI
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[var(--text-3)]" style={{ fontFamily: f }}>
                {lang === "ur" ? `خوش آمدید، ${userName}` : `Welcome, ${userName}`}
              </p>
            </div>
          </div>
          <p
            className="max-w-md text-[13px] leading-relaxed text-[var(--text-4)] sm:text-right"
            style={{ fontFamily: f }}
          >
            {tr.workspaceSubtitle}
          </p>
        </div>

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
