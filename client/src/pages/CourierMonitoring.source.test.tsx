import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/CourierMonitoring.tsx"), "utf8");
const mapSource = readFileSync(resolve(process.cwd(), "client/src/components/CourierRouteMap.tsx"), "utf8");
const historySource = readFileSync(resolve(process.cwd(), "client/src/components/ShipmentDetailDialog.tsx"), "utf8");

describe("CourierMonitoring detail summary contract", () => {
  it("exposes DELIVERYRUNSHEET and loads the selected courier summary below the table", () => {
    expect(source).toContain('"DELIVERYRUNSHEET"');
    expect(source).toContain("trpc.courierMonitoring.detailSummary.useQuery");
    expect(source).toContain("<CourierDetailSummaryPanel");
    expect(source).toContain('title: "Status"');
    expect(source).toContain('title: "Intercepted"');
    expect(source).toContain('title: "Produk"');
    expect(source).toContain('title: "SLA"');
    expect(source).toContain('title: "COD"');
    expect(source).toContain('formatCurrency(data?.codTotal ?? 0)');
    expect(source).toContain('deliveryInProgress={routeData.deliveryInProgress}');
    expect(mapSource).toContain('Marker fuchsia: resi COD');
    expect(mapSource).toContain('deliveryInProgress ? "A: Berangkat dari kantor · P: Menunggu selesai"');
    expect(source).toContain('Total besar uang COD');
    expect(source).toContain('Menunggu selesai');
    expect(source).toContain('point.isCod ? "bg-fuchsia-500 text-white"');
    expect(source).toContain('Status pengantaran');
    expect(source).toContain('Sedang mengantar');
    expect(source).toContain('item.deliveryRunsheetCount');
    expect(source).toContain('>Total COD</th>');
    expect(source).toContain('formatCurrency(item.codTotal)');
    expect(source).toContain('item.notDeliveredCount');
    expect(source).toContain('item.interceptedTrueCount');
    expect(source).toContain('item.overSlaCount');
    expect(source).toContain('Detail resi perlu perhatian');
    expect(source).toContain('Intercepted = true');
    expect(source).toContain('Total COD tertinggi');
    expect(source).toContain('Over SLA terbanyak');
    expect(source).toContain('aria-label="Tanggal awal"');
    expect(source).toContain('aria-label="Tanggal akhir"');
    expect(source).toContain('ExceptionComparisonChart');
    expect(source).toContain('Perbandingan COD dan Over SLA');
    expect(source).toContain('CSV detail');
    expect(source).toContain('Excel detail');
    expect(source).toContain('title="Klik untuk membuka histori kiriman"');
    expect(source).toContain('value={detailSearch}');
    expect(source).toContain('Cari nomor resi…');
    expect(historySource).toContain('MiniMapPreview');
    expect(historySource).toContain('Tanggal Update');
    expect(historySource).toContain('Detail History');
    expect(historySource).toContain('openstreetmap.org/export/embed.html');
    expect(historySource).toContain('onMouseEnter={() => setOpen(true)}');
  });
});

const dashboardSource = readFileSync(resolve(process.cwd(), "client/src/pages/ShipmentDashboard.tsx"), "utf8");
const helpSource = readFileSync(resolve(process.cwd(), "client/src/pages/Help.tsx"), "utf8");
describe("recent operations UI contracts", () => {
  it("keeps detail export, black history text, and non-flat performance metrics wired", () => {
    expect(dashboardSource).toContain("trpc.shipments.exportExcel.useMutation");
    expect(dashboardSource).toContain("Ekspor Excel");
    expect(source).toContain('dataKey="performanceScore"');
    expect(source).toContain('domain={[0, 100]}');
    expect(historySource).toContain("bg-white p-0 text-black");
    expect(historySource).toContain("text-black");
  });
  it("exposes the Help manual and data-grounded assistant", () => {
    expect(helpSource).toContain("User Manual Aplikasi");
    expect(helpSource).toContain("trpc.help.ask.useMutation");
    expect(helpSource).toContain("Konteks data opsional");
    expect(helpSource).toContain("tidak mengarang angka");
  });
});


describe("history filter and performance tooltip contract", () => {
  it("keeps event filtering and black table text available in the detail dialog", () => {
    expect(historySource).toContain("historyFilter");
    expect(historySource).toContain("Filter event");
    expect(historySource).toContain("Tidak ada event yang cocok dengan filter ini.");
    expect(historySource).toContain("text-black [&_*]:text-black");
  });

  it("shows date and score metrics in the seven-day chart tooltip", () => {
    expect(source).toContain("point.date");
    expect(source).toContain("Skor performa");
    expect(source).toContain("Keberhasilan");
    expect(source).toContain("Kelengkapan POD");
  });
});
