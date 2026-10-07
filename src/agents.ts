import { Agent } from "@anvia/core";
import { BASE_INSTRUCTIONS } from "./instructions.js";
import { getModel } from "./models.js";
import { lens } from "./observer.js";
import { stockSearch } from "./tools/stock-search.js";
import { tools as sandboxTools } from "./sandbox.js";

export function createAgent() {
  return new Agent({
    id: "assistant",
    model: getModel(),
    instructions: BASE_INSTRUCTIONS,
    observability: {
      observers: {
        tracing: lens.observer({
          captureMode: "full"
        })
      },
    },
    maxTurns: 70,
    tools: [stockSearch, ...sandboxTools],
  });
}
