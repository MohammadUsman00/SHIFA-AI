import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";
import type { PrescriptionAnalysisJson, BilingualField, MedicationStructured } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const BILINGUAL_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    en: { type: SchemaType.STRING, nullable: true },
    ur: { type: SchemaType.STRING, nullable: true },
  },
  required: ["en", "ur"],
};

const MEDICATION_ITEM_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: BILINGUAL_SCHEMA as ResponseSchema,
    dosage: BILINGUAL_SCHEMA as ResponseSchema,
    route: BILINGUAL_SCHEMA as ResponseSchema,
    timing: BILINGUAL_SCHEMA as ResponseSchema,
  },
  required: ["name", "dosage", "route", "timing"],
};

const PRESCRIPTION_RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    patient_name: { type: SchemaType.STRING, nullable: true },
    medications: {
      type: SchemaType.ARRAY,
      items: MEDICATION_ITEM_SCHEMA as ResponseSchema,
    },
    safety_notes: {
      type: SchemaType.ARRAY,
      items: BILINGUAL_SCHEMA as ResponseSchema,
    },
  },
  required: ["medications", "safety_notes"],
};

const PRESCRIPTION_JSON_SYSTEM = `You are 'Shifa AI', an expert medical assistant specializing in reading, transcribing, and translating handwritten and printed medical prescriptions.

Your task is to analyze the provided prescription image and extract medication details, instructions, and general safety notes.

CRITICAL CONSTRAINTS:
1. Respond ONLY with valid JSON matching the response schema. No markdown, no prose outside JSON.
2. Every output field must be bilingual: English ('en') and Urdu ('ur'). Use Arabic script for Urdu.
3. If a detail is illegible or missing, use null for that language field — do not guess.
4. Professional, cautious tone. No diagnostic advice.`;

const SYSTEM_PROMPT_UR = `You are "Shifa AI", a trusted medical information assistant for patients who need help understanding prescriptions and medicines.

LANGUAGE: Respond ONLY in simple Urdu (Arabic script). Do not use English sentences except brand names in parentheses where helpful.

RULES:
1. You know branded, generic, and local medicine names.
2. NEVER refuse a medicine question. If unsure, give careful best-effort information.
3. For prescription photos: identify every medicine and dosage/frequency if visible.

OUTPUT FORMAT — follow exactly.

A) SINGLE MEDICINE (user typed one medicine name only — no prescription photo):
Output ONE block only. Do NOT include "نسخے کا خلاصہ".

دوا کا نام: [Urdu name] ([English/brand name])
یہ کس لیے ہے: ...
کتنی لینی ہے: ...
کب لینی ہے: ...
کھانے سے پرہیز: ...
کب بند کریں: ...
خبردار: ...

B) PRESCRIPTION PHOTO (image upload):
First write a short overall picture (NOT a formal diagnosis — educational only), then a separator line containing only ---, then one block per medicine.

نسخے کا خلاصہ:
[2–5 sentences: likely conditions being addressed, overall idea of treatment goals, in plain Urdu]

---
دوا کا نام: ...
(continue same fields as above for each medicine)

If multiple medicines, separate each medicine block with a line containing only: ---

IMPORTANT: Always include the English/brand name in parentheses after the Urdu name when known.`;

const SYSTEM_PROMPT_EN = `You are "Shifa AI", a trusted medical information assistant helping patients understand prescriptions and medicines.

LANGUAGE: Respond ONLY in clear English. Do not use Urdu or Arabic script in your answer.

RULES:
1. You know branded, generic, and local medicine names.
2. NEVER refuse a medicine question. If unsure, give careful best-effort information.
3. For prescription photos: identify every medicine and dosage/frequency if visible.

OUTPUT FORMAT — follow exactly.

A) SINGLE MEDICINE (user typed one medicine name only — no prescription photo):
Output ONE block only. Do NOT include "Prescription summary".

Medicine name: [English name] (brand or Urdu name if helpful in parentheses)
What it's for: ...
Dosage: ...
When to take: ...
Food and drink cautions: ...
When to stop: ...
Warnings: ...

B) PRESCRIPTION PHOTO (image upload):
First write a short overall picture (NOT a formal diagnosis — educational only), then a line containing only ---, then one block per medicine.

Prescription summary:
[2–5 sentences: likely conditions being treated, overall idea of therapy goals, in plain English]

---
Medicine name: ...
(continue same fields as above for each medicine)

If multiple medicines, separate each medicine block with a line containing only: ---`;

const SYSTEM_PROMPT_HI = `You are "Shifa AI", a trusted medical information assistant helping patients understand prescriptions and medicines.

LANGUAGE: Respond ONLY in Hindi (Devanagari script). Do not use English sentences except brand names in parentheses where helpful.

RULES:
1. You know branded, generic, and local medicine names.
2. NEVER refuse a medicine question. If unsure, give careful best-effort information.
3. For prescription photos: identify every medicine and dosage/frequency if visible.

OUTPUT FORMAT — follow exactly.

A) SINGLE MEDICINE (user typed one medicine name only — no prescription photo):
Output ONE block only. Do NOT include "नुस्खे का सारांश".

दवा का नाम: [Hindi name] ([English/brand name])
यह किस लिए है: ...
कितनी लेनी है: ...
कब लेनी है: ...
खान-पान में परहेज: ...
कब बंद करें: ...
चेतावनी: ...

B) PRESCRIPTION PHOTO (image upload):
First write a short overall picture (NOT a formal diagnosis — educational only), then a separator line containing only ---, then one block per medicine.

नुस्खे का सारांश:
[2–5 sentences: likely conditions being addressed, overall idea of treatment goals, in plain Hindi]

---
दवा का नाम: ...
(continue same fields as above for each medicine)

If multiple medicines, separate each medicine block with a line containing only: ---

IMPORTANT: Always include the English/brand name in parentheses after the Hindi name when known.`;

