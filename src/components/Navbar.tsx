"use client";

import { Activity, Sun, Moon, Globe, LogOut } from "lucide-react";
import { useTheme } from "./providers/ThemeProvider";
import { useLang } from "./providers/LanguageProvider";

interface Props { userName: string; onLogout: () => void; }

export default function Navbar({ userName, onLogout }: Props) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, tr } = useLang();

  return (
    <nav className="sticky top-0 z-50 animate-in" style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)", backdropFilter: "blur(16px) saturate(180%)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" }}>
              <Activity className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight" style={{ color: "var(--text)", fontFamily: lang === "ur" ? "var(--font-urdu)" : "var(--font-inter)" }}>
              {tr.appName}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full" style={{ color: "var(--primary)", background: "var(--primary-subtle)", fontFamily: "var(--font-inter)" }}>
              BETA
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button onClick={toggleLang} className="btn-ghost text-[12px] px-2.5 py-1.5 rounded-lg" title={lang === "ur" ? "Switch to English" : "اردو میں تبدیل کریں"}>
              <Globe className="w-3.5 h-3.5" />
              <span style={{ fontFamily: "var(--font-inter)" }}>{lang === "ur" ? "EN" : "اردو"}</span>
            </button>

            <button onClick={toggleTheme} className="btn-ghost px-2 py-1.5 rounded-lg" title={theme === "dark" ? "Light mode" : "Dark mode"}>
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <div className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />

            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: "var(--surface-2)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))", color: "white" }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-[12px] font-medium hidden sm:block" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter)" }}>
                {userName}
              </span>
            </div>

            <button onClick={onLogout} className="btn-ghost px-2 py-1.5 rounded-lg ml-0.5" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
