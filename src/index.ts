#!/usr/bin/env node

import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { Command } from "commander";
import { runAnalyze } from "./commands/analyze.js";

if (existsSync(".env")) {
  loadEnvFile();
}

const program = new Command();

program
  .name("issue-analyser")
  .description("Fetch GitHub issues and produce an LLM-powered contributor digest")
  .version("0.1.0");

program
  .command("analyze")
  .description("Analyze issues for a GitHub repository")
  .argument("<repo>", "Repository in owner/repo format")
  .option("--state <state>", "Issue state: open, closed, or all", "open")
  .option("--limit <n>", "Max issues to fetch", "50")
  .option("--label <label>", "Filter by label")
  .option("--since <date>", "Only issues updated since date or duration (e.g. 90d)")
  .option("--token <token>", "GitHub token override (default: gh auth or GITHUB_TOKEN)")
  .option("--format <format>", "Stdout format: markdown or json", "markdown")
  .option("--out-dir <dir>", "Output directory for digest.md and digest.json (default: digests/owner-repo/)")
  .option("--model <model>", "OpenAI model", process.env.OPENAI_MODEL ?? "gpt-4o-mini")
  .option("--api-key <key>", "OpenAI API key override")
  .action(async (repo: string, opts) => {
    try {
      const format = opts.format === "json" ? "json" : "markdown";
      const state = opts.state as "open" | "closed" | "all";
      if (!["open", "closed", "all"].includes(state)) {
        throw new Error("--state must be open, closed, or all");
      }

      const output = await runAnalyze({
        repo,
        state,
        limit: Number(opts.limit),
        label: opts.label,
        since: opts.since,
        token: opts.token,
        format,
        outDir: opts.outDir,
        model: opts.model,
        apiKey: opts.apiKey,
      });

      process.stdout.write(output);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exitCode = 1;
    }
  });

program.parse();
