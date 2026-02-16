"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStartupWarnings } from "@/lib/config";

const nav = [
  { href: "/feed", label: "Feed" },
  { href: "/sources", label: "Sources" },
  { href: "/saved", label: "Saved" },
  { href: "/settings", label: "Settings" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const warnings = getStartupWarnings();

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-r border-slate-800 bg-slate-950/80 p-4 backdrop-blur">
        <div className="mb-6 text-xl font-semibold">inFlow</div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition hover:translate-x-0.5 hover:bg-slate-800 ${pathname === item.href ? "bg-slate-800 text-white" : "text-slate-300"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-xs text-slate-400">Fast scanning + calm reading.</p>
      </aside>
      <div className="p-4 md:p-6">
        {warnings.length > 0 && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
            {warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
