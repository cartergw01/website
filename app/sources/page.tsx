"use client";

import { ChangeEvent, useState } from "react";
import { useAppState } from "@/components/useAppState";

function normalizeSubstack(input: string) {
  const value = input.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!value) return "";
  if (value.includes("substack.com")) return `https://${value.split("?")[0]}/feed`;
  return `https://${value}.substack.com/feed`;
}

export default function SourcesPage() {
  const { sources, setSources } = useAppState();
  const [rssUrl, setRssUrl] = useState("");
  const [substackInput, setSubstackInput] = useState("");

  const addSource = (url: string, name?: string) => {
    try {
      const parsed = new URL(url);
      const id = `src-${Date.now()}`;
      setSources((current) => [...current, { id, name: name || parsed.hostname, rssUrl: parsed.toString(), enabled: true, reliability: 0.5, tags: [] }]);
      setRssUrl("");
    } catch {
      alert("Please enter a valid RSS URL.");
    }
  };

  const onOpml = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const outlines = Array.from(xml.querySelectorAll("outline[xmlUrl]"));
    const imported = outlines.map((outline, idx) => ({
      id: `opml-${Date.now()}-${idx}`,
      name: outline.getAttribute("title") || outline.getAttribute("text") || "Imported source",
      rssUrl: outline.getAttribute("xmlUrl") || "",
      enabled: true,
      reliability: 0.5,
      tags: [] as string[]
    })).filter((row) => row.rssUrl);

    setSources((current) => [...current, ...imported]);
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Sources</h1>

      <div className="card grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-slate-300">Add RSS source</p>
          <input className="w-full rounded bg-slate-800 p-2 text-sm" value={rssUrl} onChange={(e) => setRssUrl(e.target.value)} placeholder="https://example.com/rss.xml" />
          <button className="rounded bg-blue-600 px-3 py-2 text-sm" onClick={() => addSource(rssUrl)}>Add source</button>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-300">Substack helper</p>
          <input className="w-full rounded bg-slate-800 p-2 text-sm" value={substackInput} onChange={(e) => setSubstackInput(e.target.value)} placeholder="platformer or platformer.substack.com" />
          <div className="flex gap-2">
            <button className="rounded bg-violet-600 px-3 py-2 text-sm" onClick={() => addSource(normalizeSubstack(substackInput), `${substackInput} Substack`)}>Use inferred RSS</button>
            <label className="rounded border border-slate-700 px-3 py-2 text-sm">
              Import OPML
              <input type="file" accept=".opml,.xml,text/xml" className="hidden" onChange={onOpml} />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.id} className="card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{source.name}</p>
                <p className="text-xs text-slate-400">{source.rssUrl}</p>
              </div>
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={source.enabled}
                  onChange={(e) =>
                    setSources((current) =>
                      current.map((entry) => (entry.id === source.id ? { ...entry, enabled: e.target.checked } : entry))
                    )
                  }
                />{" "}
                Enabled
              </label>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-400">Reliability: {source.reliability.toFixed(2)}</p>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={source.reliability}
                onChange={(e) =>
                  setSources((current) =>
                    current.map((entry) => (entry.id === source.id ? { ...entry, reliability: Number(e.target.value) } : entry))
                  )
                }
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
