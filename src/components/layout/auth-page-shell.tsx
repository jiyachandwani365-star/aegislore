import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";

export function AuthPageShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:py-12">
        <Link aria-label="AegisLore home" className="mb-8" href="/">
          <Logo className="size-11" />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
