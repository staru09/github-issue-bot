import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground border-border",
        open: "bg-success-subtle text-success border-[var(--success-border)]",
        closed: "bg-danger-subtle text-danger border-[var(--danger-border)]",
        accent: "bg-accent-subtle text-accent border-[var(--accent-border)]",
        warning: "bg-warning-subtle text-warning border-[var(--warning-border)]",
        purple: "bg-purple-subtle text-purple border-[var(--purple-border)]",
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
