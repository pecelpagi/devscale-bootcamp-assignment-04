import { contains, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agents.js";
import { lens } from "../observer.js";
import { sandbox } from "../sandbox.js";
import { clearAnswerCases, reportFileCases } from "./contain-cases.js";

type ReportFileOutput = { output: string; htmlFiles: string[] };

const agent = createAgent();
const reporters = [lens.evalReporter({ includePayloads: true })];

// Scenario 1 — Clear answer: the reply itself must contain the report URL.
const clearAnswerResult = await runEvalCli({
  name: "clear-answer",
  cases: clearAnswerCases,
  target: (input: string) => agent.generate({ prompt: input }),
  metrics: [contains()],
  format: "pretty",
  reporters,
});

console.log(clearAnswerResult.results);

// Scenario 5 — Report file creation: check the sandbox filesystem, not the reply.
const reportFileResult = await runEvalCli({
  name: "report-file-created",
  cases: reportFileCases,
  target: async (input: string): Promise<ReportFileOutput> => {
    const response = await agent.generate({ prompt: input });
    return { output: response.text, htmlFiles: await listHtmlFiles() };
  },
  metrics: [
    contains<string, ReportFileOutput>({
      name: "report_file_exists",
      actual: ({ output }) => output.htmlFiles.join("\n"),
    }),
  ],
  format: "pretty",
  reporters,
});

console.log(reportFileResult.results);
await lens.flush();

async function listHtmlFiles(): Promise<string[]> {
  const result = await sandbox.runtime.exec({
    command: "find",
    args: [sandbox.runtime.workdir, "-type", "f", "-name", "*.html"],
  });
  return new TextDecoder()
    .decode(result.stdout)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
