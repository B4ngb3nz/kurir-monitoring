import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { redirectForOfficeCoordinateAccessError } from "@shared/officeCoordinateAccess";
import { trpc } from "@/lib/trpc";
import { Crosshair, MapPin, RotateCcw, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = { office: string; onCoordinatesChanged: () => void; pickedCoordinate?: { lat: number; lng: number } | null; picking?: boolean; onPickingChange?: (value: boolean) => void };

function coordinateText(value: number | null | undefined) { return value === null || value === undefined ? "" : String(value); }

export default function OfficeCoordinateEditor({ office, onCoordinatesChanged, pickedCoordinate, picking = false, onPickingChange }: Props) {
  const utils = trpc.useUtils();
  const auth = useAuth();
  const override = trpc.courierMonitoring.officeCoordinateOverride.useQuery({ office }, { enabled: Boolean(office), staleTime: 0 });
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLatitude(coordinateText(override.data?.latitude));
    setLongitude(coordinateText(override.data?.longitude));
    setLabel(override.data?.label ?? office);
  }, [office, override.data?.latitude, override.data?.longitude, override.data?.label]);
  useEffect(() => { if (pickedCoordinate) { setLatitude(pickedCoordinate.lat.toFixed(6)); setLongitude(pickedCoordinate.lng.toFixed(6)); } }, [pickedCoordinate]);
  useEffect(() => { const handlePick = (event: Event) => { const coordinate = (event as CustomEvent<{ lat: number; lng: number }>).detail; if (coordinate) { setLatitude(coordinate.lat.toFixed(6)); setLongitude(coordinate.lng.toFixed(6)); onPickingChange?.(false); } }; window.addEventListener("kurir-office-coordinate-picked", handlePick); return () => window.removeEventListener("kurir-office-coordinate-picked", handlePick); }, [onPickingChange]);

  const refresh = () => { void utils.courierMonitoring.officeCoordinateOverride.invalidate({ office }); onCoordinatesChanged(); };
  const requireLoginForAccessError = (error: { data?: { code?: string } | null; message?: string }) => { if (redirectForOfficeCoordinateAccessError(error.data?.code, startLogin)) { toast.error("Sesi aplikasi belum aktif. Anda akan diarahkan untuk login."); return true; } return false; };
  const save = trpc.courierMonitoring.saveOfficeCoordinateOverride.useMutation({ onSuccess: () => { toast.success("Koordinat kantor manual disimpan dan dipakai untuk titik A/P."); refresh(); }, onError: error => { if (!requireLoginForAccessError(error)) toast.error(error.message || "Koordinat kantor tidak dapat disimpan."); } });
  const clear = trpc.courierMonitoring.clearOfficeCoordinateOverride.useMutation({ onSuccess: () => { toast.success("Koreksi manual dihapus; rute akan kembali memakai pencarian otomatis."); refresh(); }, onError: error => { if (!requireLoginForAccessError(error)) toast.error(error.message || "Koreksi manual tidak dapat dihapus."); } });
  if (!office) return null;

  const submit = () => {
    if (!auth.isAuthenticated) { toast.error("Silakan login ke aplikasi terlebih dahulu untuk menyimpan koreksi kantor."); startLogin(); return; }
    const lat = Number(latitude); const lng = Number(longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) { toast.error("Masukkan latitude -90 s.d. 90 dan longitude -180 s.d. 180."); return; }
    save.mutate({ office, latitude: lat, longitude: lng, label: label.trim() || undefined });
  };

  return <div className="mt-5 rounded-xl border border-cyan-200/20 bg-slate-950/40 p-3 text-left shadow-inner"><div className="flex flex-col gap-3 lg:flex-row lg:items-end"><div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 text-xs font-semibold text-cyan-100"><Crosshair className="h-3.5 w-3.5" />Koreksi koordinat kantor</p><p className="mt-1 truncate text-[11px] text-white/65">{office}</p><p className={`mt-1 text-[11px] ${override.data ? "text-emerald-200" : "text-white/55"}`}>{override.data ? "Sumber rute: koreksi manual tersimpan" : "Sumber rute: pencarian peta otomatis"}</p></div><label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-white/60">Latitude<Input value={latitude} onChange={event => setLatitude(event.target.value)} inputMode="decimal" placeholder="-6.1940" className="h-8 min-w-[125px] border-white/15 bg-slate-900 text-xs text-white" /></label><label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-white/60">Longitude<Input value={longitude} onChange={event => setLongitude(event.target.value)} inputMode="decimal" placeholder="106.9012" className="h-8 min-w-[125px] border-white/15 bg-slate-900 text-xs text-white" /></label><label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-white/60">Label lokasi<Input value={label} onChange={event => setLabel(event.target.value)} placeholder="Nama kantor / alamat" className="h-8 min-w-[180px] border-white/15 bg-slate-900 text-xs text-white" /></label><div className="flex gap-2"><Button type="button" onClick={() => { window.dispatchEvent(new CustomEvent("kurir-office-coordinate-pick-start", { detail: { active: !picking } })); onPickingChange?.(!picking); }} variant="outline" className={`h-8 border-amber-200/30 px-3 text-xs ${picking ? "bg-amber-300 text-slate-950 hover:bg-amber-200" : "bg-white/5 text-amber-100 hover:bg-white/15 hover:text-amber-50"}`}><MapPin className="mr-1.5 h-3.5 w-3.5" />{picking ? "Klik peta…" : "Pilih di peta"}</Button><Button type="button" onClick={submit} disabled={save.isPending} className="h-8 bg-cyan-300 px-3 text-xs font-semibold text-slate-950 hover:bg-cyan-200"><Save className="mr-1.5 h-3.5 w-3.5" />Simpan</Button>{override.data && <Button type="button" onClick={() => clear.mutate({ office })} disabled={clear.isPending} variant="outline" className="h-8 border-white/15 bg-white/5 px-3 text-xs text-white hover:bg-white/15 hover:text-white"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Reset</Button>}</div></div><a href={`https://www.google.com/maps/search/?api=1&query=${latitude || "0"},${longitude || "0"}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-100 hover:text-cyan-50"><MapPin className="h-3 w-3" />Periksa titik di peta sebelum menyimpan</a></div>;
}
