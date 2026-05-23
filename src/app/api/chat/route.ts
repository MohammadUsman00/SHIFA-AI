import { NextRequest, NextResponse } from "next/server";
import { rxFollowUpChat } from "@/lib/gemini-features";
import { enforceApiRateLimit } from "@/lib/rate-limit";
import type { ResponseLang } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const limited = await enforceApiRateLimit(request, "chat");
  if (limited) return limited;

  try {
    const { message, contextSummary, lang } = (await request.json()) as {
      message?: string;
      contextSummary?: string;
      lang?: ResponseLang;
    };
    if (!message?.trim() || !contextSummary?.trim()) {
      return NextResponse.json({ error: "message and context required" }, { status: 400 });
    }
    const reply = await rxFollowUpChat(message.trim(), contextSummary.trim(), lang || "en");
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("chat error", e);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
