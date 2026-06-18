import { ShieldCheck } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { HealthCheckForm } from "@/features/digital-health/components/health-check-form";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Health check"
};

export default async function HealthCheckPage({
  searchParams
}: Readonly<{ searchParams: Promise<{ focus?: string }> }>) {
  await requireUser();
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="mb-8">
          <Badge variant="info" className="mb-4">
            <ShieldCheck aria-hidden="true" />
            Digital health
          </Badge>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Start health check</h1>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">
            Review the basics and get a score with clear recommended actions.
          </p>
        </div>
        <HealthCheckForm focus={params.focus} />
      </main>
    </div>
  );
}
