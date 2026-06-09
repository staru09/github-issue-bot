const steps = [
  {
    step: "01",
    title: "Fetch",
    desc: "CLI pulls issues via gh — titles, bodies, labels, all of it.",
    color: "bg-accent-subtle",
  },
  {
    step: "02",
    title: "Analyze",
    desc: "LLM summarizes, classifies, clusters, and ranks picks for contributors.",
    color: "bg-purple-subtle",
  },
  {
    step: "03",
    title: "Explore",
    desc: "Upload digest.json — browse overview and issues in the dashboard.",
    color: "bg-success-subtle",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display mb-12 text-center text-3xl font-black tracking-tight sm:text-4xl">
          How it works
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="absolute left-[calc(50%+2rem)] top-10 hidden h-[3px] w-[calc(100%-4rem)] bg-border md:block"
                  aria-hidden
                />
              )}
              <div className="neo-card rounded-xl border-[3px] border-border bg-card p-6 text-center">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-border text-2xl font-black shadow-[4px_4px_0_0_var(--border)] ${s.color}`}
                >
                  {s.step}
                </div>
                <h3 className="mb-2 text-xl font-black">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
