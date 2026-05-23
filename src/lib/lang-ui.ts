import type { Lang } from "./translations";

/** Body copy for the active UI language */
export function bodyFontVar(lang: Lang): string {
  if (lang === "ur") return "var(--font-urdu)";
  if (lang === "hi") return "var(--font-hindi)";
  return "var(--font-sans)";
}

/** Latin UI chrome: labels, nav, kickers (English uses premium sans) */
export function chromeFontVar(lang: Lang): string {
  if (lang === "ur") return "var(--font-urdu)";
  if (lang === "hi") return "var(--font-hindi)";
  return "var(--font-sans)";
}

export function scriptUiClass(lang: Lang): string {
  if (lang === "ur") return "urdu-ui";
  if (lang === "hi") return "hindi-ui";
  return "";
}

export function scriptTitleClass(lang: Lang): string {
  if (lang === "ur") return "urdu-title";
  if (lang === "hi") return "hindi-title";
  return "display-heading";
}
