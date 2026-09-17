import DashboardLayout from "@/components/DashboardLayout";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowDownToLine, ArrowUpFromLine, BarChart3, BookOpen, CheckCircle2, Map, MessageCircleQuestion, MousePointer2, Route, Search, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

const initialMessages: Message[] = [{ role: "assistant", content: "Selamat datang di User Manual. Saya dapat menjelaskan cara memakai menu aplikasi. Untuk angka operasional yang akurat, buka menu terkait, terapkan filter, lalu gunakan data yang tampil sebagai konteks laporan; saya tidak akan menebak angka yang tidak tersedia." }];

const steps = [
  { number: "01", title: "Pilih menu", text: "Gunakan sidebar untuk membuka Incoming, Outgoing, Tracking, atau Monitoring Kurir.", icon: MousePointer2, tone: "from-cyan-500/20 to-cyan-300/5" },
  { number: "02", title: "Atur filter", text: "Pilih tanggal atau rentang tanggal, kantor, status, produk, dan opsi lain yang diperlukan.", icon: Search, tone: "from-violet-500/20 to-violet-300/5" },
  { number: "03", title: "Tampilkan data", text: "Tekan Tampilkan atau Terapkan agar aplikasi mengambil data terbaru dari sumber operasional.", icon: BarChart3, tone: "from-emerald-500/20 to-emerald-300/5" },
  { number: "04", title: "Telusuri & unduh", text: "Klik baris untuk detail atau histori, lihat peta, lalu ekspor tabel untuk laporan.", icon: CheckCircle2, tone: "from-amber-500/20 to-amber-300/5" },
];

const menuGuides = [
  { icon: ArrowDownToLine, title: "Incoming", text: "Melihat paket berdasarkan kantor tujuan, status, produk, SLA, dan COD." },
  { icon: ArrowUpFromLine, title: "Outgoing", text: "Melihat paket berdasarkan kantor asal, loket posting, pelanggan, dan pendapatan." },
  { icon: Route, title: "Monitoring Kurir", text: "Membandingkan performa kurir, COD, Over SLA, kelengkapan POD, rute, dan ekspor." },
  { icon: Map, title: "Tracking", text: "Masukkan satu atau beberapa nomor resi untuk melihat detail, histori, foto, dan koordinat." },
];

export default function Help() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [context, setContext] = useState("");
  const ask = trpc.help.ask.useMutation({ onSuccess: ({ answer }) => setMessages(current => [...current, { role: "assistant", content: answer }]), onError: error => setMessages(current => [...current, { role: "assistant", content: `Permintaan belum dapat diproses: ${error.message}` }]) });
  const handleSend = (question: string) => { setMessages(current => [...current, { role: "user", content: question }]); ask.mutate({ question, context }); };

  return <DashboardLayout><div className="mx-auto max-w-7xl space-y-6">
    <header className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-950/80 via-slate-950 to-violet-950/70 p-6 shadow-2xl sm:p-8"><div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200"><BookOpen className="h-4 w-4" />Pusat bantuan</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">User Manual Aplikasi</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">Panduan singkat untuk mengambil data operasional, membaca ringkasan, membuka histori, dan membuat laporan tanpa menyimpan data kiriman di aplikasi.</p></div><div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs text-white"><ShieldCheck className="h-4 w-4 text-emerald-300" />Data dibaca langsung dari sumber operasional</div></div></header>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map(step => <Card key={step.number} className={`overflow-hidden border-white/10 bg-gradient-to-br ${step.tone} text-white`}><CardContent className="p-5"><div className="flex items-start justify-between"><span className="font-mono text-2xl font-bold text-white/35">{step.number}</span><span className="rounded-xl border border-white/10 bg-slate-950/35 p-2"><step.icon className="h-5 w-5 text-cyan-200" /></span></div><h2 className="mt-6 text-base font-semibold text-white">{step.title}</h2><p className="mt-2 text-xs leading-5 text-white/70">{step.text}</p></CardContent></Card>)}</section>
    <section className="grid gap-4 lg:grid-cols-2">{menuGuides.map(item => <Card key={item.title} className="border-white/10 bg-slate-900/70 text-white"><CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2"><span className="rounded-xl bg-cyan-300/10 p-2 text-cyan-200"><item.icon className="h-5 w-5" /></span><CardTitle className="text-base text-white">{item.title}</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-white/70">{item.text}</p></CardContent></Card>)}</section>
    <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><Card className="border-white/10 bg-slate-900/70 text-white"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-white"><MessageCircleQuestion className="h-5 w-5 text-cyan-200" />Tanya asisten aplikasi</CardTitle><p className="text-sm text-white/65">Tanyakan cara memakai fitur atau minta penjelasan atas data yang sedang Anda lihat. Jawaban angka hanya diberikan jika konteks data disediakan.</p></CardHeader><CardContent><AIChatBox messages={messages} onSendMessage={handleSend} isLoading={ask.isPending} height="420px" emptyStateMessage="Tulis pertanyaan tentang cara menggunakan aplikasi…" suggestedPrompts={["Bagaimana cara mencari histori satu resi?", "Bagaimana cara mengekspor laporan Monitoring Kurir?", "Apa arti Over SLA dan Intercepted?"]} /></CardContent></Card><Card className="border-white/10 bg-slate-900/70 text-white"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-white"><Send className="h-5 w-5 text-violet-200" />Konteks data opsional</CardTitle><p className="text-sm text-white/65">Salin ringkasan atau baris tabel yang sedang Anda lihat ke kolom ini bila ingin meminta penjelasan spesifik. Jangan masukkan kredensial.</p></CardHeader><CardContent className="space-y-4"><Input value={context} onChange={event => setContext(event.target.value)} placeholder="Contoh: Kurir A; Total COD Rp...; Over SLA 4" className="border-white/15 bg-slate-950 text-white placeholder:text-white/45" /><div className="rounded-2xl border border-violet-300/15 bg-violet-300/5 p-4 text-xs leading-5 text-white/70"><p className="font-semibold text-violet-100">Contoh alur</p><p className="mt-2">1. Terapkan filter di Monitoring Kurir. 2. Salin ringkasan yang terlihat. 3. Tempel di sini. 4. Tanyakan, misalnya: “Kurir mana yang memiliki Over SLA terbanyak?”</p></div><p className="flex items-start gap-2 text-xs text-white/55"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />Asisten tidak menggantikan query sumber dan tidak mengarang angka. Jika data tidak ada di konteks, asisten akan meminta Anda membuka menu dan menerapkan filter yang sesuai.</p></CardContent></Card></section>
  </div></DashboardLayout>;
}
