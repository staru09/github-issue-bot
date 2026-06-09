"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { parseDigest } from "@/lib/digest-schema";
import { DIGEST_STORAGE_KEY } from "@/lib/types/digest";

export function useDigestUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          const digest = parseDigest(parsed);
          sessionStorage.setItem(DIGEST_STORAGE_KEY, JSON.stringify(digest));
          router.push("/view");
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "Invalid digest JSON. Run the CLI to generate digest.json first.",
          );
        }
      };
      reader.readAsText(file);
    },
    [router],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return {
    inputRef,
    error,
    dragging,
    setDragging,
    handleFile,
    onDrop,
    openFilePicker,
    viewSample: () => router.push("/view?sample=1"),
  };
}
