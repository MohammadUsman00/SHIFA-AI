import type { PrescriptionAnalysisJson, MedicineResult } from "@/types";

export function printPrescriptionSummary(opts: {
  title: string;
  patientName?: string;
  summary?: string;
  analysis?: PrescriptionAnalysisJson;
  medicines?: MedicineResult[];
  disclaimer: string;
}): void {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;

  const medRows =
    opts.analysis?.medications
      .map(
        (m) => `
      <tr>
        <td>${escapeHtml(m.name.en || m.name.ur || "")}</td>
        <td>${escapeHtml(m.dosage.en || m.dosage.ur || "")}</td>
        <td>${escapeHtml(m.timing.en || m.timing.ur || "")}</td>
      </tr>`
      )
      .join("") ||
    (opts.medicines || [])
      .map(
        (m) => `
      <tr>
        <td>${escapeHtml(m.name || m.nameUrdu)}</td>
        <td>${escapeHtml(m.dosage)}</td>
        <td>${escapeHtml(m.timing)}</td>
      </tr>`
      )
      .join("");

  w.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>${escapeHtml(opts.title)}</title>
<style>
  body { font-family: Georgia, serif; color: #0f1c2e; padding: 2rem; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 1.5rem; border-bottom: 2px solid #b8956a; padding-bottom: 0.5rem; }
  .meta { color: #5a6b7d; font-size: 0.9rem; margin-bottom: 1.5rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
  th, td { border: 1px solid #d9cfc0; padding: 0.5rem; text-align: left; }
  th { background: #f3ede4; }
  .disclaimer { margin-top: 2rem; font-size: 0.75rem; color: #8a96a3; border-top: 1px solid #d9cfc0; padding-top: 1rem; }
  @media print { body { padding: 0; } }
</style></head><body>
  <h1>${escapeHtml(opts.title)}</h1>
  ${opts.patientName ? `<p class="meta"><strong>Patient:</strong> ${escapeHtml(opts.patientName)}</p>` : ""}
  ${opts.summary ? `<p>${escapeHtml(opts.summary)}</p>` : ""}
  <table><thead><tr><th>Medicine</th><th>Dosage</th><th>Timing</th></tr></thead><tbody>${medRows}</tbody></table>
  <p class="disclaimer">${escapeHtml(opts.disclaimer)}</p>
  <script>window.onload = () => { window.print(); }</script>
</body></html>`);
  w.document.close();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
