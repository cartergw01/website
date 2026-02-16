"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useAppState } from "@/components/useAppState";
import { buildXShareUrl } from "@/lib/x";

export default function FeedPage() {
  const { prefs, rankedFeed, sources, setPrefs } = useAppState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeItem = rankedFeed[selectedIndex];
  const noSources = sources.length === 0;
  const noItems = rankedFeed.length === 0;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "j") setSelectedIndex((i) => Math.min(rankedFeed.length - 1, i + 1));
      if (event.key === "k") setSelectedIndex((i) => Math.max(0, i - 1));
      if (event.key === "s" && activeItem) {
        setPrefs((current) => ({
          ...current,
          savedItemIds: current.savedItemIds.includes(activeItem.id)
            ? current.savedItemIds
            : [...current.savedItemIds, activeItem.id]
        }));
      }
      if (event.key === "o" && activeItem) window.open(`/read/${activeItem.id}`, "_blank");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeItem, rankedFeed.length, setPrefs]);

  const savedSet = useMemo(() => new Set(prefs.savedItemIds), [prefs.savedItemIds]);

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <button
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm"
          onClick={() => setPrefs((current) => ({ ...current, compactMode: !current.compactMode }))}
        >
          Compact mode: {prefs.compactMode ? "On" : "Off"}
        </button>
      </header>

      {noSources && <div className="card text-sm text-slate-300">No sources yet. Open Sources and add an RSS feed to begin.</div>}
      {!noSources && noItems && (
        <div className="card text-sm text-slate-300">No feed items yet. If you are not in seed mode, run <code>npm run ingest</code>.</div>
      )}

      <div className="space-y-3">
        {rankedFeed.map((item, index) => (
          <article
            key={item.id}
            className={`card animate-[fadeIn_.2s_ease] ${selectedIndex === index ? "ring-1 ring-blue-400/40" : ""} ${prefs.compactMode ? "p-3" : "p-4"}`}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="flex items-start justify-between gap-3">
              <Link href={`/read/${item.id}`} className="text-lg font-medium text-slate-100 hover:text-blue-300">
                {item.title}
              </Link>
              <span className="text-xs text-slate-400">{new Date(item.publishedAt).toLocaleTimeString()}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{item.source} · Why shown: {item.whyShown}</p>
            {!prefs.compactMode && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
                {item.summaryBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Link href={`/cluster/${item.clusterId}`} className="rounded bg-slate-800 px-2 py-1">Full coverage</Link>
              <a href={buildXShareUrl({ title: item.title, url: item.url })} target="_blank" className="rounded bg-slate-800 px-2 py-1">Share to X</a>
              <button
                className="rounded bg-slate-800 px-2 py-1"
                onClick={() =>
                  setPrefs((current) => ({
                    ...current,
                    savedItemIds: savedSet.has(item.id)
                      ? current.savedItemIds.filter((id) => id !== item.id)
                      : [...current.savedItemIds, item.id]
                  }))
                }
              >
                {savedSet.has(item.id) ? "Unsave" : "Save"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-slate-500">Keyboard: j/k next/previous · o open · s save</p>
    </section>
  );
}
