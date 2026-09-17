import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("kartu informasi halaman Tentang", () => {
  it("menggunakan latar terang dengan teks dan ikon gelap", () => {
    const source = readFileSync(path.resolve(process.cwd(), "client/src/pages/About.tsx"), "utf8");
    expect(source).toContain("bg-cyan-50 p-5 !text-slate-950");
    expect(source).toContain("bg-violet-50 p-5 !text-slate-950");
    expect(source).toContain("bg-emerald-50 p-5 !text-slate-950");
    expect(source).toContain("bg-cyan-200 p-2 !text-slate-950");
    expect(source).toContain("bg-violet-200 p-2 !text-slate-950");
    expect(source).toContain("bg-emerald-200 p-2 !text-slate-950");
  });
});
