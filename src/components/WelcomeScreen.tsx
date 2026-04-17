"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Zap,
  ScanLine,
  Languages,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { useTheme } from "./providers/ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { bodyFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

interface Props {
  onEnter: (name: string) => void;
}

export default function WelcomeScreen({ onEnter }: Props) {
  const [name, setName] = useState("");
  const { tr, lang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const f = bodyFontVar(lang);
  const introClass = scriptUiClass(lang);
  const titleClass = scriptTitleClass(lang);

  const highlights = [
    { icon: Zap, text: tr.feature1Title, sub: tr.feature1Desc },
    { icon: ScanLine, text: tr.feature2Title, sub: tr.feature2Desc },
    { icon: Languages, text: tr.feature3Title, sub: tr.feature3Desc },
  ];

  const stats = [
    {
      label: lang === "ur" ? "فوری سمجھ" : lang === "hi" ? "तुरंत समझ" : "Fast clarity",
      value: lang === "ur" ? "چند سیکنڈ" : lang === "hi" ? "कुछ सेकंड" : "In seconds",
    },
    {
      label: lang === "ur" ? "زبانیں" : lang === "hi" ? "भाषाएँ" : "Languages",
      value:
        lang === "ur"
          ? "اردو + English + Hindi"
          : lang === "hi"
            ? "हिंदी + उर्दू + अंग्रेज़ी"
            : "Urdu + English + Hindi",
    },
    {
      label: lang === "ur" ? "تجربہ" : lang === "hi" ? "अनुभव" : "Experience",
      value: lang === "ur" ? "صاف اور پروفیشنل" : lang === "hi" ? "साफ़ और पेशेवर" : "Clean and professional",
    },
  ];

  return (
    <div className="noise relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-grid absolute inset-0 opacity-[0.18]" />
        <div
          className="absolute left-[-6%] top-[-8%] h-[360px] w-[360px] rounded-full animate-glow"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--gradient-to) 26%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[-8%] top-[10%] h-[420px] w-[420px] rounded-full animate-drift"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--gradient-from) 28%, transparent) 0%, transparent 72%)",
          }}
        />
      </div>

      <div className="absolute right-5 top-5 z-20 flex items-center gap-2 animate-in delay-4">
        <LanguageSwitcher />
        <button type="button" onClick={toggleTheme} className="btn-ghost rounded-xl px-2 py-1.5">
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 pb-16 pt-16 sm:px-6 lg:px-8">
        {/* Login first on small screens — was pushed below the fold */}
        <div className="grid w-full flex-1 items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12">
          <section className="order-2 w-full max-w-xl justify-self-center lg:order-1 lg:max-w-none lg:justify-self-stretch">
            <div className="glass-panel soft-shadow rounded-3xl p-6 sm:p-8 lg:rounded-[32px] lg:p-10">
              <div className="mb-6 flex flex-wrap items-start gap-3 text-start">
                <span
                  className="pill"
                  style={{ fontFamily: "var(--font-inter)", color: "var(--primary)" }}
                >
                  <Sparkles className="h-3 w-3" />
                  {tr.trustNote}
                </span>
              </div>

              <div className="mb-6 text-start">
                <p
                  className="mb-2 text-[11px] uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}
                >
                  {tr.welcomeKicker}
                </p>
                <h1
                  className={`text-3xl font-bold tracking-tight sm:text-4xl ${titleClass}`}
                  style={{ color: "var(--text)", fontFamily: f }}
                >
                  {tr.welcomeTitle}
                </h1>
                <p
                  className={`balanced-copy mt-4 max-w-xl text-base leading-relaxed sm:text-[17px] ${introClass}`}
                  style={{ color: "var(--text-2)", fontFamily: f }}
                >
                  {tr.welcomeDesc}
                </p>
              </div>

              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                {stats.map((item, index) => (
                  <div
                    key={item.label}
                    className="animate-in rounded-2xl border p-4 text-start"
                    style={{
                      animationDelay: `${index * 80}ms`,
                      borderColor: "var(--border)",
                      background: "var(--surface-2)",
                    }}
                  >
                    <p
                      className="mb-2 text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-semibold sm:text-[15px] ${introClass}`}
                      style={{ color: "var(--text)", fontFamily: f }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mb-8 rounded-2xl border p-5 text-start sm:p-6"
                style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
              >
                <div className="mb-4 flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: "var(--primary-subtle)" }}
                  >
                    <Stethoscope className="h-5 w-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-lg font-semibold ${titleClass}`} style={{ color: "var(--text)", fontFamily: f }}>
                      {tr.welcomeIntroTitle}
                    </p>
                    <p
                      className="mt-1 text-[12px] uppercase tracking-[0.2em]"
                      style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}
                      translate="no"
                    >
                      Shifa AI
                    </p>
                  </div>
                </div>
                <p
                  className={`balanced-copy max-w-2xl text-sm leading-relaxed sm:text-[15px] ${introClass}`}
                  style={{ color: "var(--text-2)", fontFamily: f }}
                >
                  {tr.welcomeIntroDesc}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item, i) => (
                  <div
                    key={item.text}
                    className="animate-in rounded-2xl border p-4 text-start transition-transform duration-300 hover:-translate-y-0.5"
                    style={{
                      animationDelay: `${120 + i * 90}ms`,
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                    }}
                  >
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: "var(--primary-subtle)" }}
                    >
                      <item.icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                    </div>
                    <p className={`mb-1.5 text-sm font-semibold ${titleClass}`} style={{ color: "var(--text)", fontFamily: f }}>
                      {item.text}
                    </p>
                    <p className={`text-[13px] leading-relaxed ${introClass}`} style={{ color: "var(--text-3)", fontFamily: f }}>
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 flex items-start gap-3 rounded-2xl border px-4 py-3 text-start"
                style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--primary)" }} />
                <p className={`text-sm leading-relaxed ${introClass}`} style={{ color: "var(--text-2)", fontFamily: f }}>
                  {tr.heroDesc}
                </p>
              </div>
            </div>
          </section>

          <section className="order-1 w-full max-w-md justify-self-center lg:order-2 lg:max-w-none lg:justify-self-end">
            <div className="glass-panel soft-shadow relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24 lg:max-w-md lg:rounded-[32px]">
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{
                  background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to), var(--gradient-from))",
                  backgroundSize: "200% 100%",
                  animation: "borderFlow 7s linear infinite",
                }}
              />

              <div className="mb-6 text-center">
                <div className="relative mx-auto mb-6 h-16 w-16">
                  <div className="absolute inset-0 rounded-2xl bg-teal-500/20 blur-xl dark:bg-[color-mix(in_srgb,var(--primary)_22%,transparent)]" />
                  <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(45,212,191,0.3)]"
                    style={{ background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" }}
                  >
                    <Activity className="h-7 w-7" style={{ color: "var(--primary-fg)" }} />
                  </div>
                </div>
                <p
                  className="text-[11px] uppercase tracking-[0.28em]"
                  style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}
                >
                  {tr.poweredBy}
                </p>
                {/* Latin lock + translation off — avoids "Shifa" → "Healing" in browser translate */}
                <h2
                  className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
                  style={{ fontFamily: "var(--font-inter)", color: "var(--text)" }}
                  translate="no"
                >
                  Shifa AI
                </h2>
                <p className={`mt-2 text-sm ${introClass}`} style={{ color: "var(--text-3)", fontFamily: f }}>
                  {tr.tagline}
                </p>
              </div>

              <div className="rounded-2xl border p-4 text-start" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
                <label
                  className="mb-2 block text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "var(--text-4)", fontFamily: "var(--font-inter)" }}
                >
                  {lang === "ur" ? "پروفائل نام" : lang === "hi" ? "आपका नाम" : "Your name"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tr.enterName}
                  className={`input-field rounded-xl border text-start ${introClass}`}
                  style={{ fontFamily: f, background: "var(--surface)", borderColor: "var(--border)" }}
                  onKeyDown={(e) => e.key === "Enter" && onEnter(name.trim() || "Guest")}
                  autoComplete="name"
                />
              </div>

              <button
                type="button"
                onClick={() => onEnter(name.trim() || "Guest")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold transition-all duration-150 hover:shadow-[0_4px_32px_rgba(45,212,191,0.35)] active:scale-[0.98]"
                style={{
                  fontFamily: f,
                  color: "var(--primary-fg)",
                  background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",
                  boxShadow: "0 4px 24px rgba(45, 212, 191, 0.25)",
                }}
              >
                {tr.getStarted}
                <ArrowRight className="h-4 w-4" style={{ transform: lang === "ur" ? "scaleX(-1)" : "none" }} />
              </button>

              <div className="my-5 h-px w-full" style={{ background: "var(--border)" }} />

              <div className="space-y-2 text-start text-[13px]" style={{ color: "var(--text-3)", fontFamily: f }}>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                  <span className={introClass}>{tr.trustNote}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Languages className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                  <span className={introClass}>
                    {lang === "ur"
                      ? "اردو اور English دونوں میں رہنمائی"
                      : lang === "hi"
                        ? "हिंदी, उर्दू और अंग्रेजी में मार्गदर्शन"
                        : "Guidance in Urdu, English, and Hindi"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
