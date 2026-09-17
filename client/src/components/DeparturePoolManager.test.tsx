import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DeparturePoolManager from "./DeparturePoolManager";

vi.mock("@/const", () => ({ startLogin: vi.fn() }));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: true }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/lib/trpc", () => ({ trpc: {
  useUtils: () => ({ courierMonitoring: { departurePools: { invalidate: vi.fn() }, departurePoolCourierGroup: { invalidate: vi.fn() } } }),
  courierMonitoring: {
    departurePools: { useQuery: () => ({ data: [] }) },
    saveDeparturePool: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
    deleteDeparturePool: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
    departurePoolCourierGroup: { useQuery: () => ({ data: [] }) },
    saveDeparturePoolCourierGroup: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
  },
} }));

describe("DeparturePoolManager", () => {
  it("keeps hook order stable when an office is selected after initial empty render", () => {
    const props = { selectedPoolId: undefined, onSelectPool: vi.fn(), onPoolsChanged: vi.fn() };
    const view = render(<DeparturePoolManager office="" {...props} />);
    expect(view.container.firstChild).toBeNull();
    expect(() => view.rerender(<DeparturePoolManager office="KCU Jakarta Premier" {...props} />)).not.toThrow();
    expect(screen.getByText("Pool keberangkatan kantor")).toBeTruthy();
  });
});
