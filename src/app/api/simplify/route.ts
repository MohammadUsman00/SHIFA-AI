import { NextRequest, NextResponse } from "next/server";
import { simplifyMedicalText } from "@/lib/gemini-features";
import { enforceApiRateLimit } from "@/lib/rate-limit";
import type { ResponseLang } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const limited = await enforceApiRateLimit(request, "simplify");
  if (limited) return limited;

  try {
    const { text, lang } = (await request.json()) as { text?: string; lang?: ResponseLang };
    if (!text?.trim()) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }
    const simplified = await simplifyMedicalText(text.trim(), lang || "en");
    return NextResponse.json({ simplified });
  } catch (e) {
    console.error("simplify error", e);
    return NextResponse.json({ error: "Simplify failed" }, { status: 500 });
  }
}
