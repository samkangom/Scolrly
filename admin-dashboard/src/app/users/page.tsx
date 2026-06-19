"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";

interface User {
  id: number;
  name: string;
  email: string;
  class: string;
  subscription: "Free" | "Pro";
  streak: number;
  lastActive: string;
  questionsAttempted: number;
  accuracy: number;
  testsCompleted: number;
}

const sampleUsers: User[] = [
  { id: 1, name: "Aarav Sharma", email: "aarav.s@email.com", class: "12", subscription: "Pro", streak: 45, lastActive: "2 hours ago", questionsAttempted: 1234, accuracy: 78, testsCompleted: 34 },
  { id: 2, name: "Priya Patel", email: "priya.p@email.com", class: "12", subscription: "Pro", streak: 32, lastActive: "5 hours ago", questionsAttempted: 987, accuracy: 82, testsCompleted: 28 },
  { id: 3, name: "Rahul Kumar", email: "rahul.k@email.com", class: "11", subscription: "Free", streak: 12, lastActive: "1 day ago", questionsAttempted: 456, accuracy: 65, testsCompleted: 12 },
  { id: 4, name: "Sneha Reddy", email: "sneha.r@email.com", class: "Dropper", subscription: "Pro", streak: 67, lastActive: "30 min ago", questionsAttempted: 2341, accuracy: 85, testsCompleted: 56 },
  { id: 5, name: "Vikram Singh", email: "vikram.s@email.com", class: "12", subscription: "Free", streak: 3, lastActive: "3 days ago", questionsAttempted: 123, accuracy: 58, testsCompleted: 5 },
  { id: 6, name: "Ananya Gupta", email: "ananya.g@email.com", class: "12", subscription: "Pro", streak: 28, lastActive: "1 hour ago", questionsAttempted: 876, accuracy: 74, testsCompleted: 22 },
  { id: 7, name: "Karthik Nair", email: "karthik.n@email.com", class: "11", subscription: "Free", streak: 0, lastActive: "1 week ago", questionsAttempted: 67, accuracy: 52, testsCompleted: 2 },
  { id: 8, name: "Ishita Mehta", email: "ishita.m@email.com", class: "Dropper", subscription: "Pro", streak: 89, lastActive: "10 min ago", questionsAttempted: 3456, accuracy: 88, testsCompleted: 78 },
  { id: 9, name: "Rohan Joshi", email: "rohan.j@email.com", class: "12", subscription: "Free", streak: 7, lastActive: "2 days ago", questionsAttempted: 234, accuracy: 61, testsCompleted: 8 },
  { id: 10, name: "Divya Iyer", email: "divya.i@email.com", class: "12", subscription: "Pro", streak: 41, lastActive: "3 hours ago", questionsAttempted: 1567, accuracy: 79, testsCompleted: 41 },
];

const stats = [
  { label: "Total Users", value: "12,847", change: "12.5%", changeType: "up" as const, icon: "👥" },
  { label: "Active Today", value: "3,421", change: "8.2%", changeType: "up" as const, icon: "✅" },
  { label: "Pro Subscribers", value: "4,231", change: "5.7%", changeType: "up" as const, icon: "⭐" },
  { label: "Conversion Rate", value: "32.9%", change: "2.1%", changeType: "up" as const, icon: "📊" },
];

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns = [
    { key: "name", label: "Name", render: (row: Record<string, unknown>) => { const r = row as unknown as User; return <button className="text-accent-blue hover:underline text-left" onClick={() => setSelectedUser(r)}>{r.name}</button>; } },
    { key: "email", label: "Email", render: (row: Record<string, unknown>) => { const r = row as unknown as User; return <span className="text-text-secondary text-xs">{r.email}</span>; } },
    { key: "class", label: "Class", render: (row: Record<string, unknown>) => { const r = row as unknown as User; return <Badge label={r.class === "Dropper" ? "Dropper" : `Class ${r.class}`} color={r.class === "Dropper" ? "purple" : "blue"} />; } },
    { key: "subscription", label: "Subscription", render: (row: Record<string, unknown>) => { const r = row as unknown as User; return <Badge label={r.subscription} color={r.subscription === "Pro" ? "green" : "gray"} />; } },
    { key: "streak", label: "Streak", render: (row: Record<string, unknown>) => { const r = row as unknown as User; return <span>{r.streak} 🔥</span>; } },
    { key: "lastActive", label: "Last Active", render: (row: Record<string, unknown>) => { const r = row as unknown as User; return <span className="text-xs text-text-secondary">{r.lastActive}</span>; } },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Users</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex gap-6">
        <div className={selectedUser ? "flex-1" : "w-full"}>
          <DataTable columns={columns} data={sampleUsers as unknown as Record<string, unknown>[]} keyField="id" />
        </div>

        {selectedUser && (
          <div className="w-80 bg-card rounded-xl border border-border-dark p-5 shrink-0 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">{selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-text-primary text-sm">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Email</span><span className="text-text-primary">{selectedUser.email}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Class</span><span className="text-text-primary">{selectedUser.class}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Plan</span><Badge label={selectedUser.subscription} color={selectedUser.subscription === "Pro" ? "green" : "gray"} /></div>
              <hr className="border-border-dark" />
              <div className="flex justify-between"><span className="text-text-secondary">Questions</span><span className="text-text-primary">{selectedUser.questionsAttempted}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Accuracy</span><span className="text-brand">{selectedUser.accuracy}%</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Tests Done</span><span className="text-text-primary">{selectedUser.testsCompleted}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Streak</span><span className="text-accent-orange">{selectedUser.streak} days</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Last Active</span><span className="text-text-muted">{selectedUser.lastActive}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
