import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

export const buttonVariants = cva(
  "font-medium rounded-md cursor-pointer duration-150 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed border transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-[var(--primary-border)] shadow-[2px_2px_0_0_var(--primary-border)] hover:translate-y-px hover:shadow-[1px_1px_0_0_var(--primary-border)] active:translate-y-0.5 active:shadow-none hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground border-border shadow-[2px_2px_0_0_var(--border)] hover:translate-y-px hover:bg-secondary-hover hover:shadow-[1px_1px_0_0_var(--border)] active:translate-y-0.5 active:shadow-none",
        outline:
          "bg-card text-foreground border-border shadow-[2px_2px_0_0_var(--border)] hover:translate-y-px hover:bg-muted hover:shadow-[1px_1px_0_0_var(--border)] active:translate-y-0.5 active:shadow-none",
        accent:
          "bg-accent text-accent-foreground border-[var(--accent-border)] shadow-[2px_2px_0_0_var(--accent-border)] hover:translate-y-px hover:shadow-[1px_1px_0_0_var(--accent-border)] active:translate-y-0.5 active:shadow-none",
        ghost: "border-transparent shadow-none hover:bg-muted",
        link: "border-transparent shadow-none text-accent underline-offset-4 hover:underline p-0",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-1.5 text-sm",
        lg: "px-5 py-2 text-base",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
