import Exa from "exa-js";
import { Source } from "@/types";

const exa = new Exa(process.env.EXA_API_KEY!);

export async function searchDrugInfo(medicineName: string): Promise<Source[]> {
  try {
    const results = await exa.searchAndContents(
      `${medicineName} drug information dosage side effects`,
      {
        type: "neural",
        numResults: 5,
        text: { maxCharacters: 500 },
      }
    );

    return results.results.map((r) => ({
      title: r.title || medicineName,
      url: r.url,
      snippet: r.text?.slice(0, 200),
    }));
  } catch (error) {
    console.error("Exa search failed:", error);
    return [];
  }
}
