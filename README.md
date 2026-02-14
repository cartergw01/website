# inFlow MVP

AI-curated personalized news feed built with Next.js + Supabase + OpenAI.

## Stack
- Next.js 14 (TypeScript) + Tailwind
- Supabase Postgres/Auth (email magic link)
- pgvector for embeddings
- API routes and server actions
- Background ingestion script (`npm run ingest`)

## 1) Supabase setup
1. Create a Supabase project.
2. In SQL editor run `supabase/migrations/001_init.sql`.
3. Enable email auth (magic link) in Authentication settings.
4. Copy project URL + anon key + service role key.

## 2) Environment variables
Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
```

## 3) Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4) Seed RSS sources

```bash
npm run seed:sources
```

Seeds 20 well-known sources in `sources` table.

## 5) Run ingestion pipeline

```bash
npm run ingest
```

Pipeline steps:
- fetch RSS items
- fetch article HTML + extract readable text
- dedupe by URL and content hash
- embed text with OpenAI
- cluster near duplicates (48h window)
- choose/update canonical article
- generate summary bullets + why-it-matters

## 6) Tests

```bash
npm test
```

Includes unit tests for ranking behavior and clustering threshold.

## Notes
- App never renders full cleaned article text; feed only shows summaries and source links.
- Ranking uses similarity to user interests + recency + source reliability + user feedback.
