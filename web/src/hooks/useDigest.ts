"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { parseDigest } from "@/lib/digest-schema";
import { DIGEST_STORAGE_KEY, type Digest } from "@/lib/types/digest";

export function useDigest() {
  const searchParams = useSearchParams();
  const sample = searchParams.get("sample") === "1";
  const [digest, setDigest] = useState<Digest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

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
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sample]);

  const query = sample ? "?sample=1" : "";

  return { digest, error, loading, sample, query };
}
