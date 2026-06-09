"use client";

import { Button, buttonVariants } from "@/components/retroui/Button";
import { useDigestUpload } from "@/hooks/useDigestUpload";
import { cn } from "@/lib/utils";
import { FileJson, Sparkles, Upload } from "lucide-react";

export function UploadCard({ className }: { className?: string }) {
  const {
    inputRef,
    error,
    dragging,
    setDragging,
    handleFile,
    onDrop,
    openFilePicker,
    viewSample,
  } = useDigestUpload();

  return (
    <div
      id="upload"
      className={cn(
        "neo-card rounded-xl border-[3px] border-border bg-card p-6 md:p-8",
        dragging && "border-accent bg-accent-subtle/20",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="neo-shadow-sm flex h-12 w-12 items-center justify-center rounded-lg border-2 border-border bg-warning-subtle">
          <Upload className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Drop your digest</h3>
          <p className="text-sm text-muted-foreground">
            <code className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
              digests/owner-repo/digest.json
            </code>
          </p>
        </div>
      </div>

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

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className={cn(buttonVariants({ variant: "default", size: "lg" }), "flex-1")}
          onClick={openFilePicker}
        >
          <FileJson className="h-4 w-4" />
          Choose JSON file
        </button>
        <Button variant="outline" size="lg" className="flex-1" onClick={viewSample}>
          <Sparkles className="h-4 w-4" />
          Try sample
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border-2 border-danger bg-danger-subtle px-4 py-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
