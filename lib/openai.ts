export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}
