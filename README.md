# inFlow

inFlow is a calm, fast, personalized news reader with seed mode by default (no keys needed).

## What works now
- Feedly-style sidebar and scan-friendly feed
- Arc-inspired polish (light motion, calm layout)
- Reeder-style reading mode page
- Source management (RSS add, enable/disable, reliability slider, Substack helper, OPML import)
- Share to X intent per story
- Optional X OAuth connection UI behind env flag
- Seed mode with local sample dataset (default)

## Quick start (no keys, no database)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

This default mode uses local seeded content and runs without Supabase or OpenAI.

## Commands
```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
npm run ingest
```

## Environment variables
Create `.env.local` as needed:

```bash
# Default is true if omitted
NEXT_PUBLIC_SEED_MODE=true

# Optional: enable X OAuth connect UI only when fully configured
NEXT_PUBLIC_ENABLE_X_OAUTH=false
NEXT_PUBLIC_X_CLIENT_ID=

# Optional non-seed backend setup
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Running with Supabase + pgvector (optional advanced mode)
1. Create a Supabase project.
2. Apply SQL migration in `supabase/migrations/001_init.sql`.
3. Ensure extension `vector` is available.
4. Set Supabase env vars and set `NEXT_PUBLIC_SEED_MODE=false`.

If OpenAI key is missing, app still runs with fallback summaries from RSS snippets.

## Sources and ingestion
- Add sources in `/sources`
- Substack: paste newsletter name or URL in Substack helper
- OPML import supported in Sources page
- RSS ingestion script (best-effort):
  ```bash
  npm run ingest
  ```
  This writes `data/ingested.json` from enabled sources.

## Optional X setup
- If `NEXT_PUBLIC_ENABLE_X_OAUTH=true` and `NEXT_PUBLIC_X_CLIENT_ID` is set, settings page indicates connect option availability.
- If not configured, only “Share to X” web intent is shown.

## Quality checks
Run before shipping:
```bash
npm run lint
npm run typecheck
npm test
npm run build
```
