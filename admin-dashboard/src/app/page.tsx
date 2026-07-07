"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { api, type Overview } from "@/lib/api";

// Funnel stays illustrative until subscriptions go live.
const funnelSteps = [
  { label: "App Install", value: 12847, pct: 100 },
  { label: "Sign Up", value: 9842, pct: 76 },
  { label: "Completed 1 Test", value: 5421, pct: 42 },
  { label: "Pro Trial", value: 2847, pct: 22 },
  { label: "Pro Subscriber", value: 1247, pct: 10 },
];

export default function Dashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Overview>("admin/overview").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
        <div className="bg-card border border-danger/40 rounded-xl p-5 text-sm text-danger">
          Couldn&apos;t reach the Scolrly API: {error}
        </div>
      </div>
    );
  }

  const s = data?.stats;
  const stats = [
    { label: "Total Students", value: s ? s.users.toLocaleString() : "—", change: "live", changeType: "up" as const, icon: "👥" },
    { label: "Active Today", value: s ? s.activeToday.toLocaleString() : "—", change: "live", changeType: "up" as const, icon: "📈" },
    { label: "Questions in Bank", value: s ? s.questions.toLocaleString() : "—", change: "live", changeType: "up" as const, icon: "❓" },
    { label: "Live Rooms", value: s ? s.liveRooms.toLocaleString() : "—", change: "live", changeType: "up" as const, icon: "🏠" },
  ];

  const maxAttempts = Math.max(1, ...(data?.activity.map((d) => d.attempts) ?? [1]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
        {data && (
          <span className="flex items-center gap-2 text-xs text-brand">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" /> Live from API
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => (
          <StatCard key={st.label} {...st} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Attempts Today", value: s?.attemptsToday ?? "—", icon: "✏️" },
          { label: "Doubts Asked", value: s?.doubts ?? "—", icon: "💬" },
          { label: "Mock Results", value: s?.mockResults ?? "—", icon: "📝" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-xl border border-border-dark p-4 flex items-center gap-3">
            <span className="text-xl">{m.icon}</span>
            <div>
              <p className="text-xl font-bold text-text-primary">{m.value}</p>
              <p className="text-xs text-text-secondary">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity trend (live) */}
        <div className="bg-card rounded-xl border border-border-dark p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Question Attempts (Last 7 Days)</h3>
          <div className="h-48 flex items-end gap-3">
            {(data?.activity ?? []).map((d, i) => (
              <div key={`${d.day}-${i}`} className="flex-1 flex flex-col items-center justify-end h-full group">
                <span className="text-[10px] text-[#9A9A9A] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.attempts} attempts · {d.activeUsers} students
                </span>
                <div
                  className="w-full bg-[#1DB954]/60 rounded-t-md hover:bg-[#1DB954] transition-colors"
                  style={{ height: `${Math.max(2, (d.attempts / maxAttempts) * 100)}%` }}
                />
                <span className="text-[10px] text-[#6B6B6B] mt-2">{d.day}</span>
              </div>
            ))}
            {!data && <p className="text-xs text-text-muted m-auto">Loading…</p>}
          </div>
        </div>

        {/* Most Failed Chapters (live) */}
        <div className="bg-card rounded-xl border border-border-dark p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Most Failed Chapters</h3>
          <div className="space-y-3">
            {(data?.failedChapters ?? []).map((ch) => (
              <div key={ch.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-primary truncate mr-2">
                    {ch.name}
                    <span className="text-text-muted ml-2 capitalize">{ch.subject}</span>
                    {ch.live && <span className="text-brand ml-2">● live data</span>}
                  </span>
                  <span className="text-accent-orange">{ch.failPct}%</span>
                </div>
                <div className="h-2 bg-card2 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-orange rounded-full" style={{ width: `${ch.failPct}%` }} />
                </div>
              </div>
            ))}
            {!data && <p className="text-xs text-text-muted">Loading…</p>}
          </div>
        </div>

        {/* Subscription Funnel (illustrative until payments launch) */}
        <div className="bg-card rounded-xl border border-border-dark p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-text-secondary mb-1">Subscription Funnel</h3>
          <p className="text-[10px] text-text-muted mb-4">Sample data — activates with payments</p>
          <div className="space-y-2">
            {funnelSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className="h-10 rounded-lg flex items-center px-3 text-xs font-medium text-text-primary"
                  style={{
                    width: `${step.pct}%`,
                    minWidth: "80px",
                    backgroundColor: `rgba(29, 185, 84, ${0.15 + (1 - i / funnelSteps.length) * 0.4})`,
                  }}
                >
                  {step.label}
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap">
                  {step.value.toLocaleString()} ({step.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
