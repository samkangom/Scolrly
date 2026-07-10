"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border-dark rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center text-black font-bold text-xl">S</div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">Scolrly Admin</h1>
            <p className="text-xs text-text-muted">Bright Mind Institute</p>
          </div>
        </div>

        <label className="block text-sm text-text-secondary mb-2">Dashboard password</label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand mb-4"
        />

        {error && (
          <div className="bg-danger/10 border border-danger/40 rounded-lg p-3 text-sm text-danger mb-4">{error}</div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 text-black font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-text-muted mt-4 text-center">
          Access is restricted to BMI faculty.
        </p>
      </form>
    </div>
  );
}
