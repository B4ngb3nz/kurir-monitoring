import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/ShipmentDashboard.tsx"), "utf8");
const tracking = readFileSync(resolve(process.cwd(), "server/tracking.ts"), "utf8");

describe("ShipmentDashboard COD detail contract", () => {
  it("exposes COD columns in the detail table and COD fields in the detail source", () => {
    expect(source).toContain('"COD", "Besar COD", "Setor COD", "Tanggal setor COD"');
    expect(source).toContain("record.codDepositStatus");
    expect(source).toContain("record.totalCod");
    expect(source).toContain("formatTime(record.codPaymentTime)");
    expect(tracking).toContain('label: "Besar COD"');
    expect(tracking).toContain('label: "Setor COD"');
    expect(tracking).toContain('label: "Tanggal Setor COD"');
  });
});

