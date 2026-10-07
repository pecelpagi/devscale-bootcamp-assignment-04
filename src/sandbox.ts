import { createDockerSandboxTools, DockerSandboxClient } from "@anvia/sandbox";

const client = new DockerSandboxClient();
const image = "node:22-alpine";
await client.pullImage({ image });

export const sandbox = await client.createSandbox({
  image,
  workspace: { type: "ephemeral" },
  network: { mode: "bridge", ports: [8000] },
  resources: { memoryMb: 512, cpus: 1, pidsLimit: 64 },
  runtime: { commandTimeoutMs: 20_000, maxOutputBytes: 64_000 },
});

export const tools = createDockerSandboxTools({
  sandbox: sandbox.runtime,
  tools: [
    "read_file",
    "write_file",
    "list_files",
    "exec_command",
    "list_ports",
    "start_process",
    "list_processes",
    "read_process_logs",
    "stop_process",
    "wait_for_port",
  ],
});
