import { createTool } from "@anvia/core";
import { tavily } from "@tavily/core";
import z from "zod";
import "dotenv/config";

export function normalizeStockCode(stockCode: string): string {
  return stockCode.trim().toUpperCase();
}

const searchSchema = z.object({
  stockCode: z.string().describe("The Indonesian Stock Exchange code, for example BBCA or ADRO"),
});

type SearchResult = {
  title: string;
  url: string;
  content: string;
  date?: string;
};

function makeQuery(stockCode: string, focus: string): string {
  return `Indonesian Stock Exchange IDX ${stockCode} ${focus}. Use reliable company filings, annual reports, IDX, or investor-relations sources where possible. The stock code is an Indonesian listed company, not a foreign ticker.`;
}

export const stockSearch = createTool({
  name: "stockSearch",
  description: "Research one Indonesian listed company with Tavily and return structured, cited web evidence for its stock report.",
  inputSchema: searchSchema,
  execute: async ({ stockCode }) => {
    const code = normalizeStockCode(stockCode);
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error("TAVILY_API_KEY is not configured");
    }

    const client = tavily({ apiKey });
    const queries = [
      makeQuery(code, "latest cash and cash equivalents, total debt, annual revenue, and annual net profit"),
      makeQuery(code, "company name, industry, business description, and latest annual report"),
      makeQuery(code, "dividend history for the latest five available years and financial statement figures"),
    ];

    const responses = await Promise.all(
      queries.map((query) =>
        client.search(query, {
          searchDepth: "advanced",
          topic: "finance",
          maxResults: 6,
          includeAnswer: "advanced",
          includeRawContent: "markdown",
          country: "indonesia",
          language: "en",
        }),
      ),
    );

    const byUrl = new Map<string, SearchResult>();
    for (const response of responses) {
      for (const result of response.results ?? []) {
        if (!result.url) continue;
        const content = (result.rawContent || result.content || "").trim();
        if (!content) continue;
        byUrl.set(result.url, {
          title: result.title?.trim() || result.url,
          url: result.url,
          date: result.publishedDate || undefined,
          // Keep the agent context bounded while retaining the source's useful evidence.
          content: content.slice(0, 7000),
        });
      }
    }

    return JSON.stringify(
      {
        stockCode: code,
        answers: responses.map((response) => response.answer).filter(Boolean),
        sources: [...byUrl.values()].slice(0, 16),
        guidance:
          "Use only figures supported by the evidence. If a required figure is unavailable, say Not found in the available sources instead of guessing. Cite the source URL and reporting date in the published report.",
      },
      null,
      2,
    );
  },
});
