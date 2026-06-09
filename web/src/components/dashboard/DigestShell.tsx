import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Digest } from "@/lib/types/digest";

export function DigestShell({
  digest,
  query,
  activeTab,
  children,
}: {
  digest: Digest;
  query: string;
  activeTab: "overview" | "issues";
  children: React.ReactNode;
}) {
  const tabs = [
    { id: "overview" as const, label: "Overview", href: `/view${query}` },
    { id: "issues" as const, label: "Issues", href: `/view/issues${query}` },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="space-y-4 border-b border-border pb-6">
        <h1 className="text-2xl font-bold text-foreground">
          <a
            href={`https://github.com/${digest.meta.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {digest.meta.repo}
          </a>
        </h1>
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "rounded-md border px-4 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-border bg-muted text-foreground shadow-[2px_2px_0_0_var(--border)]"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
