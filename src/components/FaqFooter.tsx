"use client";

import { Heart } from "lucide-react";
import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

export default function FaqFooter() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const introClass = scriptUiClass(lang);
  const titleClass = scriptTitleClass(lang);

  const faqs = [
    { q: tr.faq1Q, a: tr.faq1A },
    { q: tr.faq2Q, a: tr.faq2A },
    { q: tr.faq3Q, a: tr.faq3A },
    { q: tr.faq4Q, a: tr.faq4A },
  ];

  return (
    <>
      <section id="faq" className="scroll-mt-24 py-8" aria-labelledby="faq-heading">
        <div className="mb-10 text-center">
          <p className="royal-kicker mb-3">{tr.navFaq}</p>
          <hr className="gold-rule gold-rule-center mb-6" />
          <h2
            id="faq-heading"
            className={`royal-title text-3xl sm:text-4xl ${titleClass}`}
            style={{ fontFamily: f }}
          >
            {tr.navFaq}
          </h2>
        </div>
        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="faq-item group px-5 py-1">
              <summary
                className={`cursor-pointer list-none py-4 text-[15px] font-semibold ${titleClass}`}
                style={{ color: "var(--text)", fontFamily: f }}
              >
                <span className="flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-[var(--gold)] transition group-open:rotate-180" aria-hidden>
                    ▾
                  </span>
                </span>
              </summary>
              <p
                className={`pb-4 text-[14px] leading-relaxed text-[var(--text-3)] ${introClass}`}
                style={{ fontFamily: f }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer
        className="mt-16 border-t pt-12 pb-8 text-center"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2" style={{ borderColor: "var(--gold)", background: "var(--navy)" }}>
          <Heart className="h-5 w-5 text-[var(--gold)]" fill="currentColor" />
        </div>
        <p className={`royal-title mb-2 text-xl sm:text-2xl ${titleClass}`} style={{ fontFamily: f, color: "var(--text)" }}>
          {tr.landingFooterCta}
        </p>
        <p className="text-[13px] text-[var(--text-4)]" style={{ fontFamily: f }}>
          {tr.landingFooterNote}
        </p>
      </footer>
    </>
  );
}
