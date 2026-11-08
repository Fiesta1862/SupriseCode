import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
export type ProviderId = "openai" | "anthropic" | "google" | "openrouter";
export const providerDefaults: Record<ProviderId, string> = {
  openai: "gpt-4.1", anthropic: "claude-sonnet-4-5", google: "gemini-2.5-pro", openrouter: "openai/gpt-4.1"
};
export function getModel(provider: ProviderId, modelId?: string) {
  const model = modelId?.trim() || providerDefaults[provider];
  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) throw new Error("Add OPENAI_API_KEY in Vercel environment variables.");
    return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(model);
  }
  if (provider === "anthropic") {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("Add ANTHROPIC_API_KEY in Vercel environment variables.");
    return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(model);
  }
  if (provider === "google") {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error("Add GOOGLE_GENERATIVE_AI_API_KEY in Vercel environment variables.");
    return createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })(model);
  }
  if (!process.env.OPENROUTER_API_KEY) throw new Error("Add OPENROUTER_API_KEY in Vercel environment variables.");
  return createOpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1", headers: { "X-Title": "SupriseCode" } })(model);
}
