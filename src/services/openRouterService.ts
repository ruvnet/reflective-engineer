import { OpenAI } from "@langchain/openai";

export function createOpenRouterClient(apiKey: string) {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    modelName: "openai/gpt-3.5-turbo",
    configuration: {
      baseHeaders: {
        "HTTP-Referer": "*",
        "X-Title": "Reflective Engineer",
        "Origin": "*"
      }
    }
  });
}
