"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppState } from "@/components/useAppState";

export default function ClusterPage() {
  const { id } = useParams<{ id: string }>();
  const { items } = useAppState();
  const clusterItems = items.filter((item) => item.clusterId === id);
  const canonical = clusterItems[0];

  if (!canonical) return <div className="card">Cluster not found.</div>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Full coverage</h1>
      <article className="card space-y-2">
        <p className="text-xs text-slate-400">Canonical story</p>
        <Link href={`/read/${canonical.id}`} className="text-xl font-medium text-blue-300">{canonical.title}</Link>
        <ul className="list-disc pl-5 text-sm text-slate-200">
          {canonical.summaryBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </article>
      <div className="space-y-2">
        {clusterItems.map((item) => (
          <a key={item.id} href={item.url} target="_blank" className="card block text-sm">
            <p className="font-medium text-slate-100">{item.title}</p>
            <p className="text-xs text-slate-400">{item.source}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
