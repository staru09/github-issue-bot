import { SnapshotPanel } from "@/components/dashboard/SnapshotPanel";
import { ThemesPanel } from "@/components/dashboard/ThemesPanel";
import { DigestShell } from "@/components/dashboard/DigestShell";
import { buttonVariants } from "@/components/retroui/Button";
import type { Digest } from "@/lib/types/digest";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DigestOverview({
  digest,
  query,
}: {
  digest: Digest;
  query: string;
}) {
  return (
    <DigestShell digest={digest} query={query} activeTab="overview">
      <SnapshotPanel digest={digest} />
      <ThemesPanel themes={digest.themes} repo={digest.meta.repo} />

      <div className="flex justify-center pt-2">
        <Link
          href={`/view/issues${query}`}
          className={cn(buttonVariants({ variant: "accent" }), "gap-2")}
        >
          Browse issues
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </DigestShell>
  );
}
