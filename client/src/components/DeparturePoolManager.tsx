import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { redirectForOfficeCoordinateAccessError } from "@shared/officeCoordinateAccess";
import { MapPin, Save, Trash2, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = { office: string; selectedPoolId?: number; availableCourierNames?: string[]; onSelectPool: (id?: number) => void; onPoolsChanged: () => void };

export default function DeparturePoolManager({ office, selectedPoolId, availableCourierNames = [], onSelectPool, onPoolsChanged }: Props) {
  const auth = useAuth();
  const utils = trpc.useUtils();
  const pools = trpc.courierMonitoring.departurePools.useQuery({ office }, { enabled: Boolean(office), staleTime: 0 });
  const courierGroup = trpc.courierMonitoring.departurePoolCourierGroup.useQuery({ office, poolId: selectedPoolId ?? 1 }, { enabled: Boolean(office && selectedPoolId), staleTime: 0 });
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [groupDraft, setGroupDraft] = useState<string[]>([]);
  const activePool = (pools.data ?? []).find(pool => pool.id === selectedPoolId);
  const groupCandidates = useMemo(() => Array.from(new Set([...availableCourierNames, ...groupDraft])).sort((left, right) => left.localeCompare(right)), [availableCourierNames, groupDraft]);

  useEffect(() => { setName(""); setLatitude(""); setLongitude(""); setGroupDraft([]); }, [office]);
  useEffect(() => { setGroupDraft([]); }, [selectedPoolId]);
  useEffect(() => { if (courierGroup.data) setGroupDraft(current => current.length === courierGroup.data!.length && current.every((name, index) => name === courierGroup.data![index]) ? current : courierGroup.data!); }, [courierGroup.data]);
  const refresh = () => { void utils.courierMonitoring.departurePools.invalidate({ office }); if (selectedPoolId) void utils.courierMonitoring.departurePoolCourierGroup.invalidate({ office, poolId: selectedPoolId }); onPoolsChanged(); };
  const requireLogin = (error?: { data?: { code?: string } | null }) => redirectForOfficeCoordinateAccessError(error?.data?.code, startLogin);
  const save = trpc.courierMonitoring.saveDeparturePool.useMutation({ onSuccess: pool => { toast.success(`${pool?.name ?? "Pool"} tersimpan.`); setName(""); setLatitude(""); setLongitude(""); if (pool) onSelectPool(pool.id); refresh(); }, onError: error => { if (requireLogin(error)) toast.error("Sesi aplikasi belum aktif. Anda akan diarahkan untuk login."); else toast.error(error.message); } });
  const remove = trpc.courierMonitoring.deleteDeparturePool.useMutation({ onSuccess: (_, variables) => { toast.success("Pool keberangkatan dan kelompok kurirnya dihapus."); if (selectedPoolId === variables.id) onSelectPool(undefined); refresh(); }, onError: error => { if (requireLogin(error)) toast.error("Sesi aplikasi belum aktif. Anda akan diarahkan untuk login."); else toast.error(error.message); } });
  const saveGroup = trpc.courierMonitoring.saveDeparturePoolCourierGroup.useMutation({ onSuccess: names => { setGroupDraft(names); toast.success(`${names.length} kurir disimpan pada ${activePool?.name ?? "pool"}.`); refresh(); }, onError: error => { if (requireLogin(error)) toast.error("Sesi aplikasi belum aktif. Anda akan diarahkan untuk login."); else toast.error(error.message); } });
  const submit = () => {
    if (!auth.isAuthenticated) { toast.error("Silakan login ke aplikasi terlebih dahulu untuk menyimpan pool."); startLogin(); return; }
    const lat = Number(latitude); const lng = Number(longitude);
    if (!name.trim()) { toast.error("Masukkan nama pool, misalnya Pool KCU."); return; }
    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) { toast.error("Masukkan latitude -90 s.d. 90 dan longitude -180 s.d. 180."); return; }
    save.mutate({ office, name: name.trim(), latitude: lat, longitude: lng });
  };
  const submitGroup = () => {
    if (!selectedPoolId) return;
    if (!auth.isAuthenticated) { toast.error("Silakan login ke aplikasi terlebih dahulu untuk menyimpan kelompok kurir."); startLogin(); return; }
    saveGroup.mutate({ office, poolId: selectedPoolId, courierNames: groupDraft });
  };
  const toggleCourier = (courierName: string) => setGroupDraft(current => current.includes(courierName) ? current.filter(name => name !== courierName) : [...current, courierName]);
  if (!office) return null;

  return <section className="mt-4 rounded-xl border border-violet-200/20 bg-slate-950/40 p-3 text-left shadow-inner"><div className="flex flex-col gap-3"><div><p className="flex items-center gap-1.5 text-xs font-semibold text-violet-100"><MapPin className="h-3.5 w-3.5" />Pool keberangkatan kantor</p><p className="mt-1 text-[11px] leading-5 text-white/65">Simpan beberapa titik, lalu kelompokkan kurir pada tiap pool. Pool aktif menjadi anchor A/P rute dan menyaring daftar kurir ke anggota kelompoknya.</p></div><label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-white/60">Pool aktif<select value={selectedPoolId ?? ""} onChange={event => onSelectPool(event.target.value ? Number(event.target.value) : undefined)} className="h-8 rounded-md border border-white/15 bg-slate-900 px-2 text-xs normal-case tracking-normal text-white"><option value="">Otomatis / koreksi kantor</option>{(pools.data ?? []).map(pool => <option key={pool.id} value={pool.id}>{pool.name}</option>)}</select></label><div className="grid gap-2 lg:grid-cols-[1.1fr_.7fr_.7fr_auto]"><label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-white/60">Nama pool<Input value={name} onChange={event => setName(event.target.value)} placeholder="Pool KCU" className="h-8 border-white/15 bg-slate-900 text-xs text-white" /></label><label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-white/60">Latitude<Input value={latitude} onChange={event => setLatitude(event.target.value)} inputMode="decimal" placeholder="-6.1940" className="h-8 border-white/15 bg-slate-900 text-xs text-white" /></label><label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-white/60">Longitude<Input value={longitude} onChange={event => setLongitude(event.target.value)} inputMode="decimal" placeholder="106.9012" className="h-8 border-white/15 bg-slate-900 text-xs text-white" /></label><Button type="button" onClick={submit} disabled={save.isPending} className="self-end h-8 bg-violet-300 px-3 text-xs font-semibold text-slate-950 hover:bg-violet-200"><Save className="mr-1.5 h-3.5 w-3.5" />Simpan pool</Button></div>{selectedPoolId && <div className="rounded-lg border border-violet-200/15 bg-violet-300/[.06] p-3"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><p className="flex items-center gap-1.5 text-xs font-semibold text-violet-50"><Users className="h-3.5 w-3.5" />Kelompok kurir {activePool ? `· ${activePool.name}` : ""}</p><p className="mt-1 text-[11px] leading-5 text-white/65">Pilih kurir yang berangkat dari pool ini, lalu simpan. Saat pool aktif dipilih, hanya anggota kelompok yang akan tampil.</p></div><Button type="button" onClick={submitGroup} disabled={saveGroup.isPending || courierGroup.isLoading} className="h-8 shrink-0 bg-violet-300 px-3 text-xs font-semibold text-slate-950 hover:bg-violet-200"><Save className="mr-1.5 h-3.5 w-3.5" />{saveGroup.isPending ? "Menyimpan…" : `Simpan ${groupDraft.length} kurir`}</Button></div><div className="mt-3 flex max-h-44 flex-wrap gap-1.5 overflow-y-auto pr-1">{groupCandidates.length ? groupCandidates.map(courierName => <button key={courierName} type="button" aria-pressed={groupDraft.includes(courierName)} onClick={() => toggleCourier(courierName)} className={`rounded-md border px-2 py-1 text-[11px] transition ${groupDraft.includes(courierName) ? "border-violet-200/55 bg-violet-300/20 text-violet-50" : "border-white/15 bg-slate-950/55 text-white/65 hover:bg-white/10"}`}>{groupDraft.includes(courierName) ? "✓ " : ""}{courierName}</button>) : <p className="text-[11px] text-white/55">Klik Tampilkan untuk memuat daftar kurir kantor ini, lalu pilih anggota pool.</p>}</div></div>}{(pools.data ?? []).length > 0 && <div className="flex flex-wrap gap-2">{pools.data?.map(pool => <span key={pool.id} className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] ${selectedPoolId === pool.id ? "border-violet-200/45 bg-violet-300/15 text-violet-50" : "border-white/15 bg-white/5 text-white/75"}`}><button type="button" onClick={() => onSelectPool(pool.id)}>{pool.name}</button><button type="button" onClick={() => remove.mutate({ office, id: pool.id })} aria-label={`Hapus ${pool.name}`} className="ml-1 text-white/60 hover:text-rose-200"><Trash2 className="h-3 w-3" /></button></span>)}</div>}</div></section>;
}
