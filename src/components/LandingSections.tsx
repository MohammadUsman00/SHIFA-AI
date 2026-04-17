"use client";

import { AlertTriangle, Compass, Lightbulb, Sparkles, Stethoscope } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

export default function LandingSections() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const introClass = scriptUiClass(lang);
  const titleClass = scriptTitleClass(lang);

  const steps = [
    { n: "1", title: tr.landingStep1Title, desc: tr.landingStep1Desc, icon: Stethoscope },
    { n: "2", title: tr.landingStep2Title, desc: tr.landingStep2Desc, icon: Sparkles },
    { n: "3", title: tr.landingStep3Title, desc: tr.landingStep3Desc, icon: Lightbulb },
  ];

  const sectionKicker = (text: string) => (
    <p
      className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}
    >
      {text}
    </p>
  );

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Problem */}
      <section
        id="problem"
        className="scroll-mt-24"
        aria-labelledby="problem-heading"
      >
        <div className="relative overflow-hidden rounded-[28px] border glass-panel soft-shadow px-6 py-10 sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, var(--danger) 0%, transparent 70%)" }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              {sectionKicker(tr.landingProblemKicker)}
              <div className="mb-4 flex items-start gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: "var(--danger-subtle)" }}
                >
                  <AlertTriangle className="h-5 w-5" style={{ color: "var(--danger)" }} />
                </div>
                <p className={`text-[13px] font-medium ${titleClass}`} style={{ color: "var(--text-3)", fontFamily: f }}>
                  {tr.tagline}
                </p>
              </div>
              <h2
                id="problem-heading"
                className={`mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-[34px] ${titleClass}`}
                style={{ color: "var(--text)", fontFamily: f }}
              >
                {tr.landingProblemTitle}
              </h2>
              <p className={`max-w-2xl text-[15px] leading-relaxed sm:text-[16px] ${introClass}`} style={{ color: "var(--text-2)", fontFamily: f }}>
                {tr.landingProblemBody}
              </p>
            </div>
            <div
              className="rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
            >
              <p className={`mb-2 text-sm font-semibold ${titleClass}`} style={{ color: "var(--text)", fontFamily: f }}>
                {tr.landingVisionTitle}
              </p>
              <p className={`text-[13px] leading-relaxed sm:text-[14px] ${introClass}`} style={{ color: "var(--text-3)", fontFamily: f }}>
                {tr.landingVisionBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="scroll-mt-24" aria-labelledby="approach-heading">
        <div className="rounded-[28px] border glass-panel soft-shadow px-6 py-10 sm:px-10 sm:py-12">
          {sectionKicker(tr.landingApproachKicker)}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--primary-subtle)" }}>
              <Compass className="h-6 w-6" style={{ color: "var(--primary)" }} />
            </div>
            <h2
              id="approach-heading"
              className={`text-2xl font-bold tracking-tight sm:text-3xl ${titleClass}`}
              style={{ color: "var(--text)", fontFamily: f }}
            >
              {tr.landingApproachTitle}
            </h2>
          </div>
          <p className={`max-w-3xl text-[15px] leading-relaxed sm:text-[16px] ${introClass}`} style={{ color: "var(--text-2)", fontFamily: f }}>
            {tr.landingApproachBody}
          </p>
        </div>
      </section>

      {/* How */}
      <section id="how" className="scroll-mt-24" aria-labelledby="how-heading">
        <div className="text-center sm:text-start">
          {sectionKicker(tr.landingHowKicker)}
          <h2
            id="how-heading"
            className={`mb-8 text-2xl font-bold tracking-tight sm:text-3xl md:text-center ${titleClass}`}
            style={{ color: "var(--text)", fontFamily: f }}
          >
            {tr.landingHowTitle}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-[22px] border p-6 text-start transition-all duration-300 hover:-translate-y-0.5 glass-panel"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl text-sm font-bold"
                  style={{ background: "var(--surface-2)", color: "var(--primary)", fontFamily: "var(--font-inter)" }}
                >
                  {s.n}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:bg-[var(--primary-subtle)]" style={{ background: "var(--surface-2)" }}>
                  <s.icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                </div>
              </div>
              <p className={`mb-2 text-[15px] font-semibold ${titleClass}`} style={{ color: "var(--text)", fontFamily: f }}>
                {s.title}
              </p>
              <p className={`text-[13px] leading-relaxed sm:text-[14px] ${introClass}`} style={{ color: "var(--text-3)", fontFamily: f }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
