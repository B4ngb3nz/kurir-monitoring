import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("identitas aplikasi", () => {
  it("menampilkan nama, versi, pembuat, sumber data, dan ikon Pos Indonesia yang ditentukan", () => {
    const root = process.cwd();
    const layout = readFileSync(path.resolve(root, "client/src/components/DashboardLayout.tsx"), "utf8");
    const document = readFileSync(path.resolve(root, "client/index.html"), "utf8");
    const about = readFileSync(path.resolve(root, "client/src/pages/About.tsx"), "utf8");
    const shipmentDashboard = readFileSync(path.resolve(root, "client/src/pages/ShipmentDashboard.tsx"), "utf8");
    const courierMonitoring = readFileSync(path.resolve(root, "client/src/pages/CourierMonitoring.tsx"), "utf8");
    const sourceConnection = readFileSync(path.resolve(root, "client/src/components/SourceConnectionStatus.tsx"), "utf8");
    const outgoingRevenue = readFileSync(path.resolve(root, "client/src/components/OutgoingRevenuePanel.tsx"), "utf8");
    expect(layout).toContain("Dashboard Monitoring Operasi Kurir");
    expect(layout).toContain("Versi 1.0.0");
    expect(layout).toContain("Barkah - KCU Jakarta Premer 1300 @Agust2026");
    expect(layout).toContain("Kibana - ElasticSearch");
    expect(document).toContain("/manus-storage/pos-indonesia-dashboard-icon_31e4d1cd.png");
    expect(layout).toContain('label: "Tentang Aplikasi"');
    expect(about).toContain("Data kiriman tidak disimpan sebagai arsip pada aplikasi ini.");
    expect(shipmentDashboard).toContain("Data diperbarui:");
    expect(courierMonitoring).toContain("refetchInterval: 60_000");
    expect(sourceConnection).toContain("Status sumber data:");
    expect(sourceConnection).toContain("refetchInterval: 30_000");
    expect(outgoingRevenue).toContain("Produksi Ritel per produk");
    expect(outgoingRevenue).toContain("Produksi Korporat per pelanggan");
  });
});
