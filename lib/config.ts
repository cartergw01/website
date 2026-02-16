export function getAppConfig() {
  const seedMode = process.env.NEXT_PUBLIC_SEED_MODE !== "false";
  const xClientId = process.env.NEXT_PUBLIC_X_CLIENT_ID;
  const xEnabled = Boolean(xClientId && process.env.NEXT_PUBLIC_ENABLE_X_OAUTH === "true");

  return {
    seedMode,
    xEnabled,
    openAIConfigured: Boolean(process.env.OPENAI_API_KEY),
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  };
}

export function getStartupWarnings() {
  const config = getAppConfig();
  if (config.seedMode) {
    return ["Seed mode enabled: running with local demo data and no external keys required."];
  }

  const warnings: string[] = [];
  if (!config.supabaseConfigured) warnings.push("Supabase keys are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  if (!config.openAIConfigured) warnings.push("OPENAI_API_KEY is missing. Summaries/embeddings will fallback to RSS snippets.");
  return warnings;
}
