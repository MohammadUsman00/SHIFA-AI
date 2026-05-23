"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  HandHeart,
  Languages,
  ScanLine,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { useTheme } from "./providers/ThemeProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import Navbar from "./Navbar";
import TrustRibbon from "./TrustRibbon";
import LandingSections from "./LandingSections";
import FaqFooter from "./FaqFooter";
import ImpactCounter from "./features/ImpactCounter";
import { bodyFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

interface Props {
  onEnter: (name: string) => void;
  hasConvex?: boolean;
}

export default function WelcomeScreen({ onEnter, hasConvex = false }: Props) {
  const [name, setName] = useState("");
  const { tr, lang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const f = bodyFontVar(lang);
  const introClass = scriptUiClass(lang);
  const titleClass = scriptTitleClass(lang);

  const pillars = [
    {
      icon: HandHeart,
      title: tr.feature1Title,
      desc: tr.feature1Desc,
    },
    {
      icon: ScanLine,
      title: tr.feature2Title,
      desc: tr.feature2Desc,
    },
    {
      icon: Languages,
      title: tr.feature3Title,
      desc: tr.feature3Desc,
    },
  ];

  return (
    <div className="shifa-page">
      <Navbar minimal />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--gold) 0%, transparent 40%)`,
          }}
        />
        <div className="shifa-container relative py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="royal-kicker mb-4 animate-in">{tr.welcomeKicker}</p>
            <hr className="gold-rule gold-rule-center mb-8 animate-in" />
            <h1
              className={`royal-title mb-6 text-4xl sm:text-5xl lg:text-[3.5rem] animate-up ${titleClass}`}
              style={{ fontFamily: f }}
            >
              {tr.heroTitle}
            </h1>
            <p
              className={`royal-lead mx-auto mb-10 max-w-2xl animate-up delay-1 ${introClass}`}
              style={{ fontFamily: f }}
            >
              {tr.welcomeDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 animate-up delay-2">
              <a href="#begin" className="btn-gold">
                {tr.getStarted}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#mission" className="btn-ghost px-5 py-3">
                <BookOpen className="h-4 w-4" />
                {tr.navProblem}
              </a>
            </div>
            <div className="mt-10 flex justify-center animate-up delay-3">
              <ImpactCounter hasConvex={hasConvex} />
            </div>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                label: lang === "ur" ? "مقصد" : lang === "hi" ? "उद्देश्य" : "Our purpose",
                value: lang === "ur" ? "مریضوں کی سمجھ" : lang === "hi" ? "मरीज़ों की समझ" : "Patient understanding",
              },
              {
                label: lang === "ur" ? "زبانیں" : lang === "hi" ? "भाषाएँ" : "Languages",
                value: "Urdu · English · Hindi",
              },
              {
                label: lang === "ur" ? "قیمت" : lang === "hi" ? "मूल्य" : "Access",
                value: lang === "ur" ? "مفت معلومات" : lang === "hi" ? "मुफ़्त जानकारी" : "Free guidance",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="cause-panel animate-in p-6 text-center"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <p className="royal-kicker mb-2 text-[10px]">{stat.label}</p>
                <p className={`text-[15px] font-semibold ${titleClass}`} style={{ fontFamily: f, color: "var(--text)" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustRibbon />

      {/* Mission intro */}
      <section id="mission" className="scroll-mt-20 border-b border-[var(--border)] bg-[var(--surface-2)]/50 py-16 sm:py-20">
        <div className="shifa-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="royal-kicker mb-3">{tr.welcomeIntroTitle}</p>
              <hr className="gold-rule mb-6" />
              <h2 className={`royal-title mb-5 text-3xl sm:text-4xl ${titleClass}`} style={{ fontFamily: f }}>
                {tr.landingProblemTitle}
              </h2>
              <p className={`text-[16px] leading-relaxed text-[var(--text-2)] ${introClass}`} style={{ fontFamily: f }}>
                {tr.landingProblemBody}
              </p>
            </div>
            <div className="cause-panel p-8 sm:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-[var(--primary-subtle)]">
                <Shield className="h-7 w-7 text-[var(--primary)]" />
              </div>
              <h3 className={`royal-title mb-3 text-2xl ${titleClass}`} style={{ fontFamily: f }}>
                {tr.welcomeIntroTitle}
              </h3>
              <p className={`leading-relaxed text-[var(--text-2)] ${introClass}`} style={{ fontFamily: f }}>
                {tr.welcomeIntroDesc}
              </p>
              <p className={`mt-4 text-sm italic text-[var(--text-3)] ${introClass}`} style={{ fontFamily: f }}>
                {tr.heroDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 sm:py-20">
        <div className="shifa-container">
          <div className="mb-12 text-center">
            <p className="royal-kicker mb-3">{tr.landingHowKicker}</p>
            <h2 className={`royal-title text-3xl sm:text-4xl ${titleClass}`} style={{ fontFamily: f }}>
              {tr.landingHowTitle}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <article
                key={p.title}
                className="cause-panel animate-up p-8"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "var(--navy)", color: "var(--gold)" }}
                >
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className={`mb-2 text-lg font-semibold ${titleClass}`} style={{ fontFamily: f }}>
                  {p.title}
                </h3>
                <p className={`text-[15px] leading-relaxed text-[var(--text-3)] ${introClass}`} style={{ fontFamily: f }}>
                  {p.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Full story sections */}
      <div className="shifa-container pb-8">
        <LandingSections />
      </div>

      {/* Begin — name entry */}
      <section id="begin" className="scroll-mt-20 border-t border-[var(--border)] bg-[var(--navy)] py-16 sm:py-20">
        <div className="shifa-container">
          <div className="mx-auto max-w-lg text-center">
            <p className="royal-kicker mb-3 text-[var(--gold)]">{tr.poweredBy}</p>
            <h2
              className={`royal-title mb-4 text-3xl text-[#f5f2eb] sm:text-4xl ${titleClass}`}
              style={{ fontFamily: f }}
            >
              {tr.landingFooterCta}
            </h2>
            <p className="mb-8 text-[15px] leading-relaxed text-[#c8d0da]" style={{ fontFamily: f }}>
              {tr.tagline}
            </p>

            <div
              className="rounded-xl border p-6 text-left"
              style={{ borderColor: "color-mix(in srgb, var(--gold) 40%, transparent)", background: "var(--navy-soft)" }}
            >
              <label className="royal-kicker mb-2 block text-[var(--gold)]">
                {lang === "ur" ? "آپ کا نام" : lang === "hi" ? "आपका नाम" : "Your name"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tr.enterName}
                className={`input-field mb-4 ${introClass}`}
                style={{ fontFamily: f, background: "var(--surface)", borderColor: "var(--border)" }}
                onKeyDown={(e) => e.key === "Enter" && onEnter(name.trim() || "Guest")}
                autoComplete="name"
              />
              <button
                type="button"
                onClick={() => onEnter(name.trim() || "Guest")}
                className="btn-gold w-full"
                style={{ fontFamily: f }}
              >
                {tr.getStarted}
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-4 text-center text-[12px] text-[#8a96a3]" style={{ fontFamily: f }}>
                {tr.disclaimer}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <LanguageSwitcher />
              <button type="button" onClick={toggleTheme} className="btn-ghost border-[#3d5670] text-[#c8d0da]">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="shifa-container py-12">
        <FaqFooter />
      </div>
    </div>
  );
}
