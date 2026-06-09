export const PASS1_SYSTEM_PROMPT = `You analyze GitHub issues for open-source contributors.
Return valid JSON only. No markdown fences.

Rules:
- Never invent details not present in the issue title or body.
- Use plain English for plainSummary (1-2 sentences max).
- For taxonomyOverrides, use ONLY these enum values:
  workType: bug|feature|docs|refactor|test|chore|question|unknown
  difficulty: easy|medium|hard|unknown
  readiness: ready|needs-clarification|blocked|stale
  priority: high|medium|low|unknown
  area: short lowercase slug (e.g. auth, api, ui, build, deps, general)
- Only include taxonomyOverrides keys that are still unknown in the input.
- Set confidence to "low" when body is empty or too vague to summarize reliably.
- clusterHints: short theme descriptions with issue numbers, e.g. "OAuth bugs: #42, #57"`;

export const PASS2_SYSTEM_PROMPT = `You produce a final digest narrative for GitHub issue analysis.
Return valid JSON only. No markdown fences.

Rules:
- narrative: 2-4 sentences summarizing project issue health for maintainers and contributors.
- themes: 3-8 semantic clusters with name, description, issueNumbers array.
- shortlist: max 5 issues ranked for NEW contributors. Each needs number and pickReason.
- Prefer easy + ready + unambiguous issues for shortlist.
- Never invent issue details not provided in the input.`;

export function buildPass1UserPrompt(
  issues: {
    number: number;
    title: string;
    body: string;
    labels: string[];
    taxonomy: Record<string, string>;
    unknownAxes: string[];
  }[],
): string {
  return JSON.stringify(
    {
      task: "Summarize each issue and suggest cluster hints.",
      expectedShape: {
        summaries: [
          {
            number: 0,
            plainSummary: "string",
            taxonomyOverrides: { area: "auth" },
            confidence: "high|low",
            skillsNeeded: ["typescript"],
          },
        ],
        clusterHints: ["theme: #1, #2"],
      },
      issues,
    },
    null,
    2,
  );
}

export function buildPass2UserPrompt(input: {
  repo: string;
  issueCount: number;
  clusterHints: string[];
  candidates: {
    number: number;
    title: string;
    plainSummary: string;
    taxonomy: Record<string, string>;
    labels: string[];
  }[];
  stats: Record<string, number>;
}): string {
  return JSON.stringify(
    {
      task: "Produce narrative, themes, and contributor shortlist.",
      expectedShape: {
        narrative: "string",
        themes: [{ name: "string", description: "string", issueNumbers: [1] }],
        shortlist: [{ number: 1, pickReason: "string" }],
      },
      input,
    },
    null,
    2,
  );
}
