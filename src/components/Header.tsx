"use client";

import { Activity } from "lucide-react";

export default function Header() {
  return (
    <header className="py-8 mb-2">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-urdu)" }}>
            شفا AI
          </h1>
          <p className="text-sm text-slate-500 -mt-0.5" dir="ltr" style={{ fontFamily: "var(--font-inter)" }}>
            Professional prescription guidance
          </p>
        </div>
      </div>
    </header>
  );
}
