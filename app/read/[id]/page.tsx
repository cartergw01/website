"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppState } from "@/components/useAppState";

export default function ReadPage() {
  const { id } = useParams<{ id: string }>();
  const { items } = useAppState();
  const item = items.find((entry) => entry.id === id);

  if (!item) return <div className="card">Article not found.</div>;

  return (
    <article className="reader-prose">
      <p className="text-xs uppercase tracking-wide text-slate-400">{item.source}</p>
      <h1 className="text-4xl font-semibold leading-tight text-white">{item.title}</h1>
      <p className="text-sm text-slate-400">{new Date(item.publishedAt).toLocaleString()}</p>
      <ul className="list-disc space-y-1 pl-5">
        {item.summaryBullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {item.whyItMatters && (
        <p className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-slate-200">Why it matters: {item.whyItMatters}</p>
      )}
      {item.cleanedText && <p className="text-sm text-slate-300">{item.cleanedText.slice(0, 280)}…</p>}
      <div className="flex gap-3">
        <a href={item.url} target="_blank" className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white">Open original</a>
        <Link href="/feed" className="rounded border border-slate-700 px-3 py-2 text-sm">Back to feed</Link>
      </div>
    </article>
  );
}
