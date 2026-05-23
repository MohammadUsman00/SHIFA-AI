"use client";

import { AlertTriangle, Compass, Lightbulb, Stethoscope } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

export default function LandingSections() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const introClass = scriptUiClass(lang);
  const titleClass = scriptTitleClass(lang);

  const steps = [
    { n: "01", title: tr.landingStep1Title, desc: tr.landingStep1Desc, icon: Stethoscope },
    { n: "02", title: tr.landingStep2Title, desc: tr.landingStep2Desc, icon: Lightbulb },
    { n: "03", title: tr.landingStep3Title, desc: tr.landingStep3Desc, icon: Compass },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      <section id="problem" className="scroll-mt-24" aria-labelledby="problem-heading">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="royal-kicker mb-3">{tr.landingProblemKicker}</p>
            <hr className="gold-rule mb-6" />
            <div className="mb-5 flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--danger-subtle)" }}
              >
                <AlertTriangle className="h-5 w-5" style={{ color: "var(--danger)" }} />
              </div>
              <p className={`text-sm font-medium text-[var(--text-3)] ${titleClass}`} style={{ fontFamily: f }}>
                {tr.tagline}
              </p>
            </div>
            <h2
              id="problem-heading"
              className={`royal-title mb-5 text-3xl sm:text-4xl ${titleClass}`}
              style={{ fontFamily: f }}
            >
              {tr.landingProblemTitle}
            </h2>
            <p className={`text-[16px] leading-[1.8] text-[var(--text-2)] ${introClass}`} style={{ fontFamily: f }}>
              {tr.landingProblemBody}
            </p>
          </div>
          <blockquote
            className="cause-panel border-l-4 p-8 sm:p-10"
            style={{ borderLeftColor: "var(--gold)", background: "var(--surface-2)" }}
          >
            <p className="royal-kicker mb-3">{tr.landingVisionTitle}</p>
            <p className={`royal-title text-xl leading-relaxed sm:text-2xl ${titleClass}`} style={{ fontFamily: f, color: "var(--text)" }}>
              &ldquo;{tr.landingVisionBody}&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      <section id="approach" className="scroll-mt-24 border-y border-[var(--border)] py-16 sm:py-20" aria-labelledby="approach-heading">
        <div className="max-w-3xl">
          <p className="royal-kicker mb-3">{tr.landingApproachKicker}</p>
          <hr className="gold-rule mb-6" />
          <h2
            id="approach-heading"
            className={`royal-title mb-5 text-3xl sm:text-4xl ${titleClass}`}
            style={{ fontFamily: f }}
          >
            {tr.landingApproachTitle}
          </h2>
          <p className={`text-[16px] leading-[1.8] text-[var(--text-2)] ${introClass}`} style={{ fontFamily: f }}>
            {tr.landingApproachBody}
          </p>
        </div>
      </section>

      <section id="how" className="scroll-mt-24" aria-labelledby="how-heading">
        <div className="mb-12">
          <p className="royal-kicker mb-3">{tr.landingHowKicker}</p>
          <h2
            id="how-heading"
            className={`royal-title text-3xl sm:text-4xl ${titleClass}`}
            style={{ fontFamily: f }}
          >
            {tr.landingHowTitle}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="cause-panel group relative overflow-hidden p-8">
              <span
                className="royal-kicker absolute right-6 top-6 text-[10px] opacity-50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.n}
              </span>
              <div
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border"
                style={{ borderColor: "var(--gold)", background: "var(--navy)", color: "var(--gold)" }}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className={`mb-2 text-lg font-semibold ${titleClass}`} style={{ fontFamily: f }}>
                {s.title}
              </h3>
              <p className={`text-[15px] leading-relaxed text-[var(--text-3)] ${introClass}`} style={{ fontFamily: f }}>
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
