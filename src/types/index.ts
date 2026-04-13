/** Bilingual field from structured prescription JSON (Gemini). */
export interface BilingualField {
  en: string | null;
  ur: string | null;
}

export interface MedicationStructured {
  name: BilingualField;
  dosage: BilingualField;
  route: BilingualField;
  timing: BilingualField;
}

/** Strict JSON shape for prescription image analysis. */
export interface PrescriptionAnalysisJson {
  patient_name: string | null;
  medications: MedicationStructured[];
  safety_notes: BilingualField[];
}

export interface MedicineResult {
  name: string;
  nameUrdu: string;
  purpose: string;
  dosage: string;
  timing: string;
  foodWarnings: string;
  stopInstructions: string;
  warnings: string;
  rawResponse: string;
  sources?: Source[];
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface AnalyzeRequest {
  text?: string;
  image?: string;
  lang?: "ur" | "en";
}

export interface AnalyzeResponse {
  medicines: MedicineResult[];
  rawText: string;
  prescriptionSummary?: string;
  /** Present when image analysis returned structured JSON. */
  prescriptionAnalysis?: PrescriptionAnalysisJson;
  error?: string;
}

export interface EnrichRequest {
  medicineName: string;
}

export interface EnrichResponse {
  sources: Source[];
  error?: string;
}

export interface ScrapeRequest {
  medicineName: string;
}

export interface ScrapeResponse {
  officialData?: {
    composition: string;
    manufacturer: string;
    approved: boolean;
  };
  error?: string;
}

export interface FallbackMedicine {
  nameEn: string;
  nameUrdu: string;
  purpose: string;
  dosage: string;
  timing: string;
  foodWarnings: string;
  stopInstructions: string;
  warnings: string;
}
