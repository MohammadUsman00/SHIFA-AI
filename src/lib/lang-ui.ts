import type { Lang } from "./translations";

export function bodyFontVar(lang: Lang): string {
  if (lang === "ur") return "var(--font-urdu)";
  if (lang === "hi") return "var(--font-hindi)";
  return "var(--font-inter)";
}

export function scriptUiClass(lang: Lang): string {
  if (lang === "ur") return "urdu-ui";
  if (lang === "hi") return "hindi-ui";
  return "";
}

export function scriptTitleClass(lang: Lang): string {
  if (lang === "ur") return "urdu-title";
  if (lang === "hi") return "hindi-title";
  return "";
}
