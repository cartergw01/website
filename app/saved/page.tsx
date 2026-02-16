"use client";

import Link from "next/link";
import { useAppState } from "@/components/useAppState";

export default function SavedPage() {
  const { items, prefs } = useAppState();
  const saved = items.filter((item) => prefs.savedItemIds.includes(item.id));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Saved</h1>
      {saved.length === 0 ? (
        <div className="card text-sm text-slate-300">No saved stories yet.</div>
      ) : (
        saved.map((item) => (
          <Link key={item.id} href={`/read/${item.id}`} className="card block">
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-slate-400">{item.source}</p>
          </Link>
        ))
      )}
    </section>
  );
}
