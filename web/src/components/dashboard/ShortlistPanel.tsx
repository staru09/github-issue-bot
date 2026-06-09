import {
  DifficultyBadge,
  WorkTypeBadge,
} from "@/components/dashboard/TaxonomyBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/retroui/Card";
import type { ShortlistItem } from "@/lib/types/digest";
import { ExternalLink, Star } from "lucide-react";

export function ShortlistPanel({ items }: { items: ShortlistItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Star className="h-5 w-5 text-warning" />
        Start here
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <Card key={item.number}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-accent-subtle text-sm font-bold text-accent">
                    {index + 1}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent hover:underline"
                  >
                    #{item.number} — {item.title}
                  </a>
                </CardTitle>
                <div className="flex flex-wrap gap-1.5">
                  <WorkTypeBadge type={item.taxonomy.workType} />
                  <DifficultyBadge level={item.taxonomy.difficulty} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-foreground">{item.plainSummary}</p>
              <p className="rounded-md border border-border bg-success-subtle/50 px-3 py-2 text-xs text-success">
                <span className="font-semibold">Why pick this: </span>
                {item.pickReason}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
              >
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
