import { BarChart3, Layers, Sparkles, Target } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Snapshot",
    desc: "Instant health read — work types, difficulty, readiness at a glance.",
    accent: "bg-accent-subtle text-accent border-accent-border",
    rotate: "rotate-[-1deg]",
  },
  {
    icon: Layers,
    title: "Themes",
    desc: "Semantic clusters that cut through label noise and show what’s really going on.",
    accent: "bg-purple-subtle text-purple border-purple-border",
    rotate: "rotate-[1deg]",
  },
  {
    icon: Target,
    title: "Start here",
    desc: "Top 5 ranked issues for new contributors — with a clear reason to pick each.",
    accent: "bg-success-subtle text-success border-success-border",
    rotate: "rotate-[-2deg]",
  },
  {
    icon: Sparkles,
    title: "Catalog",
    desc: "Every issue as a card — searchable, filterable, grouped by taxonomy.",
    accent: "bg-warning-subtle text-warning border-warning-border",
    rotate: "rotate-[2deg]",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b-[3px] border-border bg-muted/20 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Four levels of clarity
          </h2>
          <p className="mt-3 text-muted-foreground">
            From 30-second overview to deep issue exploration.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`neo-card group rounded-xl border-[3px] border-border bg-card p-6 transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--border)] ${f.rotate}`}
            >
              <div
                className={`mb-4 inline-flex rounded-lg border-2 p-3 ${f.accent}`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-black">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
