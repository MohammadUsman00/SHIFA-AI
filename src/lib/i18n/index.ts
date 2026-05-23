import type { Lang } from "../translations";

export type { Lang };

export const languages = [
  { code: "en" as Lang, label: "EN", nativeLabel: "English", dir: "ltr" as const },
  { code: "ur" as Lang, label: "اردو", nativeLabel: "اردو", dir: "rtl" as const },
  { code: "hi" as Lang, label: "हिंदी", nativeLabel: "हिंदी", dir: "ltr" as const },
];

export function fontClass(lang: Lang): string {
  if (lang === "ur") return "font-urdu";
  if (lang === "hi") return "font-hindi";
  return "";
}

export function dir(lang: Lang): "ltr" | "rtl" {
  return lang === "ur" ? "rtl" : "ltr";
}
