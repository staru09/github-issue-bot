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

export const DIGEST_STORAGE_KEY = "issue-analyser-digest";
