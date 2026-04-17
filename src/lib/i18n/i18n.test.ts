import { describe, it, expect } from "vitest";
import { dir, fontClass } from "./index";

describe("i18n helpers", () => {
  it("dir returns rtl only for Urdu", () => {
    expect(dir("ur")).toBe("rtl");
    expect(dir("en")).toBe("ltr");
    expect(dir("hi")).toBe("ltr");
  });

  it("fontClass tags script families", () => {
    expect(fontClass("ur")).toBe("font-urdu");
    expect(fontClass("hi")).toBe("font-hindi");
    expect(fontClass("en")).toBe("");
  });
});
