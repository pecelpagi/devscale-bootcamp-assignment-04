import type { AgentOutcome } from "@anvia/core";
import { contains, faithfulness, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agents.js";
import { lens } from "../observer.js";
import { getModel } from "../models.js";
import { faithfulnessCases } from "./faithfulness-cases.js";

const agent = createAgent();

// Scenario 4 — Source citation:
//  - `faithfulness` checks that every figure in the reply is supported by the
//    stockSearch evidence retrieved during the run (no invented numbers);
//  - `contains` checks that at least one external source URL is visible in the reply.
const evalResult = await runEvalCli({
  name: "source-citation",
  cases: faithfulnessCases,
  target: (input: string) => agent.generate({ prompt: input }),
  metrics: [
    faithfulness<string, AgentOutcome>({
      model: getModel(),
      // The reply also mentions the report URL and UI details, which the
      // search evidence cannot support, so a perfect score is not expected.
      threshold: 0.7,
      retrievalContext: ({ output }) => stockSearchEvidence(output),
    }),
    contains<string, AgentOutcome>({
      name: "cites_source_url",
      expected: /https?:\/\/(?!localhost)[^\s)>\]"']+/,
    }),
  ],
  format: "pretty",
  reporters: [
    lens.evalReporter({
      includePayloads: true,
    }),
  ],
});

console.log(evalResult.results);
await lens.flush();

function stockSearchEvidence(outcome: AgentOutcome): string[] {
  const evidence: string[] = [];
  for (const message of outcome.messages) {
    if (message.role !== "tool") continue;
    for (const part of message.content) {
      if (part.type !== "tool-result" || part.toolName !== "stockSearch") continue;
      if (part.output.type === "text") {
        evidence.push(part.output.value);
      } else if (part.output.type === "json") {
        evidence.push(JSON.stringify(part.output.value));
      }
    }
  }
  return evidence.length > 0
    ? evidence
    : ["No stockSearch results were retrieved during this run."];
}
