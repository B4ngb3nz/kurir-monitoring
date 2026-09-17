import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Login gagal.");
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <form onSubmit={submit} className="w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-xl">
        <div className="text-center space-y-2">
          <img src="/logo.svg" alt="Logo" className="mx-auto h-16 w-16" />
          <h1 className="text-2xl font-semibold">Login Dashboard</h1>
          <p className="text-sm text-muted-foreground">Masuk untuk mengakses monitoring operasional.</p>
        </div>
        <div className="space-y-4">
          <Input autoFocus placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Memproses..." : "Masuk"}</Button>
      </form>
    </main>
  );
}
