import { NextRequest, NextResponse } from "next/server";
import {
  analyzeText,
  analyzeImage,
  analyzePrescriptionImageStructured,
  type ResponseLang,
} from "@/lib/gemini";
import {
  findFallbackMedicine,
  formatFallbackAsResponse,
} from "@/lib/fallback-medicines";
import type { MedicineResult, PrescriptionAnalysisJson } from "@/types";
import { enforceApiRateLimit } from "@/lib/rate-limit";

function mapStructuredToMedicineResults(p: PrescriptionAnalysisJson): MedicineResult[] {
  return p.medications.map((m, i) => {
    const dosage = [m.dosage.en, m.dosage.ur].filter(Boolean).join(" — ");
    const timing = [m.timing.en, m.timing.ur].filter(Boolean).join(" — ");
    const route = [m.route.en, m.route.ur].filter(Boolean).join(" — ");
    return {
      name: m.name.en ?? m.name.ur ?? "",
      nameUrdu: m.name.ur ?? m.name.en ?? "",
      purpose: "",
      dosage,
      timing,
      foodWarnings: "",
      stopInstructions: "",
      warnings: route,
      rawResponse: `structured-med-${i}`,
    };
  });
}

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
      new RegExp(
        `${escaped}\\s*[:\\-]\\s*(.+?)(?=\\n[A-Za-z\u0600-\u06FF\u0900-\u097F]|$)`,
        "ms"
      ),
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
  } else if (lang === "hi") {
    const re =
      /नुस्खे\s*का\s*सारांश\s*[:：]\s*([\s\S]+?)(?=\n\s*-{3,}\s*\n|\n\s*दवा\s*का\s*नाम\s*[:：])/i;
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
  const nameLabelsHi = ["दवा का नाम", "Medicine name"];

  const purposeLabelsUr = ["یہ کس لیے ہے", "کس لیے", "استعمال"];
  const purposeLabelsEn = ["What it's for", "What it treats", "Purpose"];
  const purposeLabelsHi = ["यह किस लिए है", "किस लिए", "उपयोग"];

  const dosageLabelsUr = ["کتنی لینی ہے", "خوراک", "مقدار"];
  const dosageLabelsEn = ["Dosage", "Dose", "How much"];
  const dosageLabelsHi = ["कितनी लेनी है", "खुराक", "मात्रा"];

  const timingLabelsUr = ["کب لینی ہے", "وقت", "کب لیں"];
  const timingLabelsEn = ["When to take", "Timing", "Schedule"];
  const timingLabelsHi = ["कब लेनी है", "समय", "कब लें"];

  const foodLabelsUr = ["کھانے سے پرہیز", "پرہیز", "کھانے"];
  const foodLabelsEn = [
    "Food and drink cautions",
    "Food cautions",
    "Food / drink",
    "Dietary cautions",
  ];
  const foodLabelsHi = ["खान-पान में परहेज", "परहेज", "खाना"];

  const stopLabelsUr = ["کب بند کریں", "بند کریں", "دورانیہ"];
  const stopLabelsEn = ["When to stop", "Stopping"];
  const stopLabelsHi = ["कब बंद करें", "बंद करें"];

  const warnLabelsUr = ["خبردار", "انتباہ", "⚠️", "خطرہ"];
  const warnLabelsEn = ["Warnings", "Warning", "Cautions", "Important"];
  const warnLabelsHi = ["चेतावनी", "⚠️", "खतरा"];

  const results: MedicineResult[] = [];

  for (const section of sections) {
    const rawName =
      lang === "ur"
        ? extractField(section, nameLabelsUr)
        : lang === "hi"
          ? extractField(section, nameLabelsHi)
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
    } else if (lang === "hi" || lang === "en") {
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
        : lang === "hi"
          ? extractField(section, purposeLabelsHi)
          : extractField(section, purposeLabelsEn);
    const dosage =
      lang === "ur"
        ? extractField(section, dosageLabelsUr)
        : lang === "hi"
          ? extractField(section, dosageLabelsHi)
          : extractField(section, dosageLabelsEn);
    const timing =
      lang === "ur"
        ? extractField(section, timingLabelsUr)
        : lang === "hi"
          ? extractField(section, timingLabelsHi)
          : extractField(section, timingLabelsEn);
    const foodWarnings =
      lang === "ur"
        ? extractField(section, foodLabelsUr)
        : lang === "hi"
          ? extractField(section, foodLabelsHi)
          : extractField(section, foodLabelsEn);
    const stopInstructions =
      lang === "ur"
        ? extractField(section, stopLabelsUr)
        : lang === "hi"
          ? extractField(section, stopLabelsHi)
          : extractField(section, stopLabelsEn);
    const warnings =
      lang === "ur"
        ? extractField(section, warnLabelsUr)
        : lang === "hi"
          ? extractField(section, warnLabelsHi)
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
      nameUrdu:
        lang === "ur"
          ? "دوا کی معلومات"
          : lang === "hi"
            ? "दवा की जानकारी"
            : "Medicine information",
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
        : lang === "hi"
          ? "कृपया दवा का नाम या तस्वीर भेजें।"
          : "Please provide a medicine name or an image.",
    apiUnavailable: (name: string) =>
      lang === "ur"
        ? `"${name}" کی معلومات ابھی دستیاب نہیں۔ API سے رابطہ نہیں ہو سکا۔ انٹرنیٹ چیک کریں۔`
        : lang === "hi"
          ? `"${name}" की जानकारी अभी उपलब्ध नहीं। API तक नहीं पहुँच सके। इंटरनेट जाँचें।`
          : `Information for "${name}" is not available right now. Could not reach the API. Check your connection.`,
    imageError:
      lang === "ur"
        ? "تصویر پڑھنے میں مسئلہ ہوا۔ براہ کرم واضح تصویر دوبارہ اپلوڈ کریں۔"
        : lang === "hi"
          ? "तस्वीर नहीं पढ़ी जा सकी। कृपया स्पष्ट फोटो अपलोड करें।"
          : "Could not read the image. Please upload a clearer photo.",
    server:
      lang === "ur"
        ? "سرور میں مسئلہ ہوا۔ براہ کرم دوبارہ کوشش کریں۔"
        : lang === "hi"
          ? "सर्वर में समस्या हुई। कृपया फिर कोशिश करें।"
          : "Something went wrong on the server. Please try again.",
  };
}

export async function POST(request: NextRequest) {
  let lang: ResponseLang = "ur";
  try {
    const limited = await enforceApiRateLimit(request, "analyze");
    if (limited) return limited;

    const body = await request.json();
    const { text, image, lang: rawLang } = body;
    lang =
      rawLang === "en" ? "en" : rawLang === "hi" ? "hi" : "ur";
    const err = errorMessages(lang);

    if (!text && !image) {
      return NextResponse.json({ error: err.badRequest }, { status: 400 });
    }

    let rawText = "";
    let usedFallback = false;

    let prescriptionAnalysis: PrescriptionAnalysisJson | undefined;

    try {
      if (image) {
        try {
          prescriptionAnalysis = await analyzePrescriptionImageStructured(image);
          const medicines = mapStructuredToMedicineResults(prescriptionAnalysis);
          return NextResponse.json({
            medicines,
            rawText: JSON.stringify(prescriptionAnalysis),
            prescriptionSummary: prescriptionAnalysis.patient_name ?? undefined,
            prescriptionAnalysis,
            usedFallback: false,
          });
        } catch (structuredErr) {
          console.warn("Structured prescription analysis failed, using legacy text format:", structuredErr);
          rawText = await analyzeImage(image, "image/jpeg", lang);
        }
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
      prescriptionAnalysis,
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
