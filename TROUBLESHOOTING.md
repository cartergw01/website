# Troubleshooting

## 1) npm install fails
Try:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 2) Blank feed
- Go to `/sources` and confirm at least one source is enabled.
- In non-seed mode, run:
```bash
npm run ingest
```

## 3) I do not have any keys yet
Use seed mode:
```bash
NEXT_PUBLIC_SEED_MODE=true
npm run dev
```

## 4) Build errors about environment
If running non-seed mode, set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (optional but recommended)

## 5) X connect not visible
It is hidden unless both are set:
- `NEXT_PUBLIC_ENABLE_X_OAUTH=true`
- `NEXT_PUBLIC_X_CLIENT_ID=<value>`
