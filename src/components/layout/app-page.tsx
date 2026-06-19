import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { cn } from "@/lib/utils";

export function AppPageShell({
  children,
  className
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className={cn("container min-w-0 py-5 sm:py-8", className)}>{children}</main>
    </div>
  );
}

export function AppPageHeader({
  eyebrow,
  title,
  description,
  action
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}>) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-caption font-medium uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className={cn("text-heading-lg font-semibold tracking-normal text-balance sm:text-4xl", eyebrow ? "mt-2" : undefined)}>
          {title}
        </h1>
        {description ? <p className="mt-3 text-body text-pretty text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="w-full shrink-0 lg:w-auto">{action}</div> : null}
    </div>
  );
}
