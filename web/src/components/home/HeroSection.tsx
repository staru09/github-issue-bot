"use client";

import Link from "next/link";
import { HeroPreview } from "@/components/home/HeroPreview";
import { buttonVariants } from "@/components/retroui/Button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero-grid relative overflow-hidden border-b-[3px] border-border">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full border-[3px] border-border bg-accent-subtle/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-48 w-48 rotate-12 border-[3px] border-border bg-purple-subtle/50"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="hero-title text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Stop
              <br />
              scrolling.
              <br />
              <span className="text-accent">Start contributing.</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Turn hundreds of GitHub issues into a clear digest: snapshot,
              themes, ranked picks, and a full catalog. Built for maintainers
              and newcomers alike.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#upload"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "gap-2")}
            >
              Upload digest
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/view?sample=1"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
            >
              See it live
            </Link>
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}
