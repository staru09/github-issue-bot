"use client";

import { useMemo, useState } from "react";
import {
  DifficultyBadge,
  ReadinessBadge,
  WorkTypeBadge,
} from "@/components/dashboard/TaxonomyBadges";
import { Badge } from "@/components/retroui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import type { CatalogBucket, Digest } from "@/lib/types/digest";
import { ExternalLink, Search } from "lucide-react";

function IssueCardView({
  issue,
}: {
  issue: CatalogBucket["issues"][number];
}) {
  return (
    <Card className="shadow-[2px_2px_0_0_var(--border)]">
      <CardHeader className="py-2.5">
        <CardTitle className="text-sm font-semibold">
          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent hover:underline"
          >
            #{issue.number}: {issue.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        <p className="text-sm text-muted-foreground">{issue.plainSummary}</p>
        <div className="flex flex-wrap gap-1.5">
          <ReadinessBadge status={issue.taxonomy.readiness} />
          <Badge variant="outline">area: {issue.taxonomy.area}</Badge>
          {issue.confidence === "low" && (
            <Badge variant="warning">low confidence</Badge>
          )}
        </div>
        {issue.githubLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.githubLabels.map((label) => (
              <Badge key={label} variant="default">
                {label}
              </Badge>
            ))}
          </div>
        )}
        {issue.skillsNeeded && issue.skillsNeeded.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Skills: {issue.skillsNeeded.join(", ")}
          </p>
        )}
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
          Open issue
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}

export function CatalogPanel({ digest }: { digest: Digest }) {
  const [query, setQuery] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("all");

  const allWorkTypes = useMemo(
    () => [...new Set(digest.catalog.buckets.map((b) => b.workType))],
    [digest.catalog.buckets],
  );

  const filteredBuckets = useMemo(() => {
    const q = query.toLowerCase().trim();
    return digest.catalog.buckets
      .filter((b) => workTypeFilter === "all" || b.workType === workTypeFilter)
      .map((bucket) => ({
        ...bucket,
        issues: bucket.issues.filter((issue) => {
          if (!q) return true;
          return (
            issue.title.toLowerCase().includes(q) ||
            issue.plainSummary.toLowerCase().includes(q) ||
            String(issue.number).includes(q) ||
            issue.githubLabels.some((l) => l.toLowerCase().includes(q))
          );
        }),
      }))
      .filter((b) => b.issues.length > 0);
  }, [digest.catalog.buckets, query, workTypeFilter]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Catalog</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 sm:w-56"
            />
          </div>
          <select
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-[2px_2px_0_0_var(--border)]"
          >
            <option value="all">All types</option>
            {allWorkTypes.map((wt) => (
              <option key={wt} value={wt}>
                {wt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredBuckets.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No issues match your filters.
          </CardContent>
        </Card>
      ) : (
        filteredBuckets.map((bucket) => (
          <div key={`${bucket.workType}-${bucket.difficulty}`} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <WorkTypeBadge type={bucket.workType} />
              <DifficultyBadge level={bucket.difficulty} />
              <span className="text-sm text-muted-foreground">
                ({bucket.issues.length})
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {bucket.issues.map((issue) => (
                <IssueCardView key={issue.number} issue={issue} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
