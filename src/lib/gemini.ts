import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type ResponseLang = "ur" | "en";

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

export function buildSystemInstruction(lang: ResponseLang): string {
  return lang === "ur" ? SYSTEM_PROMPT_UR : SYSTEM_PROMPT_EN;
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
