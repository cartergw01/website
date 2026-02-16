"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/components/useAppState";

export default function SettingsPage() {
  const { prefs, setPrefs, config } = useAppState();
  const [value, setValue] = useState(prefs.interests.join(", "));

  const xStatus = useMemo(() => (config.xEnabled ? "Connected option available" : "Share-only mode (no OAuth configured)"), [config.xEnabled]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="card space-y-3">
        <p className="text-sm text-slate-300">Interests (comma separated)</p>
        <textarea className="h-24 w-full rounded bg-slate-800 p-2" value={value} onChange={(e) => setValue(e.target.value)} />
        <button
          className="rounded bg-blue-600 px-3 py-2 text-sm font-medium"
          onClick={() => setPrefs((current) => ({ ...current, interests: value.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 15) }))}
        >
          Save interests
        </button>
      </div>
      <div className="card text-sm text-slate-300">
        <p>Seed mode: {config.seedMode ? "On" : "Off"}</p>
        <p>OpenAI key: {config.openAIConfigured ? "Configured" : "Missing (safe fallback active)"}</p>
        <p>X integration: {xStatus}</p>
      </div>
    </section>
  );
}
