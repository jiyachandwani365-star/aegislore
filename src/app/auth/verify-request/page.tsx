import Link from "next/link";
import { MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Check your email"
};

export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-md">
        <CardHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <MailCheck aria-hidden="true" className="size-5" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a secure, short-lived sign-in link. In local development without SMTP, the link is printed in the
            dev server output.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" variant="outline">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
