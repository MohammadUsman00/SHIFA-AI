import { NextRequest, NextResponse } from "next/server";
import { scrapeCDSCO } from "@/lib/apify";
import { findFallbackMedicine } from "@/lib/fallback-medicines";

export async function POST(request: NextRequest) {
  try {
    const { medicineName } = await request.json();

    if (!medicineName) {
      return NextResponse.json(
        { error: "Medicine name required" },
        { status: 400 }
      );
    }

    const officialData = await scrapeCDSCO(medicineName);

    if (officialData) {
      return NextResponse.json({ officialData });
    }

    const fallback = findFallbackMedicine(medicineName);
    if (fallback) {
      return NextResponse.json({
        officialData: {
          composition: fallback.nameEn,
          manufacturer: "N/A",
          approved: true,
        },
        fromFallback: true,
      });
    }

    return NextResponse.json({
      officialData: null,
      error: "No official data found",
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json({
      officialData: null,
      error: "Scraping failed",
    });
  }
}
