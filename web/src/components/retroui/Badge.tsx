import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground border-border",
        open: "bg-success-subtle text-success border-[#82c396]",
        closed: "bg-danger-subtle text-danger border-[#ffbbb9]",
        accent: "bg-accent-subtle text-accent border-[#80ccff]",
        warning: "bg-warning-subtle text-warning border-[#eac54f]",
        purple: "bg-purple-subtle text-purple border-[#d8b9ff]",
        outline: "bg-card text-foreground border-border",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  size,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
