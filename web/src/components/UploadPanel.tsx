"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/retroui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/retroui/Card";
import { parseDigest } from "@/lib/digest-schema";
import { DIGEST_STORAGE_KEY } from "@/lib/types/digest";
import { cn } from "@/lib/utils";
import { FileJson, Upload } from "lucide-react";

export function UploadPanel() {
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
              : "Invalid digest JSON. Run the CLI with --format json --out digest.json",
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

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Visualize your issue digest</h1>
        <p className="text-sm text-muted-foreground">
          Generate JSON from the CLI, then upload it here to explore snapshot,
          themes, shortlist, and catalog.
        </p>
      </div>

      <Card
        className={cn("transition-colors", dragging && "border-accent bg-accent-subtle/30")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload digest.json
          </CardTitle>
          <CardDescription>
            Drag and drop or choose a file from{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              npm run dev -- analyze owner/repo --format json --out digest.json
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            type="button"
            className={cn(buttonVariants({ variant: "accent", size: "md" }), "w-full")}
            onClick={() => inputRef.current?.click()}
          >
            <FileJson className="h-4 w-4" />
            Choose JSON file
          </button>

          <div className="relative text-center text-xs text-muted-foreground">
            <span className="relative bg-card px-2">or</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-border" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/view?sample=1")}
          >
            View sample digest
          </Button>

          {error && (
            <p className="rounded-md border border-danger bg-danger-subtle px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
