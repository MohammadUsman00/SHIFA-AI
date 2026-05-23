import { NextRequest, NextResponse } from "next/server";
import { checkMedicationInteractions } from "@/lib/gemini-features";
import { enforceApiRateLimit } from "@/lib/rate-limit";
import type { MedicationStructured } from "@/types";
import type { ResponseLang } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const limited = await enforceApiRateLimit(request, "interactions");
  if (limited) return limited;

  try {
    const { medications, lang } = (await request.json()) as {
      medications?: MedicationStructured[];
      lang?: ResponseLang;
    };
    if (!medications?.length || medications.length < 2) {
      return NextResponse.json({
        hints: "",
        skipped: true,
      });
    }
    const hints = await checkMedicationInteractions(medications, lang || "en");
    return NextResponse.json({ hints });
  } catch (e) {
    console.error("interactions error", e);
    return NextResponse.json({ error: "Interactions check failed" }, { status: 500 });
  }
}
