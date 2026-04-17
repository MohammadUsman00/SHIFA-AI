"use client";

import { useLang } from "./providers/LanguageProvider";
import { bodyFontVar, scriptTitleClass, scriptUiClass } from "@/lib/lang-ui";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqFooter() {
  const { tr, lang } = useLang();
  const f = bodyFontVar(lang);
  const introClass = scriptUiClass(lang);
  const titleClass = scriptTitleClass(lang);

  const faqs: FaqItem[] = [
    { q: tr.faq1Q, a: tr.faq1A },
    { q: tr.faq2Q, a: tr.faq2A },
    { q: tr.faq3Q, a: tr.faq3A },
    { q: tr.faq4Q, a: tr.faq4A },
  ];

  return (
    <>
      <section id="faq" className="scroll-mt-24 pb-4" aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className={`mb-6 text-center text-2xl font-bold tracking-tight sm:text-3xl ${titleClass}`}
          style={{ color: "var(--text)", fontFamily: f }}
        >
          {tr.navFaq}
        </h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 transition-colors open:bg-[var(--surface-2)] sm:px-5"
            >
              <summary
                className={`cursor-pointer list-none py-3 text-[14px] font-semibold outline-none sm:text-[15px] ${titleClass}`}
                style={{ color: "var(--text)", fontFamily: f }}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{item.q}</span>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider opacity-60 transition group-open:rotate-180"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--primary)" }}
                    aria-hidden
                  >
                    ▾
                  </span>
                </span>
              </summary>
              <p className={`pb-4 text-[13px] leading-relaxed sm:text-[14px] ${introClass}`} style={{ color: "var(--text-3)", fontFamily: f }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t pt-10 pb-6 text-center" style={{ borderColor: "var(--border)" }}>
        <p className={`mb-2 text-lg font-semibold sm:text-xl ${titleClass}`} style={{ color: "var(--text)", fontFamily: f }}>
          {tr.landingFooterCta}
        </p>
        <p className="text-[12px] sm:text-[13px]" style={{ color: "var(--text-4)", fontFamily: f }}>
          {tr.landingFooterNote}
        </p>
      </footer>
    </>
  );
}
