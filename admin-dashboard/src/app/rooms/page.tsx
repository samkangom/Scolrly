"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";

interface Room {
  id: number;
  name: string;
  host: string;
  chapter: string;
  members: number;
  maxMembers: number;
  status: "live" | "scheduled";
  time: string;
}

const sampleRooms: Room[] = [
  { id: 1, name: "Organic Chemistry Blast", host: "Dr. Mehra", chapter: "Organic Chemistry - Reactions", members: 18, maxMembers: 25, status: "live", time: "Started 45 min ago" },
  { id: 2, name: "Physics Problem Hour", host: "Prof. Iyer", chapter: "Laws of Motion", members: 12, maxMembers: 20, status: "live", time: "Started 20 min ago" },
  { id: 3, name: "Biology NCERT Review", host: "Dr. Sharma", chapter: "Human Physiology", members: 0, maxMembers: 30, status: "scheduled", time: "Today, 6:00 PM" },
  { id: 4, name: "Electrochemistry Deep Dive", host: "Prof. Gupta", chapter: "Electrochemistry", members: 0, maxMembers: 15, status: "scheduled", time: "Tomorrow, 10:00 AM" },
  { id: 5, name: "NEET Mock Discussion", host: "Dr. Reddy", chapter: "Full Syllabus", members: 0, maxMembers: 50, status: "scheduled", time: "Jun 21, 4:00 PM" },
];

export default function RoomsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const liveRooms = sampleRooms.filter((r) => r.status === "live");
  const scheduledRooms = sampleRooms.filter((r) => r.status === "scheduled");

  const selectClass = "bg-card2 border border-border-dark text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand";

  const RoomCard = ({ room }: { room: Room }) => (
    <div className="bg-card rounded-xl border border-border-dark p-5 hover:border-brand/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">{room.name}</h3>
        <Badge label={room.status === "live" ? "LIVE" : "Scheduled"} color={room.status === "live" ? "green" : "blue"} />
      </div>
      <p className="text-xs text-text-secondary mb-1">Host: {room.host}</p>
      <p className="text-xs text-text-muted mb-3">Chapter: {room.chapter}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">{room.members}/{room.maxMembers} members</span>
          <div className="w-16 h-1.5 bg-card2 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full" style={{ width: `${(room.members / room.maxMembers) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-text-muted">{room.time}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Study Room Scheduler</h1>
        <Button onClick={() => setModalOpen(true)}>Create Room</Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" /> Live Rooms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveRooms.map((r) => <RoomCard key={r.id} room={r} />)}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Scheduled Rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledRooms.map((r) => <RoomCard key={r.id} room={r} />)}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Study Room">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Room Name</label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="e.g. Organic Chemistry Marathon" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Host</label>
            <input type="text" className={`w-full ${selectClass}`} placeholder="Host name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Chapter</label>
              <select className={`w-full ${selectClass}`}>
                <option>Organic Chemistry</option><option>Laws of Motion</option><option>Human Physiology</option><option>Full Syllabus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Max Members</label>
              <input type="number" defaultValue={25} className={`w-full ${selectClass}`} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Scheduled Time</label>
            <input type="datetime-local" className={`w-full ${selectClass}`} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Room</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
