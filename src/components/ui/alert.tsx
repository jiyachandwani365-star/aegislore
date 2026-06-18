import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva("relative w-full rounded-lg border p-4 text-sm leading-6", {
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground",
      info: "border-accent/25 bg-accent/10 text-foreground [&_svg]:text-accent",
      success: "border-primary/25 bg-primary/10 text-foreground [&_svg]:text-primary",
      warning: "border-secondary/30 bg-secondary/10 text-foreground [&_svg]:text-secondary",
      destructive: "border-primary/30 bg-primary/10 text-foreground [&_svg]:text-primary"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="status" className={cn(alertVariants({ variant, className }))} {...props} />;
}

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-medium leading-none tracking-normal", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-muted-foreground", className)} {...props} />;
}
