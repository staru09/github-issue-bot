import { z } from "zod";
import type { Digest } from "@/lib/types/digest";

const taxonomySchema = z.object({
  workType: z.string(),
  difficulty: z.string(),
  readiness: z.string(),
  area: z.string(),
  priority: z.string(),
});

export const digestSchema = z.object({
  meta: z.object({
    repo: z.string(),
    analyzedCount: z.number(),
    generatedAt: z.string(),
    dateRange: z.object({ from: z.string(), to: z.string() }),
  }),
  snapshot: z.object({
    narrative: z.string(),
    stats: z.record(z.string(), z.number()),
  }),
  themes: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      issueNumbers: z.array(z.number()),
    }),
  ),
  shortlist: z.array(
    z.object({
      number: z.number(),
      title: z.string(),
      url: z.string(),
      plainSummary: z.string(),
      pickReason: z.string(),
      taxonomy: taxonomySchema,
    }),
  ),
  catalog: z.object({
    buckets: z.array(
      z.object({
        workType: z.string(),
        difficulty: z.string(),
        issues: z.array(
          z.object({
            number: z.number(),
            url: z.string(),
            title: z.string(),
            plainSummary: z.string(),
            taxonomy: taxonomySchema,
            githubLabels: z.array(z.string()),
            labelMappingNotes: z.array(z.string()),
            confidence: z.enum(["high", "low"]),
            skillsNeeded: z.array(z.string()).optional(),
          }),
        ),
      }),
    ),
  }),
});

export function parseDigest(data: unknown): Digest {
  return digestSchema.parse(data) as Digest;
}
