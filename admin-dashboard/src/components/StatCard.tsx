"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down";
  icon: string;
}

export default function StatCard({ label, value, change, changeType, icon }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border-dark hover:border-brand/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            changeType === "up"
              ? "bg-brand/20 text-brand"
              : "bg-danger/20 text-danger"
          }`}
        >
          {changeType === "up" ? "↑" : "↓"} {change}
        </span>
      </div>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-secondary mt-1">{label}</p>
    </div>
  );
}
