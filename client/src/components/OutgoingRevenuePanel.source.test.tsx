import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("OutgoingRevenuePanel revenue analysis UI", () => {
  const source = readFileSync(join(process.cwd(), "client/src/components/OutgoingRevenuePanel.tsx"), "utf8");

  it("keeps the annual target, warning, Excel action, and period analysis visible in the component", () => {
    expect(source).toContain("Target & Analisa Pendapatan");
    expect(source).toContain("Target Tahunan (Rp)");
    expect(source).toContain("Peringatan penurunan pendapatan harian");
    expect(source).toContain("Ekspor Excel");
    expect(source).toContain("Tabel Analisa Pendapatan");
    expect(source).toContain("bg-emerald-300 px-3 text-xs font-semibold text-slate-950");
    expect(source).toContain("bg-cyan-300 px-3 text-xs font-semibold text-slate-950");
    expect(source).toContain("bg-rose-200 text-slate-950");
    expect(source).toContain("bg-emerald-50 px-5 py-4 !text-slate-950");
    expect(source).toContain("bg-cyan-50 p-5 !text-slate-950");
    expect(source).toContain("bg-violet-50 p-5 !text-slate-950");
    expect(source).toContain("bg-amber-50 p-5 !text-slate-950");
  });
});
