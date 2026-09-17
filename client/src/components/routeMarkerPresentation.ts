export type RouteMarkerKind = "departure" | "delivery" | "return";

type MarkerPresentation = { iconSize: [number, number]; iconAnchor: [number, number]; popupAnchor: [number, number]; html: string };

export function routeMarkerPresentation(label: string, kind: RouteMarkerKind, isCod = false): MarkerPresentation {
  if (kind === "departure") {
    return {
      iconSize: [40, 48], iconAnchor: [20, 46], popupAnchor: [0, -42],
      html: `<span class="route-marker route-marker--departure" title="Titik keberangkatan" style="position:relative;display:block;width:40px;height:48px;filter:drop-shadow(0 3px 5px rgba(0,0,0,.5))"><svg aria-label="Titik keberangkatan" viewBox="0 0 40 48" width="40" height="48"><path fill="#16a34a" stroke="#fff" stroke-width="2" d="M20 1.5C10.1 1.5 2.5 9.2 2.5 19c0 13.5 17.5 27.5 17.5 27.5S37.5 32.5 37.5 19C37.5 9.2 29.9 1.5 20 1.5Z"/><path fill="#fff" d="M20 9.5 29.5 19H24v9.5h-8V19h-5.5L20 9.5Z"/></svg><b style="position:absolute;bottom:7px;left:0;width:40px;text-align:center;color:#14532d;font:800 10px Arial">A</b></span>`,
    };
  }
  if (kind === "return") {
    return {
      iconSize: [40, 48], iconAnchor: [20, 46], popupAnchor: [0, -42],
      html: `<span class="route-marker route-marker--return" title="Titik kepulangan" style="position:relative;display:block;width:40px;height:48px;filter:drop-shadow(0 3px 5px rgba(0,0,0,.5))"><svg aria-label="Titik kepulangan" viewBox="0 0 40 48" width="40" height="48"><path fill="#7c3aed" stroke="#fff" stroke-width="2" d="M20 1.5C10.1 1.5 2.5 9.2 2.5 19c0 13.5 17.5 27.5 17.5 27.5S37.5 32.5 37.5 19C37.5 9.2 29.9 1.5 20 1.5Z"/><path fill="#fff" d="M27.5 13.5v6H18c-2.2 0-4 1.8-4 4s1.8 4 4 4h3.5v-3l6 5.5-6 5.5v-3H18c-5.5 0-10-4.5-10-10s4.5-10 10-10h9.5Z"/></svg><b style="position:absolute;bottom:7px;left:0;width:40px;text-align:center;color:#4c1d95;font:800 10px Arial">P</b></span>`,
    };
  }
  return {
    iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14],
    html: `<span class="route-marker route-marker--delivery${isCod ? " route-marker--cod" : ""}" title="${isCod ? "Titik POD COD" : "Titik POD"} ${label}" style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:999px;border:2px solid white;background:${isCod ? "#d946ef" : "#2563eb"};box-shadow:0 2px 8px rgba(0,0,0,.45);color:white;font:700 11px Arial">${label}</span>`,
  };
}
