import type { Lang } from "@/lib/translations";

/**
 * System prompt for medicine explanation (JSON-oriented; optional for structured flows).
 */
export function getMedicineSystemPrompt(lang: Lang): string {
  const langInstructions = {
    en: `You are a medical assistant helping patients understand their prescriptions.
Always respond in ENGLISH.
Use simple, clear language that anyone can understand.`,

    ur: `آپ ایک طبی معاون ہیں جو مریضوں کو ان کے نسخے سمجھنے میں مدد کرتے ہیں۔
ہمیشہ اردو (نستعلیق) میں جواب دیں۔
آسان اور سادہ زبان استعمال کریں جو ایک عام آدمی سمجھ سکے۔`,

    hi: `आप एक चिकित्सा सहायक हैं जो मरीजों को उनके नुस्खे समझने में मदद करते हैं।
हमेशा हिंदी में उत्तर दें।
सरल और स्पष्ट भाषा का उपयोग करें जो एक आम व्यक्ति समझ सके।`,
  };

  const formatInstructions = {
    en: `ALWAYS respond in this EXACT JSON format:
{
  "medicineName": "Full medicine name",
  "class": "Drug class/category",
  "usedFor": "What condition it treats — 1-2 sentences",
  "dosage": "Exact dosage instructions",
  "timing": "When to take — before/after food, morning/night etc",
  "foodWarning": "Foods or drinks to avoid",
  "stopWhen": "When to stop taking the medicine",
  "warning": "Any serious warning or side effect. If none, write: No special risk",
  "safeToUse": true or false
}`,

    ur: `ہمیشہ اس EXACT JSON فارمیٹ میں جواب دیں:
{
  "medicineName": "دوا کا مکمل نام",
  "class": "دوا کی قسم",
  "usedFor": "یہ کس بیماری کے لیے ہے — 1-2 جملے",
  "dosage": "خوراک کی ہدایات",
  "timing": "کب لینی ہے — کھانے سے پہلے/بعد، صبح/رات",
  "foodWarning": "کون سا کھانا یا مشروب نہ لیں",
  "stopWhen": "دوا کب بند کریں",
  "warning": "کوئی سنگین خطرہ یا مضر اثر۔ اگر نہیں تو لکھیں: کوئی خاص خطرہ نہیں",
  "safeToUse": true یا false
}`,

    hi: `हमेशा इस EXACT JSON फ़ॉर्मेट में उत्तर दें:
{
  "medicineName": "दवा का पूरा नाम",
  "class": "दवा की श्रेणी",
  "usedFor": "यह किस बीमारी के लिए है — 1-2 वाक्य",
  "dosage": "खुराक के निर्देश",
  "timing": "कब लेनी है — खाने से पहले/बाद, सुबह/रात",
  "foodWarning": "कौन सा खाना या पेय न लें",
  "stopWhen": "दवा कब बंद करें",
  "warning": "कोई गंभीर चेतावनी या दुष्प्रभाव। यदि नहीं तो लिखें: कोई विशेष खतरा नहीं",
  "safeToUse": true या false
}`,
  };

  return `${langInstructions[lang]}

${formatInstructions[lang]}

CRITICAL: Output ONLY valid JSON. No markdown. No extra text. No code blocks.`;
}

export function getMedicineUserPrompt(medicineName: string, lang: Lang): string {
  const prompts = {
    en: `Explain this medicine clearly: ${medicineName}`,
    ur: `اس دوا کی وضاحت کریں: ${medicineName}`,
    hi: `इस दवा की जानकारी दें: ${medicineName}`,
  };
  return prompts[lang];
}

export function getPrescriptionSystemPrompt(lang: Lang): string {
  const base = {
    en: `You are an expert at reading medical prescriptions — handwritten, printed, or mixed language.
Extract ALL medicine names from the prescription image.
Then explain each medicine simply in ENGLISH.`,

    ur: `آپ طبی نسخے پڑھنے کے ماہر ہیں — ہاتھ سے لکھے، پرنٹ کیے، یا مخلوط زبان میں۔
نسخے کی تصویر سے تمام دوائوں کے نام نکالیں۔
پھر ہر دوا کو اردو میں آسانی سے سمجھائیں۔`,

    hi: `आप चिकित्सा नुस्खे पढ़ने के विशेषज्ञ हैं — हस्तलिखित, मुद्रित, या मिश्रित भाषा में।
नुस्खे की तस्वीर से सभी दवाओं के नाम निकालें।
फिर प्रत्येक दवा को हिंदी में सरल भाषा में समझाएं।`,
  };

  return `${base[lang]}

Respond in this EXACT JSON format:
{
  "medicines": [
    {
      "medicineName": "...",
      "class": "...",
      "usedFor": "...",
      "dosage": "...",
      "timing": "...",
      "foodWarning": "...",
      "stopWhen": "...",
      "warning": "...",
      "safeToUse": true
    }
  ],
  "prescriptionNote": "Any general note about this prescription",
  "doctorInstructions": "Any special instructions visible"
}

Output ONLY valid JSON. No markdown.`;
}

export function buildExaQuery(medicineName: string): string {
  return `${medicineName} medicine dosage side effects food interactions warnings patient guide`;
}

export function getEnrichmentPrompt(medicineName: string, exaContent: string, lang: Lang): string {
  const intro = {
    en: `Using this verified medical information, explain the medicine "${medicineName}":`,
    ur: `اس تصدیق شدہ طبی معلومات کا استعمال کرتے ہوئے، دوا "${medicineName}" کی وضاحت کریں:`,
    hi: `इस सत्यापित चिकित्सा जानकारी का उपयोग करके, दवा "${medicineName}" की जानकारी दें:`,
  };

  return `${intro[lang]}

VERIFIED SOURCE CONTENT:
${exaContent}

${getMedicineSystemPrompt(lang)}`;
}
