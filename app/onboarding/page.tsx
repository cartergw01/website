import { redirect } from "next/navigation";
import { saveInterests } from "@/app/actions";
import { createServerSupabase } from "@/lib/supabase";

const starterInterests = ["AI", "Global markets", "Climate tech", "Cybersecurity", "Biotech", "Product design"];

export default async function OnboardingPage() {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
    <section className="mx-auto mt-10 max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold">Pick your interests</h1>
      <p className="text-slate-300">Add 5 to 15 topics, comma separated.</p>
      <div className="flex flex-wrap gap-2 text-xs text-slate-300">
        {starterInterests.map((interest) => (
          <span key={interest} className="rounded-full border border-slate-700 px-3 py-1">
            {interest}
          </span>
        ))}
      </div>
      <form action={saveInterests} className="card space-y-3">
        <textarea
          required
          minLength={10}
          name="interests"
          defaultValue={starterInterests.join(", ")}
          className="h-40 w-full rounded bg-slate-800 p-3"
        />
        <button className="rounded bg-accent px-4 py-2 font-semibold">Save interests</button>
      </form>
    </section>
  );
}
