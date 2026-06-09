import { UploadCard } from "@/components/home/UploadCard";

export function UploadSection() {
  return (
    <section className="border-t-[3px] border-border bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Ready to dive in?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Run the CLI, then drop your digest.json below.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-xl">
          <UploadCard />
        </div>
      </div>
    </section>
  );
}
