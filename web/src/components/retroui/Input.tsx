import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-[2px_2px_0_0_var(--border)] transition-all placeholder:text-muted-foreground focus:translate-y-px focus:shadow-[1px_1px_0_0_var(--border)] focus:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
