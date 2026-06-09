import { Digest, IssueCard } from "../types/issue.js";
import { formatTaxonomyMapping } from "../classify/labelMapper.js";

function formatStatsLine(stats: Record<string, number>, prefix: string): string {
  const entries = Object.entries(stats)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, value]) => `${key.replace(prefix, "")} ${value}`)
    .join(" · ");
  return entries || "none";
}

function formatIssueCard(card: IssueCard): string {
  const skills = card.skillsNeeded?.length
    ? `\n- **Skills:** ${card.skillsNeeded.join(", ")}`
    : "";
  const labels = card.githubLabels.length
    ? card.githubLabels.map((l) => `\`${l}\``).join(", ")
    : "none";

  return `#### #${card.number} — ${card.title}
- **Summary:** ${card.plainSummary}
- **Readiness:** ${card.taxonomy.readiness} · **Area:** ${card.taxonomy.area} · **Priority:** ${card.taxonomy.priority} · **Confidence:** ${card.confidence}
- **GitHub labels:** ${labels} → mapped: ${formatTaxonomyMapping(card.labelMappingNotes)}
- ${card.url}${skills}`;
}

export function formatMarkdown(digest: Digest): string {
  const { meta, snapshot, themes, shortlist, catalog } = digest;
  const lines: string[] = [];

  lines.push(`# Issue digest — ${meta.repo}`);
  lines.push(
    `Analyzed ${meta.analyzedCount} issues · ${meta.dateRange.from} → ${meta.dateRange.to} · generated ${meta.generatedAt.slice(0, 10)}`,
  );
  lines.push("");
  lines.push("## Snapshot");
  lines.push(snapshot.narrative);
  lines.push("");
  lines.push(`- Open analyzed: ${snapshot.stats.total ?? meta.analyzedCount}`);
  lines.push(`- By workType: ${formatStatsLine(snapshot.stats, "workType_")}`);
  lines.push(`- By difficulty: ${formatStatsLine(snapshot.stats, "difficulty_")}`);
  lines.push(`- By readiness: ${formatStatsLine(snapshot.stats, "readiness_")}`);
  lines.push("");

  if (themes.length > 0) {
    lines.push("## Themes");
    themes.forEach((theme, index) => {
      const nums = theme.issueNumbers.map((n) => `#${n}`).join(", ");
      const suffix = nums ? ` — ${nums}` : "";
      lines.push(`${index + 1}. **${theme.name}**${suffix} — ${theme.description}`);
    });
    lines.push("");
  }

  if (shortlist.length > 0) {
    lines.push("## Start here (top 5)");
    shortlist.forEach((item, index) => {
      lines.push(
        `${index + 1}. #${item.number} — ${item.taxonomy.workType} · ${item.taxonomy.difficulty} — ${item.plainSummary} [pick: ${item.pickReason}]`,
      );
      lines.push(`   ${item.url}`);
    });
    lines.push("");
  }

  lines.push("## Catalog");
  lines.push("");
  for (const bucket of catalog.buckets) {
    lines.push(`### ${bucket.workType} · ${bucket.difficulty} (${bucket.issues.length})`);
    lines.push("");
    for (const card of bucket.issues) {
      lines.push(formatIssueCard(card));
      lines.push("");
    }
  }

  return lines.join("\n").trim() + "\n";
}
