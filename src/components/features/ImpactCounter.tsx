"use client";

import { Component, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLang } from "@/components/providers/LanguageProvider";
import { featureCopy } from "@/lib/feature-copy";

const FALLBACK_DISPLAY = "1,280+";

class ImpactQueryBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function ImpactCounterConvex() {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  const stats = useQuery(api.queries.getImpactStats);
  const display = stats ? stats.displayImpact.toLocaleString() : "…";
  const fallback = <ImpactDisplay display={FALLBACK_DISPLAY} label={fc.impactLabel} />;
  return (
    <ImpactQueryBoundary fallback={fallback}>
      <ImpactDisplay display={display} label={fc.impactLabel} />
    </ImpactQueryBoundary>
  );
}

function ImpactDisplay({ display, label }: { display: string; label: string }) {
  return (
    <div
      className="inline-flex flex-col items-center rounded-xl border px-6 py-4"
      style={{ borderColor: "var(--gold)", background: "var(--accent-subtle)" }}
    >
      <span className="royal-title text-3xl font-semibold" style={{ color: "var(--navy)" }}>
        {display}
      </span>
      <span className="royal-kicker mt-1 text-[10px]">{label}</span>
    </div>
  );
}

export default function ImpactCounter({ hasConvex }: { hasConvex: boolean }) {
  const { lang } = useLang();
  const fc = featureCopy(lang);
  if (hasConvex) return <ImpactCounterConvex />;
  return <ImpactDisplay display="1,280+" label={fc.impactLabel} />;
}
