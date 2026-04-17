import { describe, it, expect } from "vitest";
import { findFallbackMedicine, formatFallbackAsResponse } from "./fallback-medicines";

describe("findFallbackMedicine", () => {
  it("finds paracetamol by English name", () => {
    const m = findFallbackMedicine("paracetamol");
    expect(m?.nameEn).toBe("Paracetamol");
  });

  it("returns null for unknown", () => {
    expect(findFallbackMedicine("notarealdrugxyz123")).toBeNull();
  });
});

describe("formatFallbackAsResponse", () => {
  const med = {
    nameEn: "Paracetamol",
    nameUrdu: "پیراسیٹامول",
    purpose: "p",
    dosage: "d",
    timing: "t",
    foodWarnings: "f",
    stopInstructions: "s",
    warnings: "w",
  };

  it("formats Urdu block", () => {
    const s = formatFallbackAsResponse(med, "ur");
    expect(s).toContain("دوا کا نام");
    expect(s).toContain("Paracetamol");
  });

  it("formats English block", () => {
    const s = formatFallbackAsResponse(med, "en");
    expect(s).toContain("Medicine name:");
    expect(s).toContain("Paracetamol");
  });

  it("formats Hindi block", () => {
    const s = formatFallbackAsResponse(med, "hi");
    expect(s).toContain("दवा का नाम");
    expect(s).toContain("Paracetamol");
  });
});
