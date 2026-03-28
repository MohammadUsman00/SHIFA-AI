import { NextRequest, NextResponse } from "next/server";
import { searchDrugInfo } from "@/lib/exa";

export async function POST(request: NextRequest) {
  try {
    const { medicineName } = await request.json();

    if (!medicineName) {
      return NextResponse.json(
        { sources: [], error: "Medicine name required" },
        { status: 400 }
      );
    }

    const sources = await searchDrugInfo(medicineName);

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Enrich error:", error);
    return NextResponse.json({ sources: [] });
  }
}
