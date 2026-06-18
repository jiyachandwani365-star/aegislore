import Link from "next/link";
import type { Route } from "next";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOutCurrentUser } from "@/features/auth/actions";

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
    <header className="border-b bg-background/85 backdrop-blur-xl">
      <div className="container flex min-h-16 flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" aria-label="AegisLore dashboard">
            <Logo />
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Account navigation">
          {navItems.map((item) => (
            <Button key={item.href} asChild size="sm" variant="quiet">
              <Link href={item.href as Route}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <form action={signOutCurrentUser}>
            <Button size="sm" variant="outline" type="submit">
              <LogOut aria-hidden="true" />
              Logout
            </Button>
          </form>
        </div>
        <form action={signOutCurrentUser} className="md:hidden">
          <Button className="w-full" size="sm" variant="outline" type="submit">
            <LogOut aria-hidden="true" />
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
