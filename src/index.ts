import { createServer } from "node:http";
import { createAgent } from "./agents.js";
import { Studio } from "@anvia/studio";
import { sandbox, tools } from "./sandbox.js";

const agent = createAgent();
const studioServer = new Studio([agent], {
  sandboxes: [
    {
      inspector: sandbox.inspector({
        files: true,
        ports: true,
        processes: true,
      }),
      agentIds: [agent.id],
      toolNames: tools.map((tool) => tool.name),
    },
  ],
});

export const studio = studioServer.serve({
  port: 3000,
  onShutdown: async () => {
    await sandbox.destroy();
  },
});
