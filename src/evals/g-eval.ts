import { gEval, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agents.js";
import { lens } from "../observer.js";
import { getModel } from "../models.js";
import { gEvalCases } from "./g-eval-cases.js";

const agent = createAgent();

// Scenarios 2 and 3 — behavioral checks (clarifying questions, graceful
// handling of missing evidence) that need an LLM judge rather than string matching.
const evalResult = await runEvalCli({
  name: "g-eval",
  cases: gEvalCases,
  target: (input: string) => agent.generate({ prompt: input }),
  metrics: [
    gEval({
      name: "expected-behavior",
      model: getModel(),
      threshold: 0.8,
      criteria:
        "Judge whether the assistant's actual output behaves as described in the expected output. Focus on the observable behavior (what the assistant asks, states, or refrains from doing), not on wording or formatting.",
      evaluationParams: ["input", "actualOutput", "expectedOutput"],
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
