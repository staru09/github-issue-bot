import { mkdir } from "node:fs/promises";
import { join } from "node:path";

export function defaultOutputDir(repoSlug: string): string {
  const safeName = repoSlug.replace("/", "-");
  return join("digests", safeName);
}

export function resolveOutputDir(repoSlug: string, outDir?: string): string {
  return outDir ?? defaultOutputDir(repoSlug);
}

export async function ensureOutputDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export function outputFilePaths(dir: string): { markdown: string; json: string } {
  return {
    markdown: join(dir, "digest.md"),
    json: join(dir, "digest.json"),
  };
}
