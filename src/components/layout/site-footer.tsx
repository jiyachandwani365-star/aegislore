import Link from "next/link";

import { Separator } from "@/components/ui/separator";

const footerLinkClass = "transition-colors hover:text-foreground";

const legalLinks = [
  { href: "/legal/methodology.pdf", label: "Methodology" },
  { href: "/legal/terms-of-service.pdf", label: "Terms of Service" },
  { href: "/legal/privacy-policy.pdf", label: "Privacy Policy" }
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <p className="font-semibold">AegisLore</p>
          <p className="mt-2 text-sm text-muted-foreground">Digital health, without panic.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <Link className={footerLinkClass} href="#features">
            Features
          </Link>
          <Link className={footerLinkClass} href="#how-it-works">
            How it works
          </Link>
          {legalLinks.map((link) => (
            <a key={link.href} className={footerLinkClass} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
        <Separator className="md:hidden" />
        <p className="text-sm text-muted-foreground">(c) 2026 AegisLore.</p>
      </div>
    </footer>
  );
}
