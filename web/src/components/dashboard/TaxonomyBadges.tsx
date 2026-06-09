import type { WorkType, Difficulty, Readiness } from "@/lib/types/digest";
import { Badge } from "@/components/retroui/Badge";

const workTypeVariant: Record<
  WorkType,
  "default" | "open" | "closed" | "accent" | "warning" | "purple"
> = {
  bug: "closed",
  feature: "open",
  docs: "accent",
  refactor: "purple",
  test: "default",
  chore: "default",
  question: "warning",
  unknown: "default",
};

export function WorkTypeBadge({ type }: { type: WorkType }) {
  return <Badge variant={workTypeVariant[type]}>{type}</Badge>;
}

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const variant =
    level === "easy" ? "open" : level === "hard" ? "closed" : "warning";
  return <Badge variant={variant}>{level}</Badge>;
}

export function ReadinessBadge({ status }: { status: Readiness }) {
  const variant =
    status === "ready"
      ? "open"
      : status === "blocked"
        ? "closed"
        : status === "stale"
          ? "default"
          : "warning";
  return <Badge variant={variant}>{status}</Badge>;
}
