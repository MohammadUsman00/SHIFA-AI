import { GoogleGenerativeAI } from "@google/generative-ai";
import type { MedicationStructured } from "@/types";
import type { ResponseLang } from "@/lib/gemini";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function rxFollowUpChat(
  message: string,
  contextSummary: string,
  lang: ResponseLang
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are Shifa AI, a patient education assistant. Answer ONLY about the prescription/medicines in the context below.
Never diagnose, prescribe, or tell the user to stop/start medicines. Always say to confirm with their doctor for medical decisions.
Respond in ${lang === "ur" ? "simple Urdu (Arabic script)" : lang === "hi" ? "simple Hindi (Devanagari)" : "clear English"}.
Keep answers under 120 words.`,
    generationConfig: { temperature: 0.35, maxOutputTokens: 512 },
  });

  const result = await model.generateContent(
    `Context:\n${contextSummary}\n\nUser question:\n${message}`
  );
  return result.response.text();
}

export async function simplifyMedicalText(text: string, lang: ResponseLang): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
  });

  const langInstr =
    lang === "ur"
      ? "Rewrite in very simple Urdu that a child could understand."
      : lang === "hi"
        ? "Rewrite in very simple Hindi that a child could understand."
        : "Rewrite in very simple English that a child could understand.";

  const result = await model.generateContent(
    `${langInstr} Keep all medicine names. Add disclaimer: ask your doctor. Text:\n\n${text}`
  );
  return result.response.text();
}

export async function checkMedicationInteractions(
  medications: MedicationStructured[],
  lang: ResponseLang
): Promise<string> {
  const list = medications
    .map((m, i) => `${i + 1}. ${m.name.en || m.name.ur} — ${m.dosage.en || m.dosage.ur}`)
    .join("\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are a cautious pharmacy educator. List 2-4 general points patients should ASK their doctor about when taking these medicines together.
Do NOT say "do not take" or diagnose. Use ${lang === "ur" ? "Urdu" : lang === "hi" ? "Hindi" : "English"}.
Bullet points only. Under 100 words.`,
    generationConfig: { temperature: 0.25, maxOutputTokens: 400 },
  });

  const result = await model.generateContent(`Medicines on prescription:\n${list}`);
  return result.response.text();
}
