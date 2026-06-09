import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t-[3px] border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-sm font-medium text-muted-foreground">
          Issue Analyser. Understand repos, ship faster.
        </p>
        <div className="flex gap-4 text-sm font-semibold">
          <Link href="/view?sample=1" className="hover:text-accent">
            Overview
          </Link>
          <Link href="/view/issues?sample=1" className="hover:text-accent">
            Issues
          </Link>
        </div>
      </div>
    </footer>
  );
}
