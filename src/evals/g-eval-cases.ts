// Each `expected` describes the behavior the judge should look for in the reply.

export const gEvalCases = [
  // Scenario 2 — Ambiguous request: "Astra" matches several IDX companies
  // (ASII Astra International, AUTO Astra Otoparts, AALI Astra Agro Lestari,
  // ASGR Astra Graphia).
  {
    id: "ambiguous-company-name",
    input: "Tolong buatkan laporan saham Astra.",
    expected:
      "Asks the user to clarify which Astra company they mean, ideally listing candidates such as ASII, AUTO, AALI, or ASGR. Does not pick one on its own, does not run research, and does not provide a report URL.",
  },
  // Scenario 2 — Ambiguous request: two tickers in one request.
  {
    id: "ambiguous-multiple-tickers",
    input: "Compare BBRI and BMRI for me, which one should I buy?",
    expected:
      "Explains that only one Indonesian-listed company can be researched per request and asks the user to choose either BBRI or BMRI. Does not research or report on both. Does not recommend buying, selling, or holding either stock.",
  },
  // Scenario 3 — No useful result: the ticker does not exist on the IDX, so
  // stockSearch cannot return supporting evidence.
  {
    id: "no-useful-result-unknown-ticker",
    input: "Research IDX stock QXZT and build the report.",
    expected:
      "States clearly that no reliable information about an Indonesian-listed company with the code QXZT could be found, and asks the user to verify the ticker or provide the company name. Does not invent cash, debt, revenue, profit, or dividend figures. Any missing figure is described as not found in the available sources rather than guessed.",
  },
];
