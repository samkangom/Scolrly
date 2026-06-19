"use client";

import StatCard from "@/components/StatCard";

const stats = [
  { label: "Total Users", value: "12,847", change: "12.5%", changeType: "up" as const, icon: "👥" },
  { label: "Daily Active Users", value: "3,421", change: "8.2%", changeType: "up" as const, icon: "📈" },
  { label: "Questions in Bank", value: "2,847", change: "3.1%", changeType: "up" as const, icon: "❓" },
  { label: "Active Rooms", value: "2", change: "1", changeType: "down" as const, icon: "🏠" },
];

const failedChapters = [
  { name: "Organic Chemistry - Reactions", pct: 78 },
  { name: "Human Physiology - Nervous System", pct: 72 },
  { name: "Genetics - Molecular Basis", pct: 68 },
  { name: "Electrochemistry", pct: 65 },
  { name: "Thermodynamics", pct: 61 },
  { name: "Cell Biology - Division", pct: 58 },
];

const funnelSteps = [
  { label: "App Install", value: 12847, pct: 100 },
  { label: "Sign Up", value: 9842, pct: 76 },
  { label: "Completed 1 Test", value: 5421, pct: 42 },
  { label: "Pro Trial", value: 2847, pct: 22 },
  { label: "Pro Subscriber", value: 1247, pct: 10 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DAU/MAU Trend */}
        <div className="bg-card rounded-xl border border-border-dark p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">DAU / MAU Trend (Last 7 Days)</h3>
          <div className="h-48 flex items-end gap-3">
            {[
              { day: "Mon", value: 2800 },
              { day: "Tue", value: 3100 },
              { day: "Wed", value: 2950 },
              { day: "Thu", value: 3200 },
              { day: "Fri", value: 3421 },
              { day: "Sat", value: 3350 },
              { day: "Sun", value: 3500 },
            ].map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full group">
                <span className="text-[10px] text-[#9A9A9A] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{d.value.toLocaleString()}</span>
                <div
                  className="w-full bg-[#1DB954]/60 rounded-t-md hover:bg-[#1DB954] transition-colors"
                  style={{ height: `${(d.value / 3500) * 100}%` }}
                />
                <span className="text-[10px] text-[#6B6B6B] mt-2">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Curve */}
        <div className="bg-card rounded-xl border border-border-dark p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Retention Curve</h3>
          <div className="h-48 relative">
            <svg viewBox="0 0 300 150" className="w-full h-full">
              <polyline
                fill="none"
                stroke="#1DB954"
                strokeWidth="2"
                points="0,10 30,25 60,45 90,60 120,72 150,82 180,90 210,97 240,103 270,108 300,112"
              />
              <polyline
                fill="url(#retGrad)"
                stroke="none"
                points="0,10 30,25 60,45 90,60 120,72 150,82 180,90 210,97 240,103 270,108 300,112 300,150 0,150"
              />
              <defs>
                <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1DB954" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>Day 1</span><span>Day 7</span><span>Day 30</span>
          </div>
        </div>

        {/* Most Failed Chapters */}
        <div className="bg-card rounded-xl border border-border-dark p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Most Failed Chapters</h3>
          <div className="space-y-3">
            {failedChapters.map((ch) => (
              <div key={ch.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-primary truncate mr-2">{ch.name}</span>
                  <span className="text-accent-orange">{ch.pct}%</span>
                </div>
                <div className="h-2 bg-card2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-orange rounded-full"
                    style={{ width: `${ch.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Funnel */}
        <div className="bg-card rounded-xl border border-border-dark p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">Subscription Funnel</h3>
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
