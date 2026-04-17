import { describe, it, expect } from "vitest";
import { bodyFontVar, scriptUiClass, scriptTitleClass } from "./lang-ui";

describe("lang-ui", () => {
  it("maps body font to CSS variables", () => {
    expect(bodyFontVar("ur")).toBe("var(--font-urdu)");
    expect(bodyFontVar("hi")).toBe("var(--font-hindi)");
    expect(bodyFontVar("en")).toBe("var(--font-inter)");
  });

  it("maps script classes", () => {
    expect(scriptUiClass("ur")).toBe("urdu-ui");
    expect(scriptUiClass("hi")).toBe("hindi-ui");
    expect(scriptUiClass("en")).toBe("");
  });

  it("maps title classes", () => {
    expect(scriptTitleClass("ur")).toBe("urdu-title");
    expect(scriptTitleClass("hi")).toBe("hindi-title");
    expect(scriptTitleClass("en")).toBe("");
  });
});
