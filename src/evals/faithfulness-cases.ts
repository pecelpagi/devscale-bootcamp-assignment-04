// Scenario 4 — Source citation.
// The retrieval context is not static: faithfulness.ts pulls the stockSearch
// tool result out of the agent run, so the reply's figures are checked against
// the evidence the agent actually retrieved.
export const faithfulnessCases = [
  {
    id: "source-citation-bbca-figures",
    input:
      "Research BBCA. In your reply, summarize the latest cash, total debt, revenue, and profit figures you found, and give the source URL for each figure.",
  },
];
