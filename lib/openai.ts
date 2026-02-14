import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000)
  });
  return response.data[0].embedding;
}

export async function summarizeCluster(input: { title: string; content: string }) {
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: `Summarize this news article as JSON with keys bullets (array of 3 short bullets) and why_it_matters (string).\nTitle: ${input.title}\n\nContent:\n${input.content.slice(0, 12000)}`,
    text: { format: { type: "json_object" } }
  });

  const parsed = JSON.parse(response.output_text || "{}");
  return {
    bullets: (parsed.bullets ?? []).slice(0, 3),
    whyItMatters: parsed.why_it_matters ?? ""
  };
}
