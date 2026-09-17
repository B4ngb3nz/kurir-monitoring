import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Tracking.tsx"), "utf8");

describe("Tracking export contract", () => {
  it("exposes Excel export for the submitted tracking results", () => {
    expect(source).toContain("trpc.tracking.exportExcel.useMutation");
    expect(source).toContain("Ekspor Excel");
    expect(source).toContain("downloadBase64(result.content, result.filename)");
    expect(source).toContain("codes: submitted");
  });
});
