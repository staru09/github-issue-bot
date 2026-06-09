"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { DigestDashboard } from "@/components/dashboard/DigestDashboard";
import { SiteHeader } from "@/components/SiteHeader";
import { buttonVariants } from "@/components/retroui/Button";
import { parseDigest } from "@/lib/digest-schema";
import { DIGEST_STORAGE_KEY, type Digest } from "@/lib/types/digest";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function ViewContent() {
  const searchParams = useSearchParams();
  const sample = searchParams.get("sample") === "1";
  const [digest, setDigest] = useState<Digest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (sample) {
          const res = await fetch("/sample-digest.json");
          const data = await res.json();
          setDigest(parseDigest(data));
          return;
        }

        const stored = sessionStorage.getItem(DIGEST_STORAGE_KEY);
        if (!stored) {
          setError("No digest loaded. Upload a JSON file from the home page.");
          return;
        }

        setDigest(parseDigest(JSON.parse(stored)));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load digest");
      }
    }

    load();
  }, [sample]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <p className="text-sm text-danger">{error}</p>
        <Link href="/" className={cn(buttonVariants({ variant: "accent" }))}>
          Go to upload
        </Link>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return <DigestDashboard digest={digest} />;
}

export default function ViewPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          }
        >
          <ViewContent />
        </Suspense>
      </main>
    </>
  );
}
