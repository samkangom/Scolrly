"use client";

import { useEffect, useState } from "react";
import { api, type AdminSettings } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ settings: AdminSettings }>("admin/settings")
      .then((r) => setSettings(r.settings))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setSettings((s) => ({ ...s, [key]: value }));
  const bool = (key: string) => settings[key] === "true";

  const save = async () => {
    setSaving(true);
    try {
      const r = await api.put<{ settings: AdminSettings }>("admin/settings", settings);
      setSettings(r.settings);
      setNotice("Settings saved.");
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-[#222222] border border-[#2A2A2A] text-[#FFFFFF] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1DB954] placeholder-[#6B6B6B]";

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button type="button" onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-[#1DB954]" : "bg-[#2A2A2A]"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? "translate-x-5" : ""}`} />
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#FFFFFF]">Settings</h1>
        <p className="text-sm text-text-muted">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#FFFFFF]">Settings</h1>
        <span className="flex items-center gap-2 text-xs text-brand">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" /> Live from API
        </span>
      </div>

      {error && <div className="bg-card border border-danger/40 rounded-xl p-4 text-sm text-danger">{error}</div>}
      {notice && (
        <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 text-sm text-brand flex justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="hover:underline">dismiss</button>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">App Name</label>
            <input type="text" className={inputClass} value={settings.appName ?? ""} onChange={(e) => set("appName", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Support Email</label>
            <input type="email" className={inputClass} value={settings.supportEmail ?? ""} onChange={(e) => set("supportEmail", e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#FFFFFF]">Maintenance Mode</p>
              <p className="text-xs text-[#6B6B6B]">Temporarily disable the app for all users</p>
            </div>
            <Toggle enabled={bool("maintenanceMode")} onToggle={() => set("maintenanceMode", bool("maintenanceMode") ? "false" : "true")} />
          </div>
        </div>
      </div>

      {/* Content Settings */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">Content Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Questions per Day (Free)</label>
            <input type="number" className={inputClass} value={settings.freeQuestionsPerDay ?? ""} onChange={(e) => set("freeQuestionsPerDay", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Max Mock Tests (Free)</label>
            <input type="number" className={inputClass} value={settings.freeMaxMocks ?? ""} onChange={(e) => set("freeMaxMocks", e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#FFFFFF]">AI Doubt Resolution</p>
              <p className="text-xs text-[#6B6B6B]">Enable AI-powered doubt solving for users</p>
            </div>
            <Toggle enabled={bool("aiDoubtResolution")} onToggle={() => set("aiDoubtResolution", bool("aiDoubtResolution") ? "false" : "true")} />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] p-6">
        <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9A9A9A] mb-1">Daily Reminder Time</label>
            <input type="time" className={inputClass} value={settings.dailyReminderTime ?? "18:00"} onChange={(e) => set("dailyReminderTime", e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#FFFFFF]">Weekly Report</p>
              <p className="text-xs text-[#6B6B6B]">Send weekly progress reports to all users</p>
            </div>
            <Toggle enabled={bool("weeklyReport")} onToggle={() => set("weeklyReport", bool("weeklyReport") ? "false" : "true")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="bg-[#1DB954] hover:bg-[#1DB954]/90 disabled:opacity-50 text-black font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors">
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
