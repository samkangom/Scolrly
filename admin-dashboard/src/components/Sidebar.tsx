"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Questions", href: "/questions", icon: "❓" },
  { label: "Concept Cards", href: "/concept-cards", icon: "🃏" },
  { label: "Chapters", href: "/chapters", icon: "📚" },
  { label: "Users", href: "/users", icon: "👥" },
  { label: "Rooms", href: "/rooms", icon: "🏠" },
  { label: "Notifications", href: "/notifications", icon: "🔔" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] min-h-screen bg-card border-r border-border-dark flex flex-col shrink-0">
      <div className="p-6 border-b border-border-dark">
        <h1 className="text-2xl font-bold text-brand">Scolrly</h1>
        <p className="text-xs text-text-muted mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? "text-brand border-l-3 border-brand bg-brand/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-card2 border-l-3 border-transparent"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border-dark">
        <p className="text-xs text-text-muted">v1.0.0</p>
      </div>
    </aside>
  );
}
