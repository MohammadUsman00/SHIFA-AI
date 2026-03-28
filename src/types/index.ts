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
