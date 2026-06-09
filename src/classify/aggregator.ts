import {
  BatchPass1Result,
  CatalogBucket,
  Digest,
  IssueCard,
  NormalizedIssue,
  Pass2Result,
  PreclassifiedIssue,
  ShortlistItem,
  Taxonomy,
  WorkType,
  Difficulty,
} from "../types/issue.js";
import { mergeTaxonomy } from "./labelMapper.js";
import {
  DIFFICULTY_ORDER,
  WORK_TYPE_ORDER,
} from "./taxonomy.js";

function countBy<T extends string>(
  items: { taxonomy: Taxonomy }[],
  pick: (t: Taxonomy) => T,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = pick(item.taxonomy);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function computeStats(cards: IssueCard[]): Record<string, number> {
  const stats: Record<string, number> = {
    total: cards.length,
  };

  const workTypes = countBy(cards, (t) => t.workType);
  const difficulties = countBy(cards, (t) => t.difficulty);
  const readiness = countBy(cards, (t) => t.readiness);

  for (const [key, value] of Object.entries(workTypes)) {
    stats[`workType_${key}`] = value;
  }
  for (const [key, value] of Object.entries(difficulties)) {
    stats[`difficulty_${key}`] = value;
  }
  for (const [key, value] of Object.entries(readiness)) {
    stats[`readiness_${key}`] = value;
  }

  return stats;
}

export function buildIssueCards(
  issues: PreclassifiedIssue[],
  batchResults: BatchPass1Result[],
): IssueCard[] {
  const summaryMap = new Map(
    batchResults.flatMap((b) => b.summaries).map((s) => [s.number, s]),
  );

  return issues.map((issue) => {
    const summary = summaryMap.get(issue.number);
    const taxonomy = mergeTaxonomy(
      issue.taxonomy,
      summary?.taxonomyOverrides,
    );

    return {
      number: issue.number,
      url: issue.url,
      title: issue.title,
      plainSummary: summary?.plainSummary ?? issue.title,
      taxonomy,
      githubLabels: issue.labels,
      labelMappingNotes: issue.labelMappingNotes,
      confidence: summary?.confidence ?? "low",
      skillsNeeded: summary?.skillsNeeded,
    };
  });
}

function bucketKey(workType: WorkType, difficulty: Difficulty): string {
  return `${workType}::${difficulty}`;
}

export function buildCatalog(cards: IssueCard[]): CatalogBucket[] {
  const map = new Map<string, CatalogBucket>();

  for (const card of cards) {
    const key = bucketKey(card.taxonomy.workType, card.taxonomy.difficulty);
    const existing = map.get(key);
    if (existing) {
      existing.issues.push(card);
    } else {
      map.set(key, {
        workType: card.taxonomy.workType,
        difficulty: card.taxonomy.difficulty,
        issues: [card],
      });
    }
  }

  return [...map.values()].sort((a, b) => {
    const wt = WORK_TYPE_ORDER[a.workType] - WORK_TYPE_ORDER[b.workType];
    if (wt !== 0) return wt;
    return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
  });
}

export function buildShortlist(
  pass2: Pass2Result,
  cards: IssueCard[],
): ShortlistItem[] {
  const cardMap = new Map(cards.map((c) => [c.number, c]));

  return pass2.shortlist
    .map((item) => {
      const card = cardMap.get(item.number);
      if (!card) return null;
      return {
        number: card.number,
        title: card.title,
        url: card.url,
        plainSummary: card.plainSummary,
        pickReason: item.pickReason,
        taxonomy: card.taxonomy,
      };
    })
    .filter((item): item is ShortlistItem => item !== null);
}

export function buildDigest(
  repo: string,
  issues: NormalizedIssue[],
  batchResults: BatchPass1Result[],
  pass2: Pass2Result,
): Digest {
  const preclassified = issues as PreclassifiedIssue[];
  const cards = buildIssueCards(preclassified, batchResults);
  const stats = computeStats(cards);

  const dates = issues.map((i) => new Date(i.createdAt).getTime());
  const from = dates.length
    ? new Date(Math.min(...dates)).toISOString().slice(0, 10)
    : "n/a";
  const to = dates.length
    ? new Date(Math.max(...dates)).toISOString().slice(0, 10)
    : "n/a";

  return {
    meta: {
      repo,
      analyzedCount: issues.length,
      generatedAt: new Date().toISOString(),
      dateRange: { from, to },
    },
    snapshot: {
      narrative: pass2.narrative,
      stats,
    },
    themes: pass2.themes,
    shortlist: buildShortlist(pass2, cards),
    catalog: {
      buckets: buildCatalog(cards),
    },
  };
}

export function fallbackPass2(
  issues: PreclassifiedIssue[],
  batchResults: BatchPass1Result[],
): Pass2Result {
  const hints = batchResults.flatMap((b) => b.clusterHints);
  const easyReady = issues.filter(
    (i) =>
      i.taxonomy.difficulty === "easy" && i.taxonomy.readiness === "ready",
  );

  return {
    narrative: `Analyzed ${issues.length} issues. Review themes and catalog for details.`,
    themes: hints.slice(0, 5).map((hint, index) => ({
      name: `Theme ${index + 1}`,
      description: hint,
      issueNumbers: [],
    })),
    shortlist: easyReady.slice(0, 5).map((issue) => ({
      number: issue.number,
      pickReason: "Marked easy and ready based on labels and content heuristics",
    })),
  };
}
