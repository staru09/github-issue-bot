import {
  NormalizedIssue,
  PreclassifiedIssue,
  RawGitHubIssue,
  Taxonomy,
} from "../types/issue.js";
import { STALE_DAYS } from "./taxonomy.js";
import { mapLabelsToTaxonomy } from "./labelMapper.js";

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function trimBody(body: string, maxLen = 2000): string {
  if (body.length <= maxLen) return body;
  return `${body.slice(0, maxLen)}…`;
}

function inferReadinessFromContent(
  body: string,
  updatedAt: string,
  labels: string[],
): Taxonomy["readiness"] {
  const lowerLabels = labels.map((l) => l.toLowerCase());
  const blocked = ["blocked", "waiting-for-response", "waiting for response"];
  if (lowerLabels.some((l) => blocked.some((b) => l.includes(b)))) {
    return "blocked";
  }

  const updated = new Date(updatedAt);
  const staleThreshold = new Date();
  staleThreshold.setDate(staleThreshold.getDate() - STALE_DAYS);
  if (updated < staleThreshold) {
    return "stale";
  }

  if (body.trim().length < 30) {
    return "needs-clarification";
  }

  return "ready";
}

export function normalizeIssue(
  raw: RawGitHubIssue,
  owner: string,
  repo: string,
): NormalizedIssue {
  const labels = raw.labels.map((l) => l.name);
  const body = trimBody(stripHtml(raw.body ?? ""));
  const { taxonomy, notes } = mapLabelsToTaxonomy(labels);

  taxonomy.readiness = inferReadinessFromContent(
    body,
    raw.updated_at,
    labels,
  );

  return {
    number: raw.number,
    title: raw.title.trim(),
    body,
    state: raw.state,
    labels,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    comments: raw.comments,
    url: raw.html_url ?? `https://github.com/${owner}/${repo}/issues/${raw.number}`,
    taxonomy,
    labelMappingNotes: notes,
  };
}

export function preclassifyIssue(issue: NormalizedIssue): PreclassifiedIssue {
  const unknownAxes = (Object.keys(issue.taxonomy) as (keyof Taxonomy)[]).filter(
    (key) => {
      const value = issue.taxonomy[key];
      return value === "unknown" || (key === "area" && value === "general");
    },
  );

  return { ...issue, unknownAxes };
}

export function normalizeIssues(
  rawIssues: RawGitHubIssue[],
  owner: string,
  repo: string,
): NormalizedIssue[] {
  return rawIssues.map((raw) => normalizeIssue(raw, owner, repo));
}
