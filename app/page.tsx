import Link from "next/link";
import { redirect } from "next/navigation";
import { signInWithMagicLink } from "@/app/actions";
import { createServerSupabase } from "@/lib/supabase";

export default async function HomePage() {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const { data: interests } = await supabase.from("user_interests").select("id").eq("user_id", user.id).limit(1);
    if (interests?.length) redirect("/feed");
    redirect("/onboarding");
  }

  return (
    <section className="mx-auto mt-20 max-w-xl space-y-6">
      <h1 className="text-4xl font-bold">inFlow</h1>
      <p className="text-slate-300">AI-curated personalized news feed with explainable ranking.</p>
      <form action={signInWithMagicLink} className="card flex flex-col gap-3">
        <label className="text-sm">Email for magic link</label>
        <input name="email" type="email" required className="rounded bg-slate-800 p-2" placeholder="you@example.com" />
        <button className="rounded bg-accent p-2 font-semibold">Send magic link</button>
      </form>
      <Link className="text-sm text-blue-300 underline" href="/onboarding">
        Demo onboarding preview
      </Link>
    </section>
  );
}
