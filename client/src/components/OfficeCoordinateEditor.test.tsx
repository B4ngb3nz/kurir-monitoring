import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OfficeCoordinateEditor from "./OfficeCoordinateEditor";

const mocks = vi.hoisted(() => ({ startLogin: vi.fn(), toastError: vi.fn(), invalidate: vi.fn() }));

vi.mock("@/const", () => ({ startLogin: mocks.startLogin }));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: true }) }));
vi.mock("sonner", () => ({ toast: { error: mocks.toastError, success: vi.fn() } }));
vi.mock("@/lib/trpc", () => ({ trpc: {
  useUtils: () => ({ courierMonitoring: { officeCoordinateOverride: { invalidate: mocks.invalidate } } }),
  courierMonitoring: {
    officeCoordinateOverride: { useQuery: () => ({ data: null }) },
    saveOfficeCoordinateOverride: { useMutation: (options: { onError?: (error: unknown) => void }) => ({ isPending: false, mutate: () => options.onError?.({ data: { code: "UNAUTHORIZED" }, message: "Tidak memiliki ijin" }) }) },
    clearOfficeCoordinateOverride: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
  },
} }));

describe("OfficeCoordinateEditor", () => {
  afterEach(() => vi.clearAllMocks());
  it("redirects to application login when saving receives an unauthorized response", () => {
    render(<OfficeCoordinateEditor office="KCU Contoh" onCoordinatesChanged={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("-6.1940"), { target: { value: "-6.2" } });
    fireEvent.change(screen.getByPlaceholderText("106.9012"), { target: { value: "106.8" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(mocks.startLogin).toHaveBeenCalledOnce();
    expect(mocks.toastError).toHaveBeenCalledWith("Sesi aplikasi belum aktif. Anda akan diarahkan untuk login.");
  });
});
