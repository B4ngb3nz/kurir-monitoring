import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("kebijakan kontras antarmuka gelap", () => {
  it("menetapkan teks terang pada panel gelap, teks gelap pada kontrol terang, dan tetap melindungi popup peta", () => {
    const css = readFileSync(path.resolve(process.cwd(), "client/src/index.css"), "utf8");
    const courier = readFileSync(path.resolve(process.cwd(), "client/src/pages/CourierMonitoring.tsx"), "utf8");
    expect(css).toContain("--foreground: oklch(1 0 0)");
    expect(css).toContain(".app-action-primary");
    expect(css).toContain(".app-badge-positive");
    expect(css).toContain(".high-contrast");
    expect(css).toContain("[class~=\"bg-emerald-200\"]");
    expect(css).toContain('[data-slot="button"][class*="bg-cyan-300"]');
    expect(css).toContain('[class*="self-end"][class*="bg-violet-300"]');
    expect(css).toContain('[class*="shrink-0"][class*="bg-violet-300"]');
    expect(css).toContain("background-color: #243147 !important; border-color: rgba(255,255,255,.34) !important; color: #fff !important;");
    expect(css).toContain(".dark .leaflet-popup-content, .dark .leaflet-popup-content * { color: #1e293b !important; }");
    expect(css).toContain(".courier-ranking-trend-panel .recharts-text { fill: #0f172a !important; }");
    expect(courier).toContain("courier-ranking-trend-panel");
    expect(courier).toContain("text-slate-950");
  });

  it("menyediakan pengaturan kontras tinggi tersimpan pada root aplikasi dan kontrol sidebar", () => {
    const theme = readFileSync(path.resolve(process.cwd(), "client/src/contexts/ThemeContext.tsx"), "utf8");
    const layout = readFileSync(path.resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8");
    expect(theme).toContain('localStorage.getItem("accessibility-high-contrast")');
    expect(theme).toContain('classList.toggle("high-contrast", highContrast)');
    expect(layout).toContain("Kontras tinggi");
    expect(layout).toContain("aria-pressed={highContrast}");
  });
});
