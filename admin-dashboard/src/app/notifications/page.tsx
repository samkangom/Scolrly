"use client";

import { useState, useRef } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";

interface Notification {
  id: number;
  title: string;
  body: string;
  target: string;
  sentDate: string;
  deliveryCount: number;
}

const pastNotifications: Notification[] = [
  { id: 1, title: "New Mock Test Available!", body: "NEET 2024 Pattern Mock Test #5 is live. Attempt now!", target: "All Users", sentDate: "Jun 18, 2026", deliveryCount: 11234 },
  { id: 2, title: "Pro Offer: 40% Off", body: "Limited time offer on Pro subscription. Unlock all features!", target: "Free Users", sentDate: "Jun 15, 2026", deliveryCount: 8612 },
  { id: 3, title: "Biology PYQ Marathon", body: "Join the live Biology PYQ solving session at 6 PM today", target: "Class 12", sentDate: "Jun 14, 2026", deliveryCount: 4521 },
  { id: 4, title: "Streak Reminder", body: "Don't break your streak! Complete at least 10 questions today", target: "All Users", sentDate: "Jun 13, 2026", deliveryCount: 10847 },
  { id: 5, title: "New Concept Cards", body: "15 new concept cards added for Organic Chemistry", target: "Pro Users", sentDate: "Jun 12, 2026", deliveryCount: 3892 },
  { id: 6, title: "NEET Countdown: 30 Days", body: "Only 30 days left! Check your readiness with our diagnostic test", target: "Droppers", sentDate: "Jun 10, 2026", deliveryCount: 1247 },
];

const targets = ["All Users", "Pro Users", "Free Users", "Class 12", "Class 11", "Droppers"];

export default function NotificationsPage() {
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [previewTitle, setPreviewTitle] = useState("Notification Title");
  const [previewBody, setPreviewBody] = useState("Notification body text will appear here...");

  const columns = [
    { key: "title", label: "Title", render: (row: Record<string, unknown>) => <span className="font-medium">{String(row.title)}</span> },
    { key: "target", label: "Target", render: (row: Record<string, unknown>) => <Badge label={String(row.target)} color="purple" /> },
    { key: "sentDate", label: "Sent Date" },
    { key: "deliveryCount", label: "Delivered", render: (row: Record<string, unknown>) => <span className="text-brand">{Number(row.deliveryCount).toLocaleString()}</span> },
  ];

  const selectClass = "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Push Notification Composer</h1>

      <div className="bg-card rounded-xl border border-border-dark p-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title</label>
            <input type="text" ref={titleRef} className={`w-full ${selectClass}`} placeholder="Notification title" onChange={(e) => setPreviewTitle(e.target.value || "Notification Title")} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Body</label>
            <textarea ref={bodyRef} rows={3} className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand" placeholder="Notification body text..." onChange={(e) => setPreviewBody(e.target.value || "Notification body text will appear here...")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Target Audience</label>
              <select className={`w-full ${selectClass}`}>
                {targets.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Schedule</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleType("now")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    scheduleType === "now" ? "bg-brand text-black border-brand" : "bg-card2 border-border-dark text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Send Now
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType("later")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    scheduleType === "later" ? "bg-brand text-black border-brand" : "bg-card2 border-border-dark text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
          {scheduleType === "later" && (
            <div>
              <label className="block text-sm text-text-secondary mb-1">Schedule Date & Time</label>
              <input type="datetime-local" className={`w-full ${selectClass}`} />
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button type="submit">Send Notification</Button>
          </div>
        </form>
      </div>

      {/* Mobile Preview */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">Preview</h2>
        <div className="flex justify-center">
          <div className="w-[280px] h-[500px] bg-[#0D0D0D] rounded-[32px] border-4 border-[#2A2A2A] p-3 relative overflow-hidden">
            {/* Phone notch */}
            <div className="w-24 h-6 bg-[#2A2A2A] rounded-full mx-auto mb-4" />
            {/* Status bar */}
            <div className="flex justify-between text-[10px] text-[#6B6B6B] px-2 mb-6">
              <span>9:41</span>
              <span>100%</span>
            </div>
            {/* Notification card */}
            <div className="bg-[#222222] rounded-2xl p-4 mx-1 border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#1DB954] rounded-md flex items-center justify-center text-[10px]">S</div>
                <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wide">Scolrly</span>
                <span className="text-[10px] text-[#6B6B6B] ml-auto">now</span>
              </div>
              <p className="text-sm font-semibold text-[#FFFFFF] mb-1 line-clamp-2">{previewTitle}</p>
              <p className="text-xs text-[#9A9A9A] line-clamp-3">{previewBody}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Notification History</h2>
        <DataTable columns={columns} data={pastNotifications as unknown as Record<string, unknown>[]} keyField="id" />
      </div>
    </div>
  );
}
