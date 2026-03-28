import { NextRequest, NextResponse } from "next/server";
import { analyzeText, analyzeImage, type ResponseLang } from "@/lib/gemini";
import {
  findFallbackMedicine,
  formatFallbackAsResponse,
} from "@/lib/fallback-medicines";
import { MedicineResult } from "@/types";

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/`/g, "")
    .trim();
}

function extractField(section: string, labels: string[]): string {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`${escaped}\\s*[:\\-]\\s*(.+?)(?=\\n[A-Za-z\u0600-\u06FF]|$)`, "ms"),
      new RegExp(`${escaped}\\s*[:\\-]\\s*(.+?)(?=\\n|$)`, "m"),
    ];
    for (const regex of patterns) {
      const match = section.match(regex);
      if (match?.[1]?.trim()) {
        return cleanMarkdown(match[1].trim());
      }
    }
  }
  return "";
}

function splitPrescriptionSummary(
  cleaned: string,
  lang: ResponseLang
): { summary?: string; rest: string } {
  if (lang === "ur") {
    const re =
      /نسخے\s*کا\s*خلاصہ\s*[:：]\s*([\s\S]+?)(?=\n\s*-{3,}\s*\n|\n\s*دوا\s*کا\s*نام\s*[:：])/i;
    const m = cleaned.match(re);
    if (m?.[1]?.trim()) {
      let rest = cleaned.replace(re, "").trim();
      rest = rest.replace(/^\s*-{3,}\s*\n?/, "").trim();
      return { summary: m[1].trim(), rest };
    }
  } else {
    const re =
      /Prescription\s+summary\s*[:：]\s*([\s\S]+?)(?=\n\s*-{3,}\s*\n|\n\s*Medicine\s+name\s*[:：])/i;
    const m = cleaned.match(re);
    if (m?.[1]?.trim()) {
      let rest = cleaned.replace(re, "").trim();
      rest = rest.replace(/^\s*-{3,}\s*\n?/, "").trim();
      return { summary: m[1].trim(), rest };
    }
  }
  return { rest: cleaned };
}

function parseGeminiResponse(
  rawText: string,
  lang: ResponseLang
): { medicines: MedicineResult[]; prescriptionSummary?: string } {
  const cleaned = cleanMarkdown(rawText);
  const { summary, rest } = splitPrescriptionSummary(cleaned, lang);
  const body = rest || cleaned;

  const sections = body
    .split(/\n\s*---\s*\n|\n\s*-{3,}\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  if (sections.length === 0) {
    sections.push(body);
  }

  const nameLabelsUr = ["دوا کا نام"];
  const nameLabelsEn = ["Medicine name", "Drug name", "Medication name"];

  const purposeLabelsUr = ["یہ کس لیے ہے", "کس لیے", "استعمال"];
  const purposeLabelsEn = ["What it's for", "What it treats", "Purpose"];

  const dosageLabelsUr = ["کتنی لینی ہے", "خوراک", "مقدار"];
  const dosageLabelsEn = ["Dosage", "Dose", "How much"];

  const timingLabelsUr = ["کب لینی ہے", "وقت", "کب لیں"];
  const timingLabelsEn = ["When to take", "Timing", "Schedule"];

  const foodLabelsUr = ["کھانے سے پرہیز", "پرہیز", "کھانے"];
  const foodLabelsEn = [
    "Food and drink cautions",
    "Food cautions",
    "Food / drink",
    "Dietary cautions",
  ];

  const stopLabelsUr = ["کب بند کریں", "بند کریں", "دورانیہ"];
  const stopLabelsEn = ["When to stop", "Stopping"];

  const warnLabelsUr = ["خبردار", "انتباہ", "⚠️", "خطرہ"];
  const warnLabelsEn = ["Warnings", "Warning", "Cautions", "Important"];

  const results: MedicineResult[] = [];

  for (const section of sections) {
    const rawName =
      lang === "ur"
        ? extractField(section, nameLabelsUr)
        : extractField(section, nameLabelsEn);

    if (!rawName || rawName.length < 2) continue;

    let name = "";
    let nameUrduField = "";

    if (lang === "ur") {
      const paren = rawName.match(/\(([^)]+)\)/);
      const en = paren?.[1]?.trim() ?? "";
      const ur = rawName.replace(/\([^)]+\)/, "").trim();
      name = en || ur;
      nameUrduField = ur || rawName;
    } else {
      const paren = rawName.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
      if (paren) {
        name = paren[1].trim();
        nameUrduField = paren[2].trim();
      } else {
        name = rawName.trim();
        nameUrduField = rawName.trim();
      }
    }

    const purpose =
      lang === "ur"
        ? extractField(section, purposeLabelsUr)
        : extractField(section, purposeLabelsEn);
    const dosage =
      lang === "ur"
        ? extractField(section, dosageLabelsUr)
        : extractField(section, dosageLabelsEn);
    const timing =
      lang === "ur"
        ? extractField(section, timingLabelsUr)
        : extractField(section, timingLabelsEn);
    const foodWarnings =
      lang === "ur"
        ? extractField(section, foodLabelsUr)
        : extractField(section, foodLabelsEn);
    const stopInstructions =
      lang === "ur"
        ? extractField(section, stopLabelsUr)
        : extractField(section, stopLabelsEn);
    const warnings =
      lang === "ur"
        ? extractField(section, warnLabelsUr)
        : extractField(section, warnLabelsEn);

    results.push({
      name,
      nameUrdu: nameUrduField,
      purpose,
      dosage,
      timing,
      foodWarnings,
      stopInstructions,
      warnings,
      rawResponse: section.trim(),
    });
  }

  if (results.length === 0 && body.length > 30) {
    results.push({
      name: "",
      nameUrdu: lang === "ur" ? "دوا کی معلومات" : "Medicine information",
      purpose: "",
      dosage: "",
      timing: "",
      foodWarnings: "",
      stopInstructions: "",
      warnings: "",
      rawResponse: body,
    });
  }

  return { medicines: results, prescriptionSummary: summary };
}

function errorMessages(lang: ResponseLang) {
  return {
    badRequest:
      lang === "ur"
        ? "دوا کا نام یا تصویر دیں"
        : "Please provide a medicine name or an image.",
    apiUnavailable: (name: string) =>
      lang === "ur"
        ? `"${name}" کی معلومات ابھی دستیاب نہیں۔ API سے رابطہ نہیں ہو سکا۔ انٹرنیٹ چیک کریں۔`
        : `Information for "${name}" is not available right now. Could not reach the API. Check your connection.`,
    imageError:
      lang === "ur"
        ? "تصویر پڑھنے میں مسئلہ ہوا۔ براہ کرم واضح تصویر دوبارہ اپلوڈ کریں۔"
        : "Could not read the image. Please upload a clearer photo.",
    server:
      lang === "ur"
        ? "سرور میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔"
        : "Something went wrong on the server. Please try again.",
  };
}

export async function POST(request: NextRequest) {
  let lang: ResponseLang = "ur";
  try {
    const body = await request.json();
    const { text, image, lang: rawLang } = body;
    lang = rawLang === "en" ? "en" : "ur";
    const err = errorMessages(lang);

    if (!text && !image) {
      return NextResponse.json({ error: err.badRequest }, { status: 400 });
    }

    let rawText: string;
    let usedFallback = false;

    try {
      if (image) {
        rawText = await analyzeImage(image, "image/jpeg", lang);
      } else {
        rawText = await analyzeText(text, lang);
      }
    } catch (apiError) {
      console.error("Gemini API error:", apiError);

      if (text) {
        const fallback = findFallbackMedicine(text);
        if (fallback) {
          rawText = formatFallbackAsResponse(fallback, lang);
          usedFallback = true;
        } else {
          return NextResponse.json({
            medicines: [],
            rawText: "",
            error: err.apiUnavailable(text),
          });
        }
      } else {
        return NextResponse.json({
          medicines: [],
          rawText: "",
          error: err.imageError,
        });
      }
    }

    const { medicines, prescriptionSummary } = parseGeminiResponse(rawText, lang);

    return NextResponse.json({
      medicines,
      rawText,
      prescriptionSummary,
      usedFallback,
    });
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json({
      medicines: [],
      rawText: "",
      error: errorMessages(lang).server,
    });
  }
}
