import Link from "next/link";
import { GitBranch } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <GitBranch className="h-5 w-5 text-accent" />
          Issue Analyser
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-accent">
            Home
          </Link>
          <Link href="/#upload" className="text-muted-foreground hover:text-accent">
            Upload
          </Link>
          <Link href="/view?sample=1" className="text-muted-foreground hover:text-accent">
            Overview
          </Link>
          <Link href="/view/issues?sample=1" className="text-muted-foreground hover:text-accent">
            Issues
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
