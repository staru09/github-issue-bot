import { writeFile } from "node:fs/promises";
import { fetchIssues, parseRepoArg } from "../github/fetchIssues.js";
import { normalizeIssues, preclassifyIssue } from "../classify/normalizer.js";
import { buildDigest } from "../classify/aggregator.js";
import { OpenAiProvider, processBatches } from "../llm/provider.js";
import { formatMarkdown } from "../output/formatMarkdown.js";
import { formatJson } from "../output/formatJson.js";
import { AnalyzeOptions } from "../types/issue.js";

export type AnalyzeCommandOptions = Omit<
  AnalyzeOptions,
  "owner" | "repo"
> & {
  repo: string;
};

export async function runAnalyze(options: AnalyzeCommandOptions): Promise<string> {
  const { owner, repo } = parseRepoArg(options.repo);
  const repoSlug = `${owner}/${repo}`;

  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is required. Set it in your environment or pass --api-key.",
    );
  }

  const token =
    options.token ??
    process.env.GITHUB_TOKEN ??
    process.env.GH_TOKEN;

  const model = options.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  console.error(`Fetching issues from ${repoSlug}...`);
  const rawIssues = await fetchIssues({
    owner,
    repo,
    state: options.state,
    limit: options.limit,
    label: options.label,
    since: options.since,
    token,
  });

  if (rawIssues.length === 0) {
    throw new Error(`No issues found for ${repoSlug} with the given filters.`);
  }

  console.error(`Fetched ${rawIssues.length} issues. Normalizing...`);
  const normalized = normalizeIssues(rawIssues, owner, repo);
  const preclassified = normalized.map(preclassifyIssue);

  console.error(`Analyzing with ${model}...`);
  const provider = new OpenAiProvider(apiKey, model);
  const batchResults = await processBatches(preclassified, provider, 10);

  const cardsPreview = preclassified.map((issue) => ({
    taxonomy: issue.taxonomy,
  }));
  const stats: Record<string, number> = { total: cardsPreview.length };

  console.error("Synthesizing digest...");
  const pass2 = await provider.synthesizeDigest({
    repo: repoSlug,
    issues: preclassified,
    batchResults,
    stats,
  });

  const digest = buildDigest(repoSlug, normalized, batchResults, pass2);
  const output =
    options.format === "json"
      ? formatJson(digest)
      : formatMarkdown(digest);

  if (options.out) {
    await writeFile(options.out, output, "utf8");
    console.error(`Wrote digest to ${options.out}`);
  }

  return output;
}
