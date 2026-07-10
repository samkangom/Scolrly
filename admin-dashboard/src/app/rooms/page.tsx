"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { api, type AdminRoom } from "@/lib/api";

const SUBJECTS = ["biology", "physics", "chemistry"];

const emptyForm = {
  title: "",
  host: "BMI Faculty",
  subject: "biology",
  duration: 45,
  status: "live" as "live" | "scheduled",
  scheduledAt: "",
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get<{ rooms: AdminRoom[] }>("admin/rooms")
      .then((r) => { setRooms(r.rooms); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const liveRooms = rooms.filter((r) => r.status === "live");
  const scheduledRooms = rooms.filter((r) => r.status === "scheduled");

  const remove = async (room: AdminRoom) => {
    if (!confirm(`Delete room "${room.title}"?`)) return;
    try {
      await api.del(`admin/rooms/${room.id}`);
      setNotice(`Deleted "${room.title}"`);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Room name is required.");
      return;
    }
    setSaving(true);
    try {
      await api.post("admin/rooms", {
        title: form.title.trim(),
        host: form.host.trim() || "BMI Faculty",
        subject: form.subject,
        duration: Number(form.duration),
        status: form.status,
        scheduledAt: form.status === "scheduled" ? form.scheduledAt : null,
      });
      setNotice("Study room created.");
      setModalOpen(false);
      setForm(emptyForm);
      setError(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  const RoomCard = ({ room }: { room: AdminRoom }) => (
    <div className="bg-card rounded-xl border border-border-dark p-5 hover:border-brand/30 transition-colors">
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{room.title}</h3>
        <Badge label={room.status === "live" ? "LIVE" : "Scheduled"} color={room.status === "live" ? "green" : "blue"} />
      </div>
      <p className="text-xs text-text-secondary mb-1">Host: {room.host} · <span className="capitalize">{room.subject}</span></p>
      <p className="text-xs text-text-muted mb-3">{room.duration} min session{room.scheduledAt ? ` · ${room.scheduledAt}` : ""}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{room.totalMembers} members</span>
        <button onClick={() => remove(room)} className="text-xs text-danger hover:underline">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Study Room Scheduler</h1>
        <Button onClick={() => { setModalOpen(true); setError(null); }}>Create Room</Button>
      </div>

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

      {loading && <p className="text-sm text-text-muted">Loading rooms…</p>}

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" /> Live Rooms
        </h2>
        {liveRooms.length === 0 && !loading ? (
          <p className="text-sm text-text-muted">No live rooms right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveRooms.map((r) => <RoomCard key={r.id} room={r} />)}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Scheduled Rooms</h2>
        {scheduledRooms.length === 0 && !loading ? (
          <p className="text-sm text-text-muted">No scheduled rooms.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledRooms.map((r) => <RoomCard key={r.id} room={r} />)}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Study Room">
        <form className="space-y-4" onSubmit={save}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Room Name</label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="e.g. Organic Chemistry Marathon"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Host</label>
              <input type="text" className={`w-full ${selectClass}`} placeholder="Host name"
                value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Subject</label>
              <select className={`w-full ${selectClass}`} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Duration (min)</label>
              <input type="number" className={`w-full ${selectClass}`}
                value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Status</label>
              <select className={`w-full ${selectClass}`} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "live" | "scheduled" })}>
                <option value="live">Live now</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
          {form.status === "scheduled" && (
            <div>
              <label className="block text-sm text-text-secondary mb-1">Scheduled Time <span className="text-text-muted">(e.g. 8:00 PM)</span></label>
              <input type="text" className={`w-full ${selectClass}`} placeholder="8:00 PM"
                value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create Room"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
