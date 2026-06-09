import type { Digest } from "@/lib/types/digest";

export interface StatGroup {
  label: string;
  value: number;
  color: string;
}

export function extractStats(
  stats: Record<string, number>,
  prefix: string,
): StatGroup[] {
  const colors: Record<string, string> = {
    bug: "#cf222e",
    feature: "#1a7f37",
    docs: "#0969da",
    refactor: "#8250df",
    test: "#656d76",
    chore: "#656d76",
    question: "#bf8700",
    unknown: "#656d76",
    easy: "#1a7f37",
    medium: "#9a6700",
    hard: "#cf222e",
    ready: "#1a7f37",
    stale: "#656d76",
    blocked: "#cf222e",
    "needs-clarification": "#9a6700",
  };

  return Object.entries(stats)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, value]) => {
      const label = key.replace(prefix, "");
      return {
        label,
        value,
        color: colors[label] ?? "#656d76",
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function flattenIssues(digest: Digest) {
  return digest.catalog.buckets.flatMap((b) => b.issues);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
