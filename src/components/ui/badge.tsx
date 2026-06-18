import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-medium transition-colors [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-background text-foreground",
        subtle: "border-transparent bg-muted text-muted-foreground",
        success: "border-primary/25 bg-primary/10 text-primary",
        warning: "border-secondary/25 bg-secondary/10 text-secondary",
        info: "border-accent/25 bg-accent/10 text-accent",
        destructive: "border-primary/30 bg-primary/10 text-primary"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return <Comp className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { badgeVariants };
