import fs from "node:fs/promises";
import path from "node:path";
import { seedSources } from "../lib/seed-data";

async function main() {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "data", "sources.json"), JSON.stringify(seedSources, null, 2));
  console.log(`Seeded ${seedSources.length} sources into data/sources.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
