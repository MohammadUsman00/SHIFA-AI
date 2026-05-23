"use client";

import { Keyboard, Maximize2, ScanLine, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/providers/LanguageProvider";
import { bodyFontVar, chromeFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

type Tab = "text" | "photo";

interface Props {
  userName: string;
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
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
  const chrome = chromeFontVar(lang);
  const titleClass = scriptTitleClass(lang);
  const introClass = scriptUiClass(lang);

  return (
    <section id="assistant" dir="ltr" className="scroll-mt-24">
      <div className="cause-panel">
        {/* Section header */}
        <div className="cause-panel-header cause-panel-header-gold px-6 py-8 sm:px-10 sm:py-10">
          <p className="royal-kicker mb-2">{tr.navAssistant}</p>
          <h2 className={`royal-title mb-3 text-2xl sm:text-3xl ${titleClass}`} style={{ fontFamily: f }}>
            {tr.heroHeadlineAccent} {tr.heroHeadlineMain}
          </h2>
          <p className={`max-w-2xl text-[15px] leading-relaxed text-[var(--text-2)] ${introClass}`} style={{ fontFamily: f }}>
            {tr.heroSubhead}
          </p>
          <p className="mt-3 text-sm text-[var(--text-3)]" style={{ fontFamily: f }}>
            {lang === "ur"
              ? `خوش آمدید، ${userName}`
              : lang === "hi"
                ? `स्वागत है، ${userName}`
                : `Welcome, ${userName}`}
          </p>
        </div>

        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Mode tabs */}
          <div className="segment-tabs max-w-md">
            {(["text", "photo"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`segment-tab ${activeTab === tab ? "active" : ""}`}
                style={{ fontFamily: chrome }}
              >
                {tab === "text" ? <Keyboard className="h-4 w-4" /> : <ScanLine className="h-4 w-4" />}
                {tab === "text" ? tr.tabText : tr.tabPhoto}
              </button>
            ))}
          </div>

          {/* Care desk layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Tool column */}
            <div className="lg:col-span-5">
              <div className="cause-panel h-full">
                <div className="border-b border-[var(--border)] px-5 py-4" style={{ background: "var(--surface-2)" }}>
                  <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: chrome }}>
                    {tr.workspaceLeftTitle}
                  </h3>
                </div>
                <div className="space-y-4 p-5">{leftSlot}</div>
              </div>
            </div>

            {/* Preview column */}
            <div className="lg:col-span-4">
              <div className="cause-panel flex min-h-[280px] flex-col lg:min-h-[360px]">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4" style={{ background: "var(--surface-2)" }}>
                  <h3 className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: chrome }}>
                    {tr.dashboardPrescriptionPreview}
                  </h3>
                  {previewDataUrl && onOpenPreview ? (
                    <button
                      type="button"
                      onClick={onOpenPreview}
                      className="btn-ghost text-xs"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      {tr.dashboardViewFull}
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-4">{centerSlot}</div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-auto min-h-[88px] flex-col gap-2 py-4"
                  onClick={onScanAnother}
                >
                  <ScanLine className="h-5 w-5 text-[var(--primary)]" />
                  <span className="text-center text-[11px] font-semibold leading-tight">{tr.dashboardScanAnother}</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-auto min-h-[88px] flex-col gap-2 py-4"
                  onClick={onSearchMedicines}
                >
                  <Search className="h-5 w-5 text-[var(--primary)]" />
                  <span className="text-center text-[11px] font-semibold leading-tight">{tr.dashboardSearchMedicines}</span>
                </Button>
              </div>
              <p
                className="rounded-lg border border-[var(--border)] px-3 py-2.5 text-center text-[11px] text-[var(--text-3)]"
                style={{ fontFamily: f, background: "var(--surface-2)" }}
              >
                {tr.dashboardBilingualActive}
              </p>
              {rightSlot}
            </div>
          </div>

          <p
            className="rounded-lg border border-[var(--warning)]/30 px-4 py-3 text-center text-[12px] leading-relaxed text-[var(--text-3)]"
            style={{ fontFamily: f, background: "var(--warning-subtle)" }}
          >
            {tr.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
