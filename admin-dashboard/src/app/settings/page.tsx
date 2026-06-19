"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [aiDoubtResolution, setAiDoubtResolution] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const inputClass =
    "w-full bg-[#222222] border border-[#2A2A2A] text-[#FFFFFF] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1DB954] placeholder-[#6B6B6B]";

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-[#1DB954]" : "bg-[#2A2A2A]"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? "translate-x-5" : ""}`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#FFFFFF]">Settings</h1>

      {/* General Settings */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">App Name</label>
            <input type="text" defaultValue="Scolrly" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Support Email</label>
            <input type="email" defaultValue="support@scolrly.com" className={inputClass} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#FFFFFF]">Maintenance Mode</p>
              <p className="text-xs text-[#6B6B6B]">Temporarily disable the app for all users</p>
            </div>
            <Toggle enabled={maintenanceMode} onToggle={() => setMaintenanceMode(!maintenanceMode)} />
          </div>
        </div>
      </div>

      {/* Content Settings */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">Content Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Questions per Day (Free)</label>
            <input type="number" defaultValue={20} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Max Mock Tests (Free)</label>
            <input type="number" defaultValue={3} className={inputClass} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#FFFFFF]">AI Doubt Resolution</p>
              <p className="text-xs text-[#6B6B6B]">Enable AI-powered doubt solving for users</p>
            </div>
            <Toggle enabled={aiDoubtResolution} onToggle={() => setAiDoubtResolution(!aiDoubtResolution)} />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Daily Reminder Time</label>
            <input type="time" defaultValue="18:00" className={inputClass} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#FFFFFF]">Weekly Report</p>
              <p className="text-xs text-[#6B6B6B]">Send weekly progress reports to all users</p>
            </div>
            <Toggle enabled={weeklyReport} onToggle={() => setWeeklyReport(!weeklyReport)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-black font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
