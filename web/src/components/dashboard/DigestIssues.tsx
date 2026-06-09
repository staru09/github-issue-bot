import { CatalogPanel } from "@/components/dashboard/CatalogPanel";
import { DigestShell } from "@/components/dashboard/DigestShell";
import { ShortlistPanel } from "@/components/dashboard/ShortlistPanel";
import type { Digest } from "@/lib/types/digest";

export function DigestIssues({
  digest,
  query,
}: {
  digest: Digest;
  query: string;
}) {
  return (
    <DigestShell digest={digest} query={query} activeTab="issues">
      <ShortlistPanel items={digest.shortlist} />
      <CatalogPanel digest={digest} />
    </DigestShell>
  );
}
