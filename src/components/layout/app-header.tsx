import Link from "next/link";
import type { Route } from "next";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOutCurrentUser } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/health-check", label: "Health Check" },
  { href: "/scam-check", label: "Scam Check" },
  { href: "/notifications", label: "Notifications" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" }
] as const;

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link aria-label="AegisLore dashboard" href="/dashboard">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <form action={signOutCurrentUser} className="hidden sm:block">
            <Button size="sm" variant="outline" type="submit">
              <LogOut aria-hidden="true" />
              Logout
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t">
        <div className="container overflow-x-auto">
          <nav
            aria-label="Account navigation"
            className="flex min-w-max items-center gap-1 py-2 text-sm text-muted-foreground"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground",
                  "whitespace-nowrap"
                )}
                href={item.href as Route}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <form action={signOutCurrentUser} className="container border-t py-2 sm:hidden">
        <Button className="w-full" size="sm" variant="outline" type="submit">
          <LogOut aria-hidden="true" />
          Logout
        </Button>
      </form>
    </header>
  );
}
