"use client";

import { Heart, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "./providers/ThemeProvider";
import { useLang } from "./providers/LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { bodyFontVar } from "@/lib/lang-ui";
import { featureCopy } from "@/lib/feature-copy";

interface Props {
  userName?: string;
  onLogout?: () => void;
  showSectionLinks?: boolean;
  minimal?: boolean;
}

export default function Navbar({ userName, onLogout, showSectionLinks, minimal }: Props) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, tr } = useLang();
  const titleFont = bodyFontVar(lang);

  const fc = featureCopy(lang);
  const links: [string, string][] = showSectionLinks
    ? [
        ["#mission", tr.navProblem],
        ["#approach", tr.navApproach],
        ["#how", tr.navHow],
        ["#assistant", tr.navAssistant],
        ["#cabinet", fc.navCabinet],
        ["#faq", tr.navFaq],
      ]
    : minimal
      ? [
          ["#mission", tr.navProblem],
          ["#begin", lang === "ur" ? "شروع کریں" : lang === "hi" ? "शुरू करें" : "Begin"],
        ]
      : [];

  return (
    <header className="site-nav sticky top-0 z-50">
      <div className="shifa-container flex min-h-[4rem] items-center justify-between gap-3 py-3">
        <a href="#" className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: "var(--gold)", background: "var(--navy)" }}
          >
            <Heart className="h-5 w-5 text-[var(--gold)]" fill="currentColor" />
          </div>
          <div className="min-w-0">
            <span
              className="block text-[17px] font-semibold leading-tight tracking-tight"
              style={{ fontFamily: titleFont, color: "var(--text)" }}
              translate="no"
            >
              {tr.appName}
            </span>
            <span className="royal-kicker hidden text-[9px] sm:block">{tr.welcomeKicker}</span>
          </div>
        </a>

        {links.length > 0 && (
          <nav
            className="hidden flex-1 items-center justify-center gap-0.5 md:flex"
            aria-label="Main"
          >
            {links.map(([href, label]) => (
              <a key={href} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost rounded-full p-2"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {userName && onLogout && (
            <>
              <div className="mx-1 hidden h-5 w-px sm:block" style={{ background: "var(--border)" }} />
              <div
                className="hidden items-center gap-2 rounded-full px-2.5 py-1 sm:flex"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: "var(--navy)", color: "var(--gold-light)" }}
                >
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[6rem] truncate text-[12px] font-medium" style={{ color: "var(--text-2)" }}>
                  {userName}
                </span>
              </div>
              <button type="button" onClick={onLogout} className="btn-ghost rounded-full p-2" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
