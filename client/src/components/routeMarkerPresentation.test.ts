import { describe, expect, it } from "vitest";
import { routeMarkerPresentation } from "./routeMarkerPresentation";

describe("route marker presentation", () => {
  it("uses distinct SVG symbols for departure and return anchors", () => {
    const departure = routeMarkerPresentation("A", "departure");
    const returning = routeMarkerPresentation("P", "return");

    expect(departure.html).toContain("route-marker--departure");
    expect(departure.html).toContain("Titik keberangkatan");
    expect(returning.html).toContain("route-marker--return");
    expect(returning.html).toContain("Titik kepulangan");
    expect(departure.iconSize).toEqual([40, 48]);
    expect(returning.iconSize).toEqual([40, 48]);
  });

  it("uses a distinct fuchsia delivery marker for COD consignments", () => {
    const cod = routeMarkerPresentation("7", "delivery", true);
    const regular = routeMarkerPresentation("8", "delivery", false);

    expect(cod.html).toContain("route-marker--cod");
    expect(cod.html).toContain("#d946ef");
    expect(cod.html).toContain("Titik POD COD");
    expect(regular.html).not.toContain("route-marker--cod");
    expect(regular.html).toContain("#2563eb");
  });
});
