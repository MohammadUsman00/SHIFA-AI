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
