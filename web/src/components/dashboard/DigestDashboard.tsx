import { SnapshotPanel } from "@/components/dashboard/SnapshotPanel";
import { ThemesPanel } from "@/components/dashboard/ThemesPanel";
import { ShortlistPanel } from "@/components/dashboard/ShortlistPanel";
import { CatalogPanel } from "@/components/dashboard/CatalogPanel";
import { formatDate } from "@/lib/stats";
import type { Digest } from "@/lib/types/digest";
import { GitBranch } from "lucide-react";

export function DigestDashboard({ digest }: { digest: Digest }) {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <header className="space-y-2 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <GitBranch className="h-4 w-4" />
          <span>Issue digest</span>
          <span>·</span>
          <span>Generated {formatDate(digest.meta.generatedAt)}</span>
          <span>·</span>
          <span>
            {digest.meta.dateRange.from} → {digest.meta.dateRange.to}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          <a
            href={`https://github.com/${digest.meta.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {digest.meta.repo}
          </a>
        </h1>
      </header>

      <SnapshotPanel digest={digest} />
      <ThemesPanel themes={digest.themes} repo={digest.meta.repo} />
      <ShortlistPanel items={digest.shortlist} />
      <CatalogPanel digest={digest} />
    </div>
  );
}
