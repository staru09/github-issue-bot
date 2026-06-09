export type WorkType =
  | "bug"
  | "feature"
  | "docs"
  | "refactor"
  | "test"
  | "chore"
  | "question"
  | "unknown";

export type Difficulty = "easy" | "medium" | "hard" | "unknown";

export type Readiness =
  | "ready"
  | "needs-clarification"
  | "blocked"
  | "stale";

export type Priority = "high" | "medium" | "low" | "unknown";

export type Confidence = "high" | "low";

export interface Taxonomy {
  workType: WorkType;
  difficulty: Difficulty;
  readiness: Readiness;
  area: string;
  priority: Priority;
}

export interface GitHubLabel {
  name: string;
}

export interface RawGitHubIssue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  labels: GitHubLabel[];
  created_at: string;
  updated_at: string;
  comments: number;
  pull_request?: unknown;
  html_url?: string;
}

export interface NormalizedIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  comments: number;
  url: string;
  taxonomy: Taxonomy;
  labelMappingNotes: string[];
}

export interface IssueCard {
  number: number;
  url: string;
  title: string;
  plainSummary: string;
  taxonomy: Taxonomy;
  githubLabels: string[];
  labelMappingNotes: string[];
  confidence: Confidence;
  skillsNeeded?: string[];
}

export interface Theme {
  name: string;
  description: string;
  issueNumbers: number[];
}

export interface ShortlistItem {
  number: number;
  title: string;
  url: string;
  plainSummary: string;
  pickReason: string;
  taxonomy: Taxonomy;
}

export interface CatalogBucket {
  workType: WorkType;
  difficulty: Difficulty;
  issues: IssueCard[];
}

export interface Digest {
  meta: {
    repo: string;
    analyzedCount: number;
    generatedAt: string;
    dateRange: { from: string; to: string };
  };
  snapshot: {
    narrative: string;
    stats: Record<string, number>;
  };
  themes: Theme[];
  shortlist: ShortlistItem[];
  catalog: {
    buckets: CatalogBucket[];
  };
}

export interface FetchIssuesOptions {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  limit?: number;
  label?: string;
  since?: string;
  token?: string;
}

export interface AnalyzeOptions extends FetchIssuesOptions {
  format?: "markdown" | "json";
  /** Override default output directory (digests/owner-repo/) */
  outDir?: string;
  model?: string;
  apiKey?: string;
}

export interface BatchSummaryResult {
  number: number;
  plainSummary: string;
  taxonomyOverrides?: Partial<Taxonomy>;
  confidence: Confidence;
  skillsNeeded?: string[];
}

export interface BatchPass1Result {
  summaries: BatchSummaryResult[];
  clusterHints: string[];
}

export interface Pass2Result {
  narrative: string;
  themes: Theme[];
  shortlist: { number: number; pickReason: string }[];
}

export interface PreclassifiedIssue extends NormalizedIssue {
  unknownAxes: (keyof Taxonomy)[];
}
