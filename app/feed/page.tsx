import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase";
import { getRankedFeedForUser } from "@/lib/feed";

export default async function FeedPage() {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const feed = await getRankedFeedForUser(user.id);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your inFlow feed</h1>
        <form action="/auth/signout" method="post">
          <button className="rounded border border-slate-700 px-3 py-1">Sign out</button>
        </form>
      </header>

      <div className="space-y-4">
        {feed.map((item) => (
          <article key={item.id} className="card space-y-2">
            <div className="flex items-center justify-between gap-4">
              <a className="text-xl font-semibold text-blue-300 hover:underline" href={item.url} target="_blank">
                {item.title}
              </a>
              <p className="text-xs text-slate-400">{item.sourceName}</p>
            </div>
            <p className="text-xs text-slate-400">{new Date(item.publishedAt).toLocaleString()}</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">
              {(item.summaryBullets.length ? item.summaryBullets : ["Summary pending", "Summary pending", "Summary pending"]).map((bullet, idx) => (
                <li key={`${item.id}-${idx}`}>{bullet}</li>
              ))}
            </ul>
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Why shown:</span> {item.whyShown}
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <form action="/api/feedback" method="post">
                <input type="hidden" name="clusterId" value={item.id} />
                <input type="hidden" name="action" value="more_like_this" />
                <button className="rounded bg-emerald-700 px-3 py-1">More like this</button>
              </form>
              <form action="/api/feedback" method="post">
                <input type="hidden" name="clusterId" value={item.id} />
                <input type="hidden" name="action" value="less_like_this" />
                <button className="rounded bg-amber-700 px-3 py-1">Less like this</button>
              </form>
              <form action="/api/hide-source" method="post">
                <input type="hidden" name="sourceId" value={item.sourceId} />
                <button className="rounded bg-rose-700 px-3 py-1">Hide source</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
