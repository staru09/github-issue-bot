import { Card, CardContent, CardHeader, CardTitle } from "@/components/retroui/Card";
import { StatBarChart } from "@/components/dashboard/StatBarChart";
import { extractStats } from "@/lib/stats";
import type { Digest } from "@/lib/types/digest";
import { Activity, GitPullRequest, Layers } from "lucide-react";

export function SnapshotPanel({ digest }: { digest: Digest }) {
  const { snapshot, meta } = digest;
  const workTypes = extractStats(snapshot.stats, "workType_");
  const difficulties = extractStats(snapshot.stats, "difficulty_");
  const readiness = extractStats(snapshot.stats, "readiness_");

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="rounded-md border border-border bg-accent-subtle p-2">
              <GitPullRequest className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{meta.analyzedCount}</p>
              <p className="text-xs text-muted-foreground">Issues analyzed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="rounded-md border border-border bg-success-subtle p-2">
              <Layers className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{digest.themes.length}</p>
              <p className="text-xs text-muted-foreground">Themes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4">
            <div className="rounded-md border border-border bg-purple-subtle p-2">
              <Activity className="h-5 w-5 text-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold">{digest.shortlist.length}</p>
              <p className="text-xs text-muted-foreground">Recommended picks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground">
            {snapshot.narrative}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <StatBarChart title="By work type" groups={workTypes} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <StatBarChart title="By difficulty" groups={difficulties} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <StatBarChart title="By readiness" groups={readiness} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
