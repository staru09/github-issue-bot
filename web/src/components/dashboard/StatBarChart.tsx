import type { StatGroup } from "@/lib/stats";

export function StatBarChart({
  title,
  groups,
  total,
}: {
  title: string;
  groups: StatGroup[];
  total?: number;
}) {
  const max = Math.max(...groups.map((g) => g.value), 1);
  const sum = total ?? groups.reduce((a, g) => a + g.value, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <span className="text-xs text-muted-foreground">{sum} total</span>
      </div>
      <div className="space-y-2">
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data</p>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="capitalize text-foreground">{g.label}</span>
                <span className="text-muted-foreground">{g.value}</span>
              </div>
              <div className="h-2.5 w-full rounded-sm border border-border bg-muted overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-500"
                  style={{
                    width: `${(g.value / max) * 100}%`,
                    backgroundColor: g.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
