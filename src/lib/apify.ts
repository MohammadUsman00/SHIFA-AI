import { ApifyClient } from "apify-client";

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN!,
});

export interface CDSCOResult {
  composition: string;
  manufacturer: string;
  approved: boolean;
}

export async function scrapeCDSCO(
  medicineName: string
): Promise<CDSCOResult | null> {
  try {
    const run = await client.actor("apify/web-scraper").call({
      startUrls: [
        {
          url: `https://cdscoonline.gov.in/CDSCO/Drugs/SearchDrugBank?DrugName=${encodeURIComponent(medicineName)}`,
        },
      ],
      maxPagesPerCrawl: 1,
      pageFunction: `async function pageFunction(context) {
        const { page, request } = context;
        const data = await page.$$eval('table tr', rows =>
          rows.map(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).map(c => c.textContent?.trim());
          })
        );
        return { url: request.url, data };
      }`,
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (items.length > 0 && items[0].data) {
      const rows = items[0].data as string[][];
      if (rows.length > 1) {
        return {
          composition: rows[1]?.[1] || "N/A",
          manufacturer: rows[1]?.[2] || "N/A",
          approved: true,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("CDSCO scrape failed:", error);
    return null;
  }
}
