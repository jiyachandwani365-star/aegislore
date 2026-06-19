import Link from "next/link";
import { MailCheck } from "lucide-react";

import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Check your email"
};

export default function VerifyRequestPage() {
  return (
    <AuthPageShell>
      <div className="rounded-lg border bg-card p-6 shadow-soft sm:p-8">
        <MailCheck aria-hidden="true" className="size-6 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold tracking-normal">Check your email</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We sent a secure, short-lived sign-in link. In local development without SMTP, the link is printed in the
          dev server output.
        </p>
        <Button asChild className="mt-6 w-full" variant="outline">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    </AuthPageShell>
  );
}
