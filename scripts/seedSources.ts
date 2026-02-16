import { createServiceSupabase } from "../lib/supabase";
import { SEED_SOURCES } from "./sources";

async function main() {
  const supabase = createServiceSupabase();

  const rows = SEED_SOURCES.map(([name, rss]) => ({
    name,
    rss_url: rss,
    reliability_score: 0.7
  }));

  const { error } = await supabase.from("sources").upsert(rows, { onConflict: "rss_url" });
  if (error) throw error;
  console.log(`Seeded ${rows.length} sources`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