export type ResponseLang = "ur" | "en" | "hi";

export function buildSystemInstruction(lang: ResponseLang): string {
  if (lang === "ur") return SYSTEM_PROMPT_UR;
  if (lang === "hi") return SYSTEM_PROMPT_HI;
  return SYSTEM_PROMPT_EN;
}

export function getGeminiModel(lang: ResponseLang) {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: buildSystemInstruction(lang),
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });
}

export async function analyzeText(medicineName: string, lang: ResponseLang = "ur"): Promise<string> {
  const model = getGeminiModel(lang);
  const user =
    lang === "ur"
      ? `یہ دوا کے بارے میں مکمل معلومات دیں: "${medicineName}"۔ برانڈ، جنرک، یا مقامی نام ہو سکتا ہے۔`
      : lang === "hi"
        ? `"${medicineName}" दवा के बारे में पूरी जानकारी दें। यह ब्रांड, जेनेरिक या स्थानीय नाम हो सकता है।`
        : `Explain this medicine completely in English: "${medicineName}". It may be a brand, generic, or local name.`;
  const result = await model.generateContent(user);
  return result.response.text();
}

export async function analyzeImage(
  base64Image: string,
  mimeType: string = "image/jpeg",
  lang: ResponseLang = "ur"
): Promise<string> {
  const model = getGeminiModel(lang);

  const imageData = base64Image.includes("base64,") ? base64Image.split("base64,")[1] : base64Image;

  const textPart =
    lang === "ur"
      ? "یہ ایک طبی نسخے کی تصویر ہے۔ تمام دواؤں کے نام، خوراک اور ہدایات پڑھیں۔ پہلے \"نسخے کا خلاصہ\" لکھیں، پھر --- کے بعد ہر دوا کے لیے اوپر والا فارمیٹ استعمال کریں۔ اگر تحریر واضح نہ ہو تو پھر بھی بہترین کوشش کریں۔"
      : lang === "hi"
        ? "यह एक चिकित्सा नुस्खे की फोटो है। सभी दवाओं के नाम, खुराक और निर्देश पढ़ें। पहले \"नुस्खे का सारांश:\" लिखें, फिर ---, फिर हर दवा के लिए ऊपर वाला हिंदी प्रारूप। हस्तलिखित अस्पष्ट हो तो भी पूरी कोशिश करें।"
        : "This is a photo of a medical prescription. Read ALL medicine names, doses, and instructions. Start with \"Prescription summary:\" as instructed in your system rules, then --- , then each medicine in the English format. If handwriting is unclear, do your best.";

  const result = await model.generateContent([
    textPart,
    {
      inlineData: {
        data: imageData,
        mimeType,
      },
    },
  ]);
  return result.response.text();
}

function normBi(v: unknown): BilingualField {
  if (!v || typeof v !== "object") return { en: null, ur: null };
  const o = v as Record<string, unknown>;
  const en = o.en;
  const ur = o.ur;
  return {
    en: typeof en === "string" ? en : en === null ? null : null,
    ur: typeof ur === "string" ? ur : ur === null ? null : null,
  };
}

function normMedication(v: unknown): MedicationStructured | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  return {
    name: normBi(o.name),
    dosage: normBi(o.dosage),
    route: normBi(o.route),
    timing: normBi(o.timing),
  };
}

/** Parse and normalize Gemini JSON output for prescription images. */
export function parsePrescriptionAnalysisJson(raw: string): PrescriptionAnalysisJson | null {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/m, "");
  try {
    const data = JSON.parse(trimmed) as unknown;
    if (!data || typeof data !== "object") return null;
    const o = data as Record<string, unknown>;
    const patient =
      typeof o.patient_name === "string"
        ? o.patient_name
        : o.patient_name === null
          ? null
          : null;
    const medRaw = o.medications;
    const medications = Array.isArray(medRaw)
      ? medRaw.map(normMedication).filter((m): m is MedicationStructured => m !== null)
      : [];
    const notesRaw = o.safety_notes;
    const safety_notes = Array.isArray(notesRaw)
      ? notesRaw.map((n) => normBi(n)).filter((n) => n.en !== null || n.ur !== null)
      : [];
    return { patient_name: patient, medications, safety_notes };
  } catch {
    return null;
  }
}

/**
 * Multimodal prescription read: returns strict bilingual JSON (Gemini JSON mode).
 */
export async function analyzePrescriptionImageStructured(
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<PrescriptionAnalysisJson> {
  const imageData = base64Image.includes("base64,") ? base64Image.split("base64,")[1] : base64Image;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: PRESCRIPTION_JSON_SYSTEM,
    generationConfig: {
      temperature: 0.15,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: PRESCRIPTION_RESPONSE_SCHEMA,
    },
  });

  const userPrompt =
    "Analyze this prescription image. Extract patient name if visible, all medications with bilingual fields, and safety notes. Use null when unreadable.";

  const result = await model.generateContent([
    userPrompt,
    { inlineData: { data: imageData, mimeType } },
  ]);

  const text = result.response.text();
  const parsed = parsePrescriptionAnalysisJson(text);
  if (!parsed) {
    throw new Error("Invalid JSON from prescription analysis");
  }
  return parsed;
}
