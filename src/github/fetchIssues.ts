import { ghApi, checkGhAuth } from "./ghClient.js";
import { FetchIssuesOptions, RawGitHubIssue } from "../types/issue.js";

function parseSince(since?: string): Date | undefined {
  if (!since) return undefined;

  const daysMatch = since.match(/^(\d+)d$/i);
  if (daysMatch) {
    const days = Number(daysMatch[1]);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  const parsed = new Date(since);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid --since value: ${since}. Use ISO date or e.g. 90d`);
  }
  return parsed;
}

export async function fetchIssues(
  options: FetchIssuesOptions,
): Promise<RawGitHubIssue[]> {
  const {
    owner,
    repo,
    state = "open",
    limit = 50,
    label,
    since,
    token,
  } = options;

  await checkGhAuth(token);

  const params = new URLSearchParams({
    state,
    per_page: "100",
    sort: "updated",
    direction: "desc",
  });

  if (label) {
    params.set("labels", label);
  }

  const sinceDate = parseSince(since);
  const endpoint = `/repos/${owner}/${repo}/issues?${params.toString()}`;
  const items = await ghApi<RawGitHubIssue>(endpoint, { token });

  const issues = items
    .filter((item) => !item.pull_request)
    .filter((item) => {
      if (!sinceDate) return true;
      return new Date(item.updated_at) >= sinceDate;
    })
    .slice(0, limit)
    .map((item) => ({
      ...item,
      html_url: item.html_url ?? `https://github.com/${owner}/${repo}/issues/${item.number}`,
    }));

  return issues;
}

export function parseRepoArg(repoArg: string): { owner: string; repo: string } {
  const parts = repoArg.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `Invalid repo format "${repoArg}". Expected owner/repo (e.g. vercel/next.js).`,
    );
  }
  return { owner: parts[0], repo: parts[1] };
}
