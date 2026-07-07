"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import { api, timeAgo, type AdminUser } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get<{ users: AdminUser[] }>("admin/users")
      .then((r) => setUsers(r.users))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeToday = users.filter(
    (u) => Date.now() - new Date(u.lastActive.replace(" ", "T") + "Z").getTime() < 86400000,
  ).length;
  const avgAccuracy = users.length
    ? Math.round(users.reduce((s, u) => s + u.accuracy, 0) / users.length)
    : 0;
  const totalAttempts = users.reduce((s, u) => s + u.questionsAttempted, 0);

  const stats = [
    { label: "Total Students", value: users.length.toLocaleString(), change: "live", changeType: "up" as const, icon: "👥" },
    { label: "Active Today", value: activeToday.toLocaleString(), change: "live", changeType: "up" as const, icon: "✅" },
    { label: "Questions Attempted", value: totalAttempts.toLocaleString(), change: "live", changeType: "up" as const, icon: "✏️" },
    { label: "Avg Accuracy", value: `${avgAccuracy}%`, change: "live", changeType: "up" as const, icon: "📊" },
  ];

  const columns = [
    { key: "name", label: "Name", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminUser; return <button className="text-accent-blue hover:underline text-left" onClick={() => setSelectedUser(r)}>{r.name}</button>; } },
    { key: "email", label: "Account", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminUser; return <span className="text-text-secondary text-xs">{r.email}</span>; } },
    { key: "status", label: "Class", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminUser; return <Badge label={r.status} color={r.status === "Dropper" ? "purple" : "blue"} />; } },
    { key: "coaching", label: "Coaching", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminUser; return <span className="text-xs text-text-secondary">{r.coaching}</span>; } },
    { key: "streak", label: "Streak", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminUser; return <span>{r.streak} 🔥</span>; } },
    { key: "questionsAttempted", label: "Attempts" },
    { key: "accuracy", label: "Accuracy", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminUser; return <span className={r.accuracy >= 60 ? "text-brand" : "text-accent-orange"}>{r.accuracy}%</span>; } },
    { key: "lastActive", label: "Last Active", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminUser; return <span className="text-xs text-text-secondary">{timeAgo(r.lastActive)}</span>; } },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Students</h1>
        {!loading && !error && (
          <span className="flex items-center gap-2 text-xs text-brand">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" /> Live from API
          </span>
        )}
      </div>

      {error && (
        <div className="bg-card border border-danger/40 rounded-xl p-4 text-sm text-danger">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search students by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-md bg-[#222222] border border-[#2A2A2A] text-[#FFFFFF] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1DB954] placeholder-[#6B6B6B]"
        />
      </div>

      <div className="flex gap-6">
        <div className={selectedUser ? "flex-1" : "w-full"}>
          {loading ? (
            <p className="text-sm text-text-muted">Loading students…</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-text-muted">No students yet — they appear here after their first app launch.</p>
          ) : (
            <DataTable columns={columns} data={filteredUsers as unknown as Record<string, unknown>[]} keyField="id" />
          )}
        </div>

        {selectedUser && (
          <div className="w-80 bg-card rounded-xl border border-border-dark p-5 shrink-0 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">{selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-text-primary text-sm">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Account</span><span className="text-text-primary text-xs">{selectedUser.email}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Class</span><span className="text-text-primary">{selectedUser.status}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Coaching</span><span className="text-text-primary">{selectedUser.coaching}</span></div>
              <hr className="border-border-dark" />
              <div className="flex justify-between"><span className="text-text-secondary">Questions</span><span className="text-text-primary">{selectedUser.questionsAttempted}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Accuracy</span><span className="text-brand">{selectedUser.accuracy}%</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Mocks Done</span><span className="text-text-primary">{selectedUser.testsCompleted}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Streak</span><span className="text-accent-orange">{selectedUser.streak} days</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Last Active</span><span className="text-text-muted">{timeAgo(selectedUser.lastActive)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Joined</span><span className="text-text-muted">{timeAgo(selectedUser.joined)}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
