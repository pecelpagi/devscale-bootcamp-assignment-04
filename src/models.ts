import { OpenAIClient } from "@anvia/openai";
import "dotenv/config";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey || apiKey === "your-api-key") {
  throw new Error("Set OPENAI_API_KEY in .env or your environment.");
}

const client = new OpenAIClient({
  apiKey,
  baseUrl: process.env.OPENAI_BASE_URL,
});

export function getModel() {
  console.log("DEBUG-AI_MODEL:", process.env.AI_MODEL);
  return client.completionModel({
    modelId: process.env.AI_MODEL || "gpt-6-luna",
  });
}
