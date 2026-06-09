import type { Difficulty, Priority, Readiness, WorkType } from "../types/issue.js";

export const WORK_TYPES: WorkType[] = [
  "bug",
  "feature",
  "docs",
  "refactor",
  "test",
  "chore",
  "question",
  "unknown",
];

export const DIFFICULTIES: Difficulty[] = [
  "easy",
  "medium",
  "hard",
  "unknown",
];

export const READINESS_VALUES: Readiness[] = [
  "ready",
  "needs-clarification",
  "blocked",
  "stale",
];

export const PRIORITIES: Priority[] = [
  "high",
  "medium",
  "low",
  "unknown",
];

export const STALE_DAYS = 90;

export const WORK_TYPE_ORDER: Record<WorkType, number> = {
  bug: 0,
  feature: 1,
  docs: 2,
  refactor: 3,
  test: 4,
  chore: 5,
  question: 6,
  unknown: 7,
};

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
  unknown: 3,
};
