import { Taxonomy } from "../types/issue.js";

type PartialTaxonomyResult = {
  taxonomy: Taxonomy;
  notes: string[];
};

function normalizeLabel(label: string): string {
  return label.toLowerCase().trim();
}

function matchesAny(label: string, patterns: string[]): boolean {
  return patterns.some((p) => label.includes(p) || label === p);
}

const WORK_TYPE_PATTERNS: Record<Exclude<Taxonomy["workType"], "unknown">, string[]> = {
  bug: ["bug", "type: bug", "type:bug", "defect", "🐛"],
  feature: ["feature", "enhancement", "type: feature", "type:feature", "✨"],
  docs: ["documentation", "docs", "type: docs", "type:documentation"],
  refactor: ["refactor", "tech debt", "tech-debt", "cleanup"],
  test: ["test", "testing", "ci", "flaky"],
  chore: ["chore", "maintenance", "dependencies", "deps"],
  question: ["question", "help wanted", "discussion"],
};

const DIFFICULTY_PATTERNS: Record<Exclude<Taxonomy["difficulty"], "unknown">, string[]> = {
  easy: ["good first issue", "good-first-issue", "starter", "beginner", "easy"],
  medium: ["medium", "intermediate"],
  hard: ["hard", "complex", "advanced"],
};

const PRIORITY_PATTERNS: Record<Exclude<Taxonomy["priority"], "unknown">, string[]> = {
  high: ["priority: critical", "priority:critical", "p0", "p1", "urgent", "critical", "high priority"],
  medium: ["priority: medium", "priority:medium", "p2", "medium priority"],
  low: ["priority: low", "priority:low", "p3", "low priority"],
};

const AREA_PREFIXES = ["area:", "component:", "module:", "pkg:"];

function extractArea(label: string): string | undefined {
  for (const prefix of AREA_PREFIXES) {
    if (label.startsWith(prefix)) {
      return label.slice(prefix.length).trim().replace(/\s+/g, "-") || undefined;
    }
  }
  return undefined;
}

export function mapLabelsToTaxonomy(labels: string[]): PartialTaxonomyResult {
  const normalized = labels.map(normalizeLabel);
  const notes: string[] = [];

  const taxonomy: Taxonomy = {
    workType: "unknown",
    difficulty: "unknown",
    readiness: "ready",
    area: "general",
    priority: "unknown",
  };

  for (const [workType, patterns] of Object.entries(WORK_TYPE_PATTERNS)) {
    if (normalized.some((l) => matchesAny(l, patterns))) {
      taxonomy.workType = workType as Taxonomy["workType"];
      notes.push(`label → workType:${workType}`);
      break;
    }
  }

  for (const [difficulty, patterns] of Object.entries(DIFFICULTY_PATTERNS)) {
    if (normalized.some((l) => matchesAny(l, patterns))) {
      taxonomy.difficulty = difficulty as Taxonomy["difficulty"];
      notes.push(`label → difficulty:${difficulty}`);
      break;
    }
  }

  for (const [priority, patterns] of Object.entries(PRIORITY_PATTERNS)) {
    if (normalized.some((l) => matchesAny(l, patterns))) {
      taxonomy.priority = priority as Taxonomy["priority"];
      notes.push(`label → priority:${priority}`);
      break;
    }
  }

  for (const label of normalized) {
    const area = extractArea(label);
    if (area) {
      taxonomy.area = area;
      notes.push(`label → area:${area}`);
      break;
    }
  }

  return { taxonomy, notes };
}

export function mergeTaxonomy(
  base: Taxonomy,
  overrides?: Partial<Taxonomy>,
): Taxonomy {
  if (!overrides) return base;

  return {
    workType: overrides.workType && overrides.workType !== "unknown"
      ? overrides.workType
      : base.workType,
    difficulty: overrides.difficulty && overrides.difficulty !== "unknown"
      ? overrides.difficulty
      : base.difficulty,
    readiness: overrides.readiness ?? base.readiness,
    area: overrides.area && overrides.area !== "general"
      ? overrides.area
      : base.area,
    priority: overrides.priority && overrides.priority !== "unknown"
      ? overrides.priority
      : base.priority,
  };
}

export function formatTaxonomyMapping(notes: string[]): string {
  if (notes.length === 0) return "no label mapping";
  return notes.join(", ");
}
