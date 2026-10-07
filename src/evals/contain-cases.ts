// Scenario 1 — Clear answer.
// The company name is unambiguous, so the agent must resolve it to BBCA and
// reply with the clickable report URL (published port + /BBCA.html).
export const clearAnswerCases = [
  {
    id: "clear-answer-bbca-report-url",
    input: "Buatkan laporan saham untuk PT Bank Central Asia Tbk.",
    expected: /http:\/\/localhost:\d+\/BBCA\.html/,
  },
];

// Scenario 5 — Report file creation.
// The ticker is given in lowercase; the report file in the sandbox must still
// be named with the normalized uppercase ticker.
export const reportFileCases = [
  {
    id: "report-file-adro-html",
    input: "Tolong riset saham adro dan buatkan laporannya.",
    expected: "ADRO.html",
  },
];
