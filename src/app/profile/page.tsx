import { ArrowRight, Mail, UserRound } from "lucide-react";
import Link from "next/link";

import { AppPageHeader, AppPageShell } from "@/components/layout/app-page";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <AppPageShell className="max-w-3xl">
      <AppPageHeader
        action={
          <Button asChild className="w-full sm:w-auto" variant="outline">
            <Link href="/settings">
              Account settings
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
        description="Identity details from your sign-in method."
        eyebrow="Account"
        title="Profile"
      />

      <dl className="divide-y border-y">
        <div className="flex gap-4 py-5">
          <UserRound aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <dt className="text-caption text-muted-foreground">Name</dt>
            <dd className="mt-1 font-medium">{user.name ?? "Not provided"}</dd>
          </div>
        </div>
        <div className="flex gap-4 py-5">
          <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <dt className="text-caption text-muted-foreground">Email</dt>
            <dd className="mt-1 font-medium">{user.email ?? "Not provided"}</dd>
          </div>
        </div>
      </dl>
    </AppPageShell>
  );
}
