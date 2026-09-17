import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { CircleAlert, Wifi, WifiOff } from "lucide-react";

function formatCheckedAt(value?: string) {
  if (!value) return "memeriksa sumber…";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Jakarta" }).format(date);
}

export default function SourceConnectionStatus() {
  const connection = trpc.shipments.connectionStatus.useQuery(undefined, { refetchInterval: 30_000, refetchIntervalInBackground: true, retry: 0 });
  const status = connection.data;
  const connected = Boolean(status?.connected);
  const label = connection.isLoading ? "Memeriksa koneksi Kibana" : connected ? "Kibana terhubung" : status?.message ?? "Kibana belum terhubung";

  return <div className={`flex min-h-10 flex-wrap items-center justify-between gap-2 border-b px-4 py-2 text-xs ${connected ? "border-emerald-300/20 bg-emerald-300/[.06]" : "border-rose-300/20 bg-rose-300/[.07]"}`} role="status" aria-live="polite">
    <span className={`inline-flex items-center gap-2 font-medium ${connected ? "text-emerald-50" : "text-rose-50"}`}>
      {connection.isLoading ? <CircleAlert className="h-3.5 w-3.5 animate-pulse" /> : connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      <span>Status sumber data: {label}</span>
    </span>
    <Badge className={`border-0 text-[10px] ${connected ? "bg-emerald-300/15 text-emerald-50" : "bg-rose-300/15 text-rose-50"}`}>Diperiksa {formatCheckedAt(status?.checkedAt)}{status?.latencyMs !== null && status?.latencyMs !== undefined ? ` · ${status.latencyMs} ms` : ""}</Badge>
  </div>;
}
