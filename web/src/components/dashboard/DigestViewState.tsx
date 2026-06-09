"use client";

import Link from "next/link";
import { Suspense } from "react";
import { DigestIssues } from "@/components/dashboard/DigestIssues";
import { DigestOverview } from "@/components/dashboard/DigestOverview";
import { buttonVariants } from "@/components/retroui/Button";
import { useDigest } from "@/hooks/useDigest";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function DigestViewInner({ page }: { page: "overview" | "issues" }) {
  const { digest, error, loading, query } = useDigest();

  if (error) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
        <p className="text-sm text-danger">{error}</p>
        <Link href="/" className={cn(buttonVariants({ variant: "accent" }))}>
          Go to upload
        </Link>
      </div>
    );
  }

  if (loading || !digest) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (page === "issues") {
    return <DigestIssues digest={digest} query={query} />;
  }

  return <DigestOverview digest={digest} query={query} />;
}

export function DigestViewState({ page }: { page: "overview" | "issues" }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <DigestViewInner page={page} />
    </Suspense>
  );
}
