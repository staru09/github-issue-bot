import { describe, expect, it } from "vitest";
import {
  defaultOutputDir,
  outputFilePaths,
  resolveOutputDir,
} from "../src/output/paths.js";
import { mapLabelsToTaxonomy, mergeTaxonomy } from "../src/classify/labelMapper.js";
import { normalizeIssue } from "../src/classify/normalizer.js";
import { chunkItems } from "../src/llm/provider.js";
import { formatMarkdown } from "../src/output/formatMarkdown.js";
import { Digest } from "../src/types/issue.js";

describe("output paths", () => {
  it("defaults to digests/owner-repo/", () => {
    expect(defaultOutputDir("vercel/next.js")).toMatch(/digests[\\/]vercel-next\.js$/);
    expect(resolveOutputDir("o/r", undefined)).toMatch(/digests[\\/]o-r$/);
    expect(resolveOutputDir("o/r", "./custom")).toBe("./custom");
  });

  it("names both export files", () => {
    const paths = outputFilePaths("digests/o-r");
    expect(paths.markdown).toMatch(/digest\.md$/);
    expect(paths.json).toMatch(/digest\.json$/);
  });
});

describe("labelMapper", () => {
  it("maps common labels to taxonomy", () => {
    const { taxonomy, notes } = mapLabelsToTaxonomy([
      "bug",
      "good first issue",
      "area: auth",
      "priority: critical",
    ]);

    expect(taxonomy.workType).toBe("bug");
    expect(taxonomy.difficulty).toBe("easy");
    expect(taxonomy.area).toBe("auth");
    expect(taxonomy.priority).toBe("high");
    expect(notes.length).toBeGreaterThan(0);
  });

  it("merges overrides without clobbering known values", () => {
    const base = mapLabelsToTaxonomy(["bug"]).taxonomy;
    const merged = mergeTaxonomy(base, { difficulty: "easy", area: "ui" });
    expect(merged.workType).toBe("bug");
    expect(merged.difficulty).toBe("easy");
    expect(merged.area).toBe("ui");
  });
});

describe("normalizer", () => {
  it("strips html and maps labels", () => {
    const issue = normalizeIssue(
      {
        number: 1,
        title: "Login fails",
        body: "<p>Users cannot log in</p>",
        state: "open",
        labels: [{ name: "bug" }],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
        comments: 0,
        html_url: "https://github.com/o/r/issues/1",
      },
      "o",
      "r",
    );

    expect(issue.body).toBe("Users cannot log in");
    expect(issue.taxonomy.workType).toBe("bug");
  });
});

describe("chunkItems", () => {
  it("splits arrays into batches", () => {
    expect(chunkItems([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe("formatMarkdown", () => {
  it("renders digest sections", () => {
    const digest: Digest = {
      meta: {
        repo: "o/r",
        analyzedCount: 1,
        generatedAt: "2026-06-09T00:00:00.000Z",
        dateRange: { from: "2024-01-01", to: "2026-06-01" },
      },
      snapshot: {
        narrative: "One open bug.",
        stats: { total: 1, workType_bug: 1, difficulty_easy: 1, readiness_ready: 1 },
      },
      themes: [{ name: "Auth", description: "Login issues", issueNumbers: [1] }],
      shortlist: [
        {
          number: 1,
          title: "Login fails",
          url: "https://github.com/o/r/issues/1",
          plainSummary: "Users cannot log in.",
          pickReason: "Clear scope",
          taxonomy: {
            workType: "bug",
            difficulty: "easy",
            readiness: "ready",
            area: "auth",
            priority: "unknown",
          },
        },
      ],
      catalog: {
        buckets: [
          {
            workType: "bug",
            difficulty: "easy",
            issues: [
              {
                number: 1,
                url: "https://github.com/o/r/issues/1",
                title: "Login fails",
                plainSummary: "Users cannot log in.",
                taxonomy: {
                  workType: "bug",
                  difficulty: "easy",
                  readiness: "ready",
                  area: "auth",
                  priority: "unknown",
                },
                githubLabels: ["bug"],
                labelMappingNotes: ["label → workType:bug"],
                confidence: "high",
              },
            ],
          },
        ],
      },
    };

    const md = formatMarkdown(digest);
    expect(md).toContain("# Issue digest — o/r");
    expect(md).toContain("## Snapshot");
    expect(md).toContain("## Themes");
    expect(md).toContain("## Start here");
    expect(md).toContain("## Catalog");
    expect(md).toContain("#1");
  });
});
