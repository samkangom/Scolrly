"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import DataTable from "@/components/DataTable";
import { api, timeAgo, type AdminNotification } from "@/lib/api";

const targets = ["All Users", "Class 12", "Class 11", "Droppers"];

export default function NotificationsPage() {
  const [history, setHistory] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState("All Users");
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduledAt, setScheduledAt] = useState("");

  const load = () => {
    api.get<{ notifications: AdminNotification[] }>("admin/notifications")
      .then((r) => { setHistory(r.notifications); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }
    setSending(true);
    try {
      const res = await api.post<{ delivered: number }>("admin/notifications", {
        title: title.trim(),
        body: body.trim(),
        target,
        status: scheduleType === "later" ? "scheduled" : "sent",
        scheduledAt: scheduleType === "later" ? scheduledAt : null,
      });
      setNotice(
        scheduleType === "later"
          ? "Notification scheduled."
          : `Sent to ${res.delivered} student${res.delivered === 1 ? "" : "s"}.`,
      );
      setTitle("");
      setBody("");
      setError(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const columns = [
    { key: "title", label: "Title", render: (row: Record<string, unknown>) => <span className="font-medium">{String(row.title)}</span> },
    { key: "target", label: "Target", render: (row: Record<string, unknown>) => <Badge label={String(row.target)} color="purple" /> },
    { key: "status", label: "Status", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminNotification; return <Badge label={r.status === "scheduled" ? "Scheduled" : "Sent"} color={r.status === "scheduled" ? "blue" : "green"} />; } },
    { key: "date", label: "When", render: (row: Record<string, unknown>) => { const r = row as unknown as AdminNotification; return <span className="text-xs text-text-secondary">{timeAgo(r.date)}</span>; } },
    { key: "delivered", label: "Delivered", render: (row: Record<string, unknown>) => <span className="text-brand">{Number(row.delivered).toLocaleString()}</span> },
  ];

  const selectClass =
    "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Push Notification Composer</h1>

      {error && (
        <div className="bg-card border border-danger/40 rounded-xl p-4 text-sm text-danger flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:underline">dismiss</button>
        </div>
      )}
      {notice && (
        <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 text-sm text-brand flex justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="hover:underline">dismiss</button>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border-dark p-6">
        <form className="space-y-4" onSubmit={send}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title</label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="Notification title"
              value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Body</label>
            <textarea rows={3} className="w-full bg-card2 border border-border-dark rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="Notification body text..." value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Target Audience</label>
              <select className={`w-full ${selectClass}`} value={target} onChange={(e) => setTarget(e.target.value)}>
                {targets.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Schedule</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setScheduleType("now")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    scheduleType === "now" ? "bg-brand text-black border-brand" : "bg-card2 border-border-dark text-text-secondary hover:text-text-primary"
                  }`}>Send Now</button>
                <button type="button" onClick={() => setScheduleType("later")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    scheduleType === "later" ? "bg-brand text-black border-brand" : "bg-card2 border-border-dark text-text-secondary hover:text-text-primary"
                  }`}>Schedule</button>
              </div>
            </div>
          </div>
          {scheduleType === "later" && (
            <div>
              <label className="block text-sm text-text-secondary mb-1">Schedule Time <span className="text-text-muted">(e.g. Tomorrow 6 PM)</span></label>
              <input type="text" className={`w-full ${selectClass}`} placeholder="Tomorrow, 6:00 PM"
                value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={sending}>{sending ? "Sending…" : scheduleType === "later" ? "Schedule Notification" : "Send Notification"}</Button>
          </div>
        </form>
      </div>

      {/* Mobile Preview */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">Preview</h2>
        <div className="flex justify-center">
          <div className="w-[280px] h-[420px] bg-[#0D0D0D] rounded-[32px] border-4 border-[#2A2A2A] p-3 relative overflow-hidden">
            <div className="w-24 h-6 bg-[#2A2A2A] rounded-full mx-auto mb-4" />
            <div className="flex justify-between text-[10px] text-[#6B6B6B] px-2 mb-6">
              <span>9:41</span><span>100%</span>
            </div>
            <div className="bg-[#222222] rounded-2xl p-4 mx-1 border border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#1DB954] rounded-md flex items-center justify-center text-[10px] text-black font-bold">S</div>
                <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wide">Scolrly</span>
                <span className="text-[10px] text-[#6B6B6B] ml-auto">now</span>
              </div>
              <p className="text-sm font-semibold text-[#FFFFFF] mb-1 line-clamp-2">{title || "Notification Title"}</p>
              <p className="text-xs text-[#9A9A9A] line-clamp-3">{body || "Notification body text will appear here..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Notification History</h2>
        {loading ? (
          <p className="text-sm text-text-muted">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-text-muted">No notifications sent yet — compose one above.</p>
        ) : (
          <DataTable columns={columns} data={history as unknown as Record<string, unknown>[]} keyField="id" />
        )}
      </div>
    </div>
  );
}
