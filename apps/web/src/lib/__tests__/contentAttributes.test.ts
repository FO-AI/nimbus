import { describe, expect, it } from "vitest";

import { tagLabel } from "@/lib/contentAttributes";

describe("tagLabel", () => {
  it("title-cases a plain slug into sentence case", () => {
    expect(tagLabel("acceptable-use")).toBe("Acceptable use");
    expect(tagLabel("public-records")).toBe("Public records");
    expect(tagLabel("budget")).toBe("Budget");
  });

  it("keeps acronyms upper-case on their own", () => {
    expect(tagLabel("its")).toBe("ITS");
    expect(tagLabel("ferpa")).toBe("FERPA");
    expect(tagLabel("ai")).toBe("AI");
  });

  it("applies acronym overrides inside compound tags", () => {
    // These shipped in the library and used to read "Ai literacy".
    expect(tagLabel("ai-literacy")).toBe("AI literacy");
    expect(tagLabel("hr-operations")).toBe("HR operations");
    expect(tagLabel("ai-acceleration")).toBe("AI acceleration");
  });

  it("honours names whose capitals are internal", () => {
    expect(tagLabel("connectcarolina")).toBe("ConnectCarolina");
    expect(tagLabel("linkedin-learning")).toBe("LinkedIn Learning");
  });

  it("is insensitive to surrounding whitespace and case", () => {
    expect(tagLabel("  ITS  ")).toBe("ITS");
    expect(tagLabel("")).toBe("");
  });
});
