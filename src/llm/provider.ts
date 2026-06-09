import OpenAI from "openai";
import { z } from "zod";
import {
  BatchPass1Result,
  Pass2Result,
  PreclassifiedIssue,
  Taxonomy,
} from "../types/issue.js";
import {
  buildPass1UserPrompt,
  buildPass2UserPrompt,
  PASS1_SYSTEM_PROMPT,
  PASS2_SYSTEM_PROMPT,
} from "./prompts.js";
import {
  DIFFICULTIES,
  PRIORITIES,
  READINESS_VALUES,
  WORK_TYPES,
} from "../classify/taxonomy.js";
import type { Difficulty, Priority, Readiness, WorkType } from "../types/issue.js";

const taxonomyOverrideSchema = z.object({
  workType: z.enum(WORK_TYPES as [WorkType, ...WorkType[]]).optional(),
  difficulty: z.enum(DIFFICULTIES as [Difficulty, ...Difficulty[]]).optional(),
  readiness: z.enum(READINESS_VALUES as [Readiness, ...Readiness[]]).optional(),
  area: z.string().optional(),
  priority: z.enum(PRIORITIES as [Priority, ...Priority[]]).optional(),
});

const pass1Schema = z.object({
  summaries: z.array(
    z.object({
      number: z.number(),
      plainSummary: z.string(),
      taxonomyOverrides: taxonomyOverrideSchema.optional(),
      confidence: z.enum(["high", "low"]),
      skillsNeeded: z.array(z.string()).optional(),
    }),
  ),
  clusterHints: z.array(z.string()),
});

const pass2Schema = z.object({
  narrative: z.string(),
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
      pickReason: z.string(),
    }),
  ),
});

export interface LlmProvider {
  analyzeBatch(issues: PreclassifiedIssue[]): Promise<BatchPass1Result>;
  synthesizeDigest(input: {
    repo: string;
    issues: PreclassifiedIssue[];
    batchResults: BatchPass1Result[];
    stats: Record<string, number>;
  }): Promise<Pass2Result>;
}

export class OpenAiProvider implements LlmProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  private async chatJson<T>(
    system: string,
    user: string,
    schema: z.ZodType<T>,
  ): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("LLM returned empty response");
    }

    const parsed = JSON.parse(content) as unknown;
    return schema.parse(parsed);
  }

  async analyzeBatch(issues: PreclassifiedIssue[]): Promise<BatchPass1Result> {
    const payload = issues.map((issue) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      taxonomy: issue.taxonomy as unknown as Record<string, string>,
      unknownAxes: issue.unknownAxes as string[],
    }));

    return this.chatJson(
      PASS1_SYSTEM_PROMPT,
      buildPass1UserPrompt(payload),
      pass1Schema,
    );
  }

  async synthesizeDigest(input: {
    repo: string;
    issues: PreclassifiedIssue[];
    batchResults: BatchPass1Result[];
    stats: Record<string, number>;
  }): Promise<Pass2Result> {
    const summaryByNumber = new Map(
      input.batchResults
        .flatMap((b) => b.summaries)
        .map((s) => [s.number, s]),
    );

    const clusterHints = input.batchResults.flatMap((b) => b.clusterHints);

    const candidates = input.issues
      .map((issue) => {
        const summary = summaryByNumber.get(issue.number);
        return {
          number: issue.number,
          title: issue.title,
          plainSummary: summary?.plainSummary ?? issue.title,
          taxonomy: issue.taxonomy as unknown as Record<string, string>,
          labels: issue.labels,
        };
      })
      .slice(0, 30);

    return this.chatJson(
      PASS2_SYSTEM_PROMPT,
      buildPass2UserPrompt({
        repo: input.repo,
        issueCount: input.issues.length,
        clusterHints,
        candidates,
        stats: input.stats,
      }),
      pass2Schema,
    );
  }
}

export function chunkItems<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function processBatches(
  issues: PreclassifiedIssue[],
  provider: LlmProvider,
  batchSize = 10,
): Promise<BatchPass1Result[]> {
  const chunks = chunkItems(issues, batchSize);
  const results: BatchPass1Result[] = [];

  for (const chunk of chunks) {
    results.push(await provider.analyzeBatch(chunk));
  }

  return results;
}
