import { Badge } from "@/components/retroui/Badge";

export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="neo-card relative z-10 rotate-1 rounded-xl border-[3px] border-border bg-card p-5 shadow-[8px_8px_0_0_var(--border)]">
        <div className="mb-4 flex items-center justify-between border-b-2 border-border pb-3">
          <span className="font-mono text-xs font-bold text-accent">
            vercel/next.js
          </span>
          <Badge variant="open">20 issues</Badge>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Active docs and bug-fix work across routing and build tooling.
          Several issues are tagged for new contributors.
        </p>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "bugs", value: 8, color: "bg-danger-subtle text-danger" },
            { label: "docs", value: 6, color: "bg-accent-subtle text-accent" },
            { label: "easy", value: 4, color: "bg-success-subtle text-success" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-lg border-2 border-border p-2 text-center ${stat.color}`}
            >
              <p className="text-xl font-black">{stat.value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Start here
          </p>
          {[
            { n: 142, title: "Fix broken link in docs", tag: "easy" },
            { n: 89, title: "Add example for middleware", tag: "ready" },
          ].map((item) => (
            <div
              key={item.n}
              className="flex items-center gap-2 rounded-lg border-2 border-border bg-muted/50 px-3 py-2"
            >
              <span className="font-mono text-xs font-bold text-accent">#{item.n}</span>
              <span className="flex-1 truncate text-xs font-medium">{item.title}</span>
              <Badge variant="open" size="sm">
                {item.tag}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute -right-3 top-6 -z-10 h-full w-full rotate-[-4deg] rounded-xl border-[3px] border-border bg-muted"
        aria-hidden
      />
      <div
        className="neo-sticker absolute -bottom-4 -right-2 z-20 rotate-[6deg] border-[3px] border-border bg-success-subtle px-3 py-1.5 text-xs font-bold text-success shadow-[3px_3px_0_0_var(--border)]"
        aria-hidden
      >
        good first issue
      </div>
    </div>
  );
}
