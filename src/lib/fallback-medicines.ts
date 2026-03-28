import { FallbackMedicine } from "@/types";
import type { ResponseLang } from "@/lib/gemini";

export const fallbackMedicines: FallbackMedicine[] = [
  {
    nameEn: "Paracetamol",
    nameUrdu: "پیراسیٹامول",
    purpose: "بخار اور درد کم کرنے کے لیے استعمال ہوتی ہے",
    dosage: "بڑوں کے لیے ایک یا دو گولیاں (500mg)",
    timing: "ہر 6 گھنٹے بعد، کھانے کے بعد",
    foodWarnings: "شراب سے پرہیز کریں",
    stopInstructions: "3 دن سے زیادہ استعمال نہ کریں، ڈاکٹر سے ملیں",
    warnings: "زیادہ مقدار جگر کو نقصان پہنچا سکتی ہے",
  },
  {
    nameEn: "Metformin",
    nameUrdu: "میٹفارمن",
    purpose: "شوگر (ذیابیطس ٹائپ 2) کے لیے",
    dosage: "ایک گولی (500mg) دن میں دو بار",
    timing: "کھانے کے ساتھ، صبح اور رات",
    foodWarnings: "میٹھی چیزوں سے پرہیز",
    stopInstructions: "ڈاکٹر کی اجازت کے بغیر بند نہ کریں",
    warnings: "پیٹ میں تکلیف ہو سکتی ہے، خالی پیٹ نہ لیں",
  },
  {
    nameEn: "Amoxicillin",
    nameUrdu: "اموکسیسلن",
    purpose: "انفیکشن (جراثیم) کے خلاف اینٹی بائیوٹک",
    dosage: "ایک کیپسول (500mg) دن میں تین بار",
    timing: "ہر 8 گھنٹے بعد، کھانے سے پہلے یا بعد",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "پورا کورس مکمل کریں، بیچ میں نہ چھوڑیں",
    warnings: "الرجی ہو تو فوراً بند کریں اور ڈاکٹر کو بتائیں",
  },
  {
    nameEn: "Omeprazole",
    nameUrdu: "اومیپرازول",
    purpose: "معدے کی تیزابیت اور السر کے لیے",
    dosage: "ایک کیپسول (20mg) دن میں ایک بار",
    timing: "صبح خالی پیٹ، کھانے سے 30 منٹ پہلے",
    foodWarnings: "مسالے دار کھانے سے پرہیز",
    stopInstructions: "2 ہفتے سے زیادہ بغیر ڈاکٹر کی مشورے کے نہ لیں",
    warnings: "طویل استعمال سے ہڈیاں کمزور ہو سکتی ہیں",
  },
  {
    nameEn: "Amlodipine",
    nameUrdu: "املوڈیپین",
    purpose: "ہائی بلڈ پریشر کے لیے",
    dosage: "ایک گولی (5mg) دن میں ایک بار",
    timing: "روزانہ ایک ہی وقت پر",
    foodWarnings: "چکنائی والے کھانے کم کھائیں، نمک کم کریں",
    stopInstructions: "ڈاکٹر کی اجازت کے بغیر کبھی بند نہ کریں",
    warnings: "سر درد اور پاؤں میں سوجن ہو سکتی ہے",
  },
  {
    nameEn: "Atorvastatin",
    nameUrdu: "ایٹورواسٹیٹن",
    purpose: "کولیسٹرول کم کرنے کے لیے",
    dosage: "ایک گولی (10-20mg) رات کو",
    timing: "رات کو سونے سے پہلے",
    foodWarnings: "چکنائی والے کھانے سے پرہیز",
    stopInstructions: "ڈاکٹر کی اجازت کے بغیر بند نہ کریں",
    warnings: "پٹھوں میں درد ہو تو ڈاکٹر کو بتائیں",
  },
  {
    nameEn: "Cetirizine",
    nameUrdu: "سیٹیریزین",
    purpose: "الرجی، چھینکیں، خارش کے لیے",
    dosage: "ایک گولی (10mg) دن میں ایک بار",
    timing: "رات کو سونے سے پہلے",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "جب الرجی ختم ہو جائے تو بند کر دیں",
    warnings: "نیند آ سکتی ہے، گاڑی نہ چلائیں",
  },
  {
    nameEn: "Azithromycin",
    nameUrdu: "ازیتھرومائسن",
    purpose: "انفیکشن کے لیے اینٹی بائیوٹک",
    dosage: "ایک گولی (500mg) دن میں ایک بار",
    timing: "3 دن تک، کھانے سے 1 گھنٹہ پہلے",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "پورا 3 دن کا کورس مکمل کریں",
    warnings: "پیٹ خراب ہو سکتا ہے، دل کے مریض ڈاکٹر کو بتائیں",
  },
  {
    nameEn: "Ibuprofen",
    nameUrdu: "آئبوپروفین",
    purpose: "درد، سوجن اور بخار کے لیے",
    dosage: "ایک یا دو گولیاں (200-400mg)",
    timing: "کھانے کے بعد، ہر 6-8 گھنٹے بعد",
    foodWarnings: "خالی پیٹ نہ لیں، شراب سے پرہیز",
    stopInstructions: "3 دن سے زیادہ نہ لیں بغیر ڈاکٹر کی مشورے",
    warnings: "معدے میں تکلیف ہو سکتی ہے، گردوں کے مریض ڈاکٹر سے پوچھیں",
  },
  {
    nameEn: "Losartan",
    nameUrdu: "لوسارٹن",
    purpose: "ہائی بلڈ پریشر اور گردوں کی حفاظت",
    dosage: "ایک گولی (50mg) دن میں ایک بار",
    timing: "روزانہ ایک ہی وقت پر",
    foodWarnings: "نمک کم کھائیں، پوٹاشیم والے پھل زیادہ نہ کھائیں",
    stopInstructions: "اچانک بند نہ کریں",
    warnings: "چکر آ سکتے ہیں، حمل میں سختی سے منع ہے",
  },
  {
    nameEn: "Ciprofloxacin",
    nameUrdu: "سپروفلوکساسین",
    purpose: "شدید انفیکشن کے لیے اینٹی بائیوٹک",
    dosage: "ایک گولی (500mg) دن میں دو بار",
    timing: "صبح اور رات، کھانے سے پہلے یا بعد",
    foodWarnings: "دودھ اور دہی کے ساتھ نہ لیں",
    stopInstructions: "پورا کورس مکمل کریں (5-7 دن)",
    warnings: "جوڑوں میں درد ہو تو فوراً بند کریں، بچوں کو نہ دیں",
  },
  {
    nameEn: "Pantoprazole",
    nameUrdu: "پینٹوپرازول",
    purpose: "معدے کی تیزابیت اور سینے کی جلن",
    dosage: "ایک گولی (40mg) دن میں ایک بار",
    timing: "صبح خالی پیٹ",
    foodWarnings: "مسالے دار اور تلے ہوئے کھانے سے پرہیز",
    stopInstructions: "4-8 ہفتے کا کورس، ڈاکٹر سے مشورہ کریں",
    warnings: "طویل استعمال سے ہڈیاں کمزور ہو سکتی ہیں",
  },
  {
    nameEn: "Montelukast",
    nameUrdu: "مونٹیلوکاسٹ",
    purpose: "دمہ اور الرجی کے لیے",
    dosage: "ایک گولی (10mg) رات کو",
    timing: "سونے سے پہلے",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "ڈاکٹر کی اجازت کے بغیر بند نہ کریں",
    warnings: "موڈ میں تبدیلی آئے تو ڈاکٹر کو فوراً بتائیں",
  },
  {
    nameEn: "Metoprolol",
    nameUrdu: "میٹوپرولول",
    purpose: "بلڈ پریشر اور دل کی دھڑکن کنٹرول",
    dosage: "ایک گولی (25-50mg) دن میں دو بار",
    timing: "کھانے کے ساتھ",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "اچانک بند نہ کریں، آہستہ آہستہ کم کریں",
    warnings: "چکر اور تھکاوٹ ہو سکتی ہے",
  },
  {
    nameEn: "Aspirin",
    nameUrdu: "ایسپرین",
    purpose: "خون پتلا کرنے اور دل کی حفاظت",
    dosage: "ایک چھوٹی گولی (75mg) روزانہ",
    timing: "کھانے کے بعد",
    foodWarnings: "خالی پیٹ نہ لیں",
    stopInstructions: "دل کے مریض ڈاکٹر سے پوچھے بغیر بند نہ کریں",
    warnings: "خون بہنے کا خطرہ بڑھ سکتا ہے، آپریشن سے پہلے ڈاکٹر کو بتائیں",
  },
  {
    nameEn: "Diclofenac",
    nameUrdu: "ڈائکلوفینک",
    purpose: "جوڑوں کا درد اور سوجن",
    dosage: "ایک گولی (50mg) دن میں دو بار",
    timing: "کھانے کے بعد",
    foodWarnings: "خالی پیٹ نہ لیں",
    stopInstructions: "5-7 دن سے زیادہ نہ لیں",
    warnings: "معدے اور گردوں پر اثر ہو سکتا ہے",
  },
  {
    nameEn: "Ceftriaxone",
    nameUrdu: "سیفٹریاکسون",
    purpose: "شدید انفیکشن کے لیے انجکشن",
    dosage: "ڈاکٹر کے مطابق (عام طور پر 1g)",
    timing: "دن میں ایک بار، انجکشن کے ذریعے",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "پورا کورس مکمل کریں",
    warnings: "صرف ڈاکٹر کی نگرانی میں لگوائیں، الرجی ٹیسٹ ضروری ہے",
  },
  {
    nameEn: "Levothyroxine",
    nameUrdu: "لیووتھائروکسین",
    purpose: "تھائیرائیڈ کم ہونے پر",
    dosage: "ایک گولی (25-100mcg) صبح",
    timing: "صبح خالی پیٹ، کھانے سے 30-60 منٹ پہلے",
    foodWarnings: "کیلشیم اور آئرن کی گولیوں سے 4 گھنٹے کا فاصلہ رکھیں",
    stopInstructions: "زندگی بھر لینی پڑ سکتی ہے، بند نہ کریں",
    warnings: "دل کی دھڑکن تیز ہو تو ڈاکٹر کو بتائیں",
  },
  {
    nameEn: "Ranitidine",
    nameUrdu: "رینیٹیڈین",
    purpose: "معدے کی تیزابیت اور السر",
    dosage: "ایک گولی (150mg) دن میں دو بار",
    timing: "کھانے سے 30 منٹ پہلے",
    foodWarnings: "مسالے دار کھانے سے پرہیز",
    stopInstructions: "2-4 ہفتے کا کورس",
    warnings: "لمبے عرصے تک استعمال سے پرہیز کریں",
  },
  {
    nameEn: "Doxycycline",
    nameUrdu: "ڈوکسی سائکلین",
    purpose: "انفیکشن اور ملیریا سے بچاؤ",
    dosage: "ایک کیپسول (100mg) دن میں دو بار",
    timing: "کھانے کے بعد، کافی پانی کے ساتھ",
    foodWarnings: "دودھ، دہی اور اینٹاسڈ کے ساتھ نہ لیں",
    stopInstructions: "پورا کورس مکمل کریں",
    warnings: "دھوپ سے بچیں، حمل میں منع ہے",
  },
  {
    nameEn: "Salbutamol Inhaler",
    nameUrdu: "سالبیوٹامول انہیلر",
    purpose: "دمے کا دورہ اور سانس کی تنگی",
    dosage: "1-2 پف ضرورت کے وقت",
    timing: "سانس تنگ ہونے پر فوری استعمال",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "دن میں 8 پف سے زیادہ لگیں تو ڈاکٹر سے ملیں",
    warnings: "دل کی دھڑکن تیز ہو سکتی ہے، ہاتھ کانپ سکتے ہیں",
  },
  {
    nameEn: "Insulin",
    nameUrdu: "انسولین",
    purpose: "شوگر (ذیابیطس) کنٹرول",
    dosage: "ڈاکٹر کے مطابق یونٹس",
    timing: "کھانے سے پہلے، انجکشن",
    foodWarnings: "شوگر اور میٹھی چیزوں سے پرہیز",
    stopInstructions: "کبھی خود سے بند نہ کریں",
    warnings: "شوگر بہت کم ہو سکتی ہے، میٹھی چیز ساتھ رکھیں",
  },
  {
    nameEn: "Clopidogrel",
    nameUrdu: "کلوپیڈوگریل",
    purpose: "خون کے لوتھڑے روکنے کے لیے",
    dosage: "ایک گولی (75mg) روزانہ",
    timing: "روزانہ ایک ہی وقت پر",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "ڈاکٹر کی اجازت کے بغیر بند نہ کریں",
    warnings: "خون بہنے کا خطرہ، چوٹ لگنے سے بچیں",
  },
  {
    nameEn: "Prednisolone",
    nameUrdu: "پریڈنیسولون",
    purpose: "سوجن، الرجی اور دمے کے لیے",
    dosage: "ڈاکٹر کے مطابق (5-40mg)",
    timing: "صبح کھانے کے بعد",
    foodWarnings: "نمک کم کھائیں",
    stopInstructions: "اچانک بند نہ کریں، آہستہ آہستہ کم کریں",
    warnings: "وزن بڑھ سکتا ہے، شوگر بڑھ سکتی ہے، ہڈیاں کمزور ہو سکتی ہیں",
  },
  {
    nameEn: "Folic Acid",
    nameUrdu: "فولک ایسڈ",
    purpose: "خون کی کمی اور حمل میں بچے کی نشوونما",
    dosage: "ایک گولی (5mg) روزانہ",
    timing: "کسی بھی وقت",
    foodWarnings: "کوئی خاص پرہیز نہیں",
    stopInstructions: "حمل کے دوران پورے عرصے تک لیں",
    warnings: "کوئی سنگین خطرہ نہیں",
  },
];

export function findFallbackMedicine(name: string): FallbackMedicine | null {
  const lower = name.toLowerCase().trim();
  return (
    fallbackMedicines.find(
      (m) =>
        m.nameEn.toLowerCase() === lower ||
        m.nameUrdu === name.trim() ||
        m.nameEn.toLowerCase().includes(lower) ||
        lower.includes(m.nameEn.toLowerCase())
    ) ?? null
  );
}

export function formatFallbackAsResponse(med: FallbackMedicine, lang: ResponseLang = "ur"): string {
  if (lang === "en") {
    return `Medicine name: ${med.nameEn} (${med.nameUrdu})
What it's for: ${med.purpose}
Dosage: ${med.dosage}
When to take: ${med.timing}
Food and drink cautions: ${med.foodWarnings}
When to stop: ${med.stopInstructions}
Warnings: ${med.warnings}`;
  }
  return `دوا کا نام: ${med.nameUrdu} (${med.nameEn})
یہ کس لیے ہے: ${med.purpose}
کتنی لینی ہے: ${med.dosage}
کب لینی ہے: ${med.timing}
کھانے سے پرہیز: ${med.foodWarnings}
کب بند کریں: ${med.stopInstructions}
⚠️ خبردار: ${med.warnings}`;
}
